import { ChangeDetectorRef, Component, Directive, ElementRef, Input, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * 虚拟滚动指令
 * 用于测量每个渲染项目的实际DOM高度
 * 
 * 工作原理：
 * 1. 在ngAfterViewInit中测量元素的实际高度
 * 2. 通过Subject将高度信息传递给父组件
 * 3. 使用setTimeout确保测量在下一个事件循环中执行，避免变更检测错误
 */
@Directive({
  selector: '[virtual]',
  standalone: true,
})
export class VirtualDirective {
  @Input() subject!: Subject<any>;
  @Input() virtualIndex!: number;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    // 使用setTimeout确保在下一个事件循环中执行，避免NG0100错误
    // 这样可以避免在Angular变更检测周期中触发新的变更
    setTimeout(() => {
      const height = this.elementRef.nativeElement.getBoundingClientRect().height;
      this.subject.next({
        index: this.virtualIndex,
        height: height
      });
    }, 0);
  }
}

/**
 * 虚拟滚动组件 - 基于React Virtualized的实现思路
 * 
 * 核心原理：
 * 1. 【容器层】固定高度的滚动容器，处理滚动事件
 * 2. 【占位层】一个高度等于总内容高度的不可见元素，用于生成正确的滚动条
 * 3. 【内容层】绝对定位的内容容器，通过transform: translateY()精确定位可见内容
 * 
 * 解决的关键问题：
 * - ❌ 滚动跳跃：之前版本使用估算高度导致transform位置不准确
 * - ✅ 精确定位：使用实际测量高度构建累积高度表，transform基于精确位置
 * - ❌ 变更检测错误：高度变化时立即触发重新计算导致NG0100错误
 * - ✅ 异步更新：使用NgZone和setTimeout控制更新时机，批量处理高度变化
 * 
 * 性能优化：
 * - 二分查找：O(log n)时间复杂度快速定位起始索引
 * - 缓冲区机制：在可见区域前后额外渲染几个项目，提升滚动体验
 * - 批量更新：收集多个高度变化后统一处理，减少重复计算
 */
@Component({
  selector: 'app-virtual-scroll',
  imports: [VirtualDirective, CommonModule, FormsModule],
  templateUrl: './virtual-scroll.component.html',
  styleUrl: './virtual-scroll.component.less',
  standalone: true,
})
export class VirtualScrollComponent implements AfterViewInit {
  // 测试数据 - 模拟大量数据场景
  data = Array.from({ length: 1000 }, (_, i) => i);

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  /** 默认item高度 - 用于初始估算和未测量项目的fallback */
  defaultItemHeight: number = 60;

  /** 缓冲区项目数量 - 在可见区域前后额外渲染的项目数，提升滚动体验 */
  overscan: number = 5;

  /** 总元素个数 */
  totalSize: number = 1000;

  /** 获取高度的subject - 用于接收各个项目的实际高度 */
  $height: Subject<any> = new Subject<any>();

  /** 当前渲染的起始索引 - 当前渲染范围的第一个项目索引 */
  startIndex: number = 0;

  /** 当前渲染的结束索引 - 当前渲染范围的最后一个项目索引 */
  endIndex: number = 0;

  /** 内容容器的transform偏移 - 用于精确定位内容在滚动容器中的位置 */
  offsetY: number = 0;

  /** 总高度（用于滚动条） - 所有项目的累积高度，用于生成正确的滚动条 */
  totalHeight: number = 0;

  /** 变化的项目数量 */
  changeProjectNumber: number = 4;

  /** 项目高度缓存 - 存储每个项目的实际测量高度 */
  private itemHeights = new Map<number, number>();

  /** 
   * 累积高度缓存 - 核心数据结构
   * accumulatedHeights[i] 表示从第0个项目到第i个项目（不包含）的累积高度
   * 例如：[0, 50, 130, 190, ...] 表示项目0在位置0，项目1在位置50，项目2在位置130
   * 这是实现精确定位的关键，避免了估算误差导致的跳跃问题
   */
  private accumulatedHeights: number[] = [];

  /** 是否正在更新 - 防止重复更新的标志位 */
  private isUpdating = false;

  /** 
   * 待处理的高度更新队列 - 批量处理机制
   * 收集所有需要更新高度的项目索引，然后统一处理
   * 避免频繁的重新计算，提升性能
   */
  private pendingHeightUpdates = new Set<number>();

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initHeightSubject();
      this.calculateInitialState();
      this.calculateVisibleRange();
    }, 0);
  }

  /**
   * 初始化高度监听
   * 
   * 处理流程：
   * 1. 接收来自VirtualDirective的高度信息
   * 2. 检查高度是否发生变化
   * 3. 如果变化，加入待处理队列
   * 4. 使用防抖机制批量处理，避免频繁更新
   * 
   * 关键优化：
   * - 防抖处理：避免在短时间内频繁更新
   * - 异步处理：避免在Angular变更检测周期中触发更新
   * - 批量更新：收集多个变化后统一处理
   * - 去重机制：同一个项目的多次更新只处理一次
   */
  initHeightSubject() {
    this.$height.subscribe((data) => {
      const oldHeight = this.itemHeights.get(data.index) || this.defaultItemHeight;
      const newHeight = data.height;
      // 只有高度真正变化且变化幅度超过阈值时才处理
      const heightDiff = Math.abs(newHeight - oldHeight);
      if (heightDiff > 1) { // 1px的容差，避免浮点数精度问题
        // 更新高度缓存
        this.itemHeights.set(data.index, newHeight);
        // 加入待处理队列
        this.pendingHeightUpdates.add(data.index);
        // 使用防抖机制，避免频繁更新
        this.debouncedUpdateHeights();
      }
    });
  }

  /** 防抖定时器 */
  private updateHeightsTimer: any;

  /**
   * 防抖的高度更新方法
   * 
   * 防抖策略：
   * - 在50ms内如果有新的高度变化，重置定时器
   * - 只有在50ms内没有新变化时，才执行实际更新
   * - 这样可以将多个快速连续的高度变化合并为一次更新
   */
  private debouncedUpdateHeights() {
    if (this.updateHeightsTimer) {
      clearTimeout(this.updateHeightsTimer);
    }

    this.updateHeightsTimer = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.processPendingHeightUpdates();
          });
        }, 0);
      });
    }, 50); // 50ms防抖延迟
  }

  /**
   * 处理待处理的高度更新 - 批量更新机制（优化版）
   * 
   * 工作流程：
   * 1. 检查是否有待处理的更新
   * 2. 保存当前滚动位置
   * 3. 对更新的索引进行排序，便于增量计算
   * 4. 增量更新累积高度（只更新受影响的部分）
   * 5. 智能调整滚动位置，减少跳跃感
   * 6. 重新计算可见范围
   * 
   * 性能优化：
   * - 增量更新：只重新计算受影响的累积高度，而不是全部重算
   * - 排序优化：按索引排序，确保从小到大更新，减少重复计算
   * - 位置保持：尽量保持用户当前的视觉位置不变
   */
  private processPendingHeightUpdates() {
    if (this.pendingHeightUpdates.size === 0) return;
    // 保存当前状态
    // 将待更新的索引转换为排序数组，便于增量处理
    const updatedIndices = Array.from(this.pendingHeightUpdates).sort((a, b) => a - b);
    this.pendingHeightUpdates.clear();
    // 增量更新累积高度
    this.incrementalUpdateHeights(updatedIndices);
    // 重新计算可见范围
    const finalScrollTop = this.scrollContainer?.nativeElement?.scrollTop || 0;
    this.calculateVisibleRange(finalScrollTop);
  }

  /**
   * 增量更新累积高度 - 性能优化的核心（稳定版）
   * 
   * 算法说明：
   * 1. 只重新计算发生变化的项目及其后续项目的累积高度
   * 2. 计算高度差值，然后批量应用到后续所有项目
   * 3. 使用更精确的高度差值计算，减少累积误差
   * 
   * 稳定性优化：
   * - 精确计算：使用实际高度而不是估算
   * - 误差控制：避免浮点数累积误差
   * - 边界检查：确保索引在有效范围内
   * 
   * @param updatedIndices 已排序的需要更新的项目索引数组
   */
  private incrementalUpdateHeights(updatedIndices: number[]) {
    if (updatedIndices.length === 0) return;

    // 如果累积高度表还未初始化，执行全量计算
    if (this.accumulatedHeights.length === 0) {
      this.fullRecalculateHeights();
      return;
    }

    let totalHeightDiff = 0;

    // 按顺序处理每个变化的项目
    for (const index of updatedIndices) {
      // 边界检查
      if (index < 0 || index >= this.totalSize) {
        continue;
      }
      const newHeight = this.itemHeights.get(index) || this.defaultItemHeight;

      // 计算旧高度：如果是第一个项目，旧高度就是默认高度
      // 否则通过累积高度差值计算
      let oldHeight: number;
      if (index === 0) {
        oldHeight = this.defaultItemHeight;
      } else if (index < this.accumulatedHeights.length - 1) {
        oldHeight = this.accumulatedHeights[index + 1] - this.accumulatedHeights[index];
      } else {
        oldHeight = this.defaultItemHeight;
      }

      const heightDiff = newHeight - oldHeight;

      if (Math.abs(heightDiff) > 0.1) { // 0.1px的容差
        // 更新从当前索引+1开始的所有累积高度
        for (let i = index + 1; i < this.accumulatedHeights.length; i++) {
          this.accumulatedHeights[i] += heightDiff;
        }

        totalHeightDiff += heightDiff;
      }
    }
    // 更新总高度
    this.totalHeight += totalHeightDiff;
  }

  /**
   * 获取指定索引处的项目高度
   * 
   * 优先级：
   * 1. 实际测量的高度（itemHeights）
   * 2. 默认高度（defaultItemHeight）
   * 
   * @param index 项目索引
   * @returns 项目高度
   */
  private getHeightAtIndex(index: number): number {
    return this.itemHeights.get(index) || this.defaultItemHeight;
  }

  /**
   * 全量重新计算所有高度 - 仅在必要时使用
   * 
   * 使用场景：
   * - 初始化时
   * - 累积高度表损坏时
   * - 大量项目同时变化时（超过阈值）
   * 
   * 算法说明：
   * 1. 遍历所有项目，获取实际高度或使用默认高度
   * 2. 计算每个位置的累积高度：accumulatedHeights[i] = 前i个项目的总高度
   * 3. 更新总高度用于滚动条
   * 
   * 关键作用：
   * - 这是解决跳跃问题的核心：提供精确的位置信息
   * - 支持可变高度：每个项目可以有不同的高度
   * - 高效查找：为二分查找提供有序的累积高度数组
   * 
   * 示例：
   * 项目高度: [50, 80, 60, 70]
   * 累积高度: [0, 50, 130, 190, 260]
   * 含义: 项目0在位置0，项目1在位置50，项目2在位置130...
   * 
   * ⚠️ 性能警告：对于大数据集，这个方法很耗时，应该尽量避免调用
   */
  private fullRecalculateHeights() {
    this.accumulatedHeights = [];
    let accumulatedHeight = 0;
    for (let i = 0; i < this.totalSize; i++) {
      // 存储到当前项目为止的累积高度
      this.accumulatedHeights[i] = accumulatedHeight;
      // 获取当前项目的实际高度或使用默认高度
      const itemHeight = this.getHeightAtIndex(i);
      // 累加到总高度
      accumulatedHeight += itemHeight;
    }
    // 更新总高度，用于滚动条显示
    this.totalHeight = accumulatedHeight;
  }

  /**
   * 计算初始状态 - 组件初始化时的状态设置
   * 
   * 初始化内容：
   * 1. 使用默认高度估算总高度
   * 2. 构建初始的累积高度表
   * 3. 计算初始可见范围
   * 
   * 设计思路：
   * - 先用估算值快速初始化，避免空白页面
   * - 后续通过实际测量逐步修正
   * - 确保初始渲染的项目数量合理
   */
  private calculateInitialState() {
    // 使用全量计算方法初始化累积高度表
    this.fullRecalculateHeights();

    // 计算初始可见范围
    const visibleCount = Math.ceil(this.scrollContainer.nativeElement.clientHeight / this.defaultItemHeight);
    this.startIndex = 0;
    this.endIndex = Math.min(visibleCount + this.overscan, this.totalSize);
    this.offsetY = 0;
  }

  /**
   * 根据scrollTop查找起始索引 - 高效查找算法
   * 
   * 算法：二分查找
   * 时间复杂度：O(log n)
   * 
   * 查找逻辑：
   * 1. 在累积高度数组中查找scrollTop对应的项目
   * 2. 找到满足条件的项目：scrollTop >= 项目顶部 && scrollTop < 项目底部
   * 3. 返回该项目的索引
   * 
   * 优势：
   * - 高效：即使有百万级数据也能快速定位
   * - 精确：基于实际累积高度，不会有估算误差
   * - 稳定：查找结果一致，不会导致跳跃
   * 
   * @param scrollTop 当前滚动位置
   * @returns 应该显示的起始项目索引
   */
  private findStartIndex(scrollTop: number): number {
    // 二分查找
    let left = 0;
    let right = this.totalSize - 1;

    while (left <= right) {
      // 获取中间索引
      const mid = Math.floor((left + right) / 2);
      // 获取中间索引起始位置
      const midTop = this.accumulatedHeights[mid];
      // 获取中间索引元素高度
      const midHeight = this.itemHeights.get(mid) || this.defaultItemHeight;

      // 如果当前scrollTop在中间索引范围内，则返回中间索引
      if (scrollTop >= midTop && scrollTop < midTop + midHeight) {
        return mid;
      }
      // 如果当前scrollTop小于中间索引起始位置，则将右边界缩小到中间索引-1
      else if (scrollTop < midTop) {
        right = mid - 1;
      }
      // 如果当前scrollTop大于中间索引起始位置，则将左边界扩大到中间索引+1
      else {
        left = mid + 1;
      }
    }
    // 如果二分查找失败，则返回左边界和右边界中的较小值
    return Math.min(left, this.totalSize - 1);
  }

  /**
   * 计算可见范围 - 虚拟滚动的核心逻辑（稳定版）
   * 
   * 计算步骤：
   * 1. 根据scrollTop找到起始项目索引
   * 2. 从起始位置开始，累加项目高度直到超出可视区域
   * 3. 添加缓冲区项目，提升滚动体验
   * 4. 计算内容容器的transform偏移量
   * 
   * 稳定性优化：
   * - 防抖机制：避免频繁的范围变化
   * - 最小变化阈值：只有范围变化足够大时才更新
   * - 精确定位：使用精确的累积高度设置偏移量
   * 
   * @param scrollTop 当前滚动位置，默认为0
   */
  private calculateVisibleRange(scrollTop: number = 0) {
    if (this.isUpdating) return;

    // 找到起始索引 - 使用二分查找，基于精确的累积高度
    const start = this.findStartIndex(scrollTop);

    // 计算结束索引 - 累加高度直到超出可视区域
    let end = start;
    let currentHeight = this.accumulatedHeights[start] || 0;
    const maxHeight = scrollTop + this.scrollContainer.nativeElement.clientHeight;

    while (end < this.totalSize && currentHeight < maxHeight) {
      const itemHeight = this.itemHeights.get(end) || this.defaultItemHeight;
      currentHeight += itemHeight;
      end++;
    }

    // 添加缓冲区 - 在可见范围前后额外渲染overscan个项目
    const newStartIndex = Math.max(0, start - this.overscan);
    const newEndIndex = Math.min(this.totalSize, end + this.overscan);

    // 只有当范围变化足够大时才更新 - 减少不必要的重新渲染
    const startDiff = Math.abs(newStartIndex - this.startIndex);
    const endDiff = Math.abs(newEndIndex - this.endIndex);

    if (startDiff >= this.changeProjectNumber || endDiff >= this.changeProjectNumber) { // 至少变化changeProjectNumber个项目才更新
      this.startIndex = newStartIndex;
      this.endIndex = newEndIndex;
      // 关键：使用精确的累积高度设置transform偏移量
      this.offsetY = this.accumulatedHeights[newStartIndex] || 0;
    }
  }

  /**
   * 滚动事件处理 - 响应用户滚动操作
   * 
   * 处理流程：
   * 1. 获取当前滚动位置
   * 2. 重新计算可见范围
   * 3. 更新渲染内容
   * 
   * 性能考虑：
   * - 滚动事件频繁触发，但calculateVisibleRange内部有优化
   * - 只有范围真正改变时才会触发重新渲染
   * - 使用精确计算避免不必要的DOM操作
   */
  onScroll(event: Event) {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.calculateVisibleRange(scrollTop);
  }

  /**
   * 获取要渲染的数据数组 - 提供给模板使用
   * 
   * 返回格式：
   * [
   *   { data: 原始数据, index: 在总数据中的索引 },
   *   ...
   * ]
   * 
   * 设计考虑：
   * - 包含原始数据和索引信息
   * - 索引用于trackBy和高度测量
   * - 只返回当前需要渲染的项目，实现虚拟化
   */
  getVisibleItems() {
    return this.data.slice(this.startIndex, this.endIndex).map((item, index) => ({
      data: item,
      index: this.startIndex + index
    }));
  }

  /**
   * 获取项目的动态高度 - 模拟可变高度场景
   * 
   * 测试用途：
   * - 创建不同高度的项目来测试可变高度功能
   * - 验证虚拟滚动在可变高度下的稳定性
   * 
   * 高度规律：
   * - 基础高度40px
   * - 根据项目索引添加0-80px的变化
   * - 模拟真实场景中内容长度不同的情况
   */
  getItemHeight(item: number): number {
    const baseHeight = 60;
    const variation = (item % 5) * 20; // 0, 20, 40, 60, 80
    return baseHeight + variation;
  }

  /**
   * 获取项目样式 - 为每个项目设置正确的高度样式
   * 
   * 样式设置：
   * - height: 设置项目的实际高度
   * - line-height: 设置行高，用于垂直居中
   * 
   * 重要性：
   * - 确保每个项目有正确的高度
   * - 为高度测量提供准确的DOM尺寸
   */
  getItemStyle(index: number) {
    const height = this.getItemHeight(this.data[index]);
    return {
      height: height + 'px',
      'line-height': height + 'px'
    };
  }

  /**
   * TrackBy函数 - Angular性能优化
   * 
   * 作用：
   * - 告诉Angular如何跟踪列表项的变化
   * - 避免不必要的DOM创建和销毁
   * - 提升大列表的渲染性能
   * 
   * 使用项目索引作为唯一标识，确保：
   * - 相同索引的项目会被复用
   * - 只有真正变化的项目才会重新渲染
   */
  trackByIndex = (index: number, item: any) => {
    return item.index;
  }
}
