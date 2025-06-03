import { Component, Input, Output, EventEmitter, forwardRef, ViewChildren, QueryList, ElementRef, AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges, ViewChild, OnDestroy, NgZone, Renderer2, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject, timer, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { SegmentedOption } from './segmented.interface';

@Component({
  selector: 'lib-segmented',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
  /** 选项列表 */
  @ViewChildren('segmentItem') segmentItems!: QueryList<ElementRef>;
  /** 容器 */
  @ViewChild('segmentContainer') segmentContainer!: ElementRef;
  /** 组 */
  @ViewChild('segmentGroup') segmentGroup!: ElementRef;
  /** 滑块 */
  @ViewChild('thumb') thumbElement!: ElementRef;
  /** 根元素 */
  @ViewChild('rootElement') rootElement!: ElementRef;

  /** 选项 */
  @Input({ alias: 'segmentedOptions' }) options: SegmentedOption[] = [];
  /** 是否禁用 */
  @Input({ alias: 'segmentedDisabled' }) disabled = false;
  /** 是否块级 */
  @Input({ alias: 'segmentedBlock' }) block = false;
  /** 大小 */
  @Input({ alias: 'segmentedSize' }) size: 'large' | 'default' | 'small' = 'default';
  /** 最大宽度 */
  @Input({ alias: 'segmentedMaxWidth' }) maxWidth?: number;
  /** 是否适应父容器宽度 */
  @Input({ alias: 'segmentedAdaptParentWidth' }) adaptParentWidth = true;
  /** 模板 */
  @Input({ alias: 'segmentedTemplate' }) template: TemplateRef<any> | null = null;

  /** 当前值 */
  value: string | number | null = null;
  /** 是否为首次渲染 */
  firstRender = true;
  /** 是否可以向左滚动 */
  canScrollLeft = false;
  /** 是否可以向右滚动 */
  canScrollRight = false;
  /** 滚动步长 */
  scrollStep = 150;
  /** 是否显示滚动按钮 */
  showScrollButtons = false;
  /** 滑块位置 */
  thumbPosition = 0;
  /** 滑块宽度 */
  thumbWidth = 0;
  /** 选中索引 */
  selectedIndex = -1;
  /** 重置观察器 */
  private resizeObserver: ResizeObserver | null = null;
  /** 销毁 */
  private destroy$ = new Subject<void>();
  /** 滚动防抖 */
  private scrollDebounce$ = new Subject<void>();
  /** 订阅 */
  private subscriptions: Subscription[] = [];
  /** 选项位置信息 */
  private optionPositions = new Map<string | number, { left: number, width: number }>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    // 设置滚动防抖
    const scrollSub = this.scrollDebounce$.pipe(
      debounceTime(50),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateThumbPosition();
      this.checkScrollButtons();
    });

    this.subscriptions.push(scrollSub);
  }

  ngAfterViewInit() {
    // 应用最大宽度并适应父容器
    this.applyWidthSettings();

    // 延迟初始化，确保DOM已完全渲染
    timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.initializeThumb();
      this.checkScrollButtons();
      this.updateScrollButtonsVisibility();
      this.calculateAllOptionPositions();
      this.observeResize();
      this.monitorItemChanges();

      // 首次渲染后更改标记
      this.firstRender = false;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // 处理maxWidth变化
    if (changes['maxWidth']) {
      this.applyWidthSettings();
      this.updateScrollButtonsVisibility();
    }

    // 处理禁用状态变化
    if (changes['disabled'] && !changes['disabled'].firstChange) {
      this.updateComponentAfterChanges();
    }

    // 处理选项或值变化
    if (changes['options'] || changes['value'] || changes['size']) {
      this.updateComponentAfterChanges();
    }

    // 处理选项变化时的位置重新计算
    if (changes['options']) {
      timer(10).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.calculateAllOptionPositions();
        this.updateThumbPosition();
      });
    }
  }

  ngOnDestroy() {
    // 断开所有观察器
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // 完成所有Subjects
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollDebounce$.complete();

    // 取消所有订阅
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * 初始化thumb位置
   */
  private initializeThumb(): void {
    if (this.value !== null) {
      this.updateThumbPosition(true);
    } else if (this.options.length > 0) {
      // 如果没有初始值，可以选择默认选中第一项非禁用选项
      const firstEnabled = this.options.find(opt => !opt.disabled);
      if (firstEnabled) {
        this.value = firstEnabled.value;
        this.onChange(this.value);
        this.updateThumbPosition(true);
      }
    }
  }

  /**
   * 监听选项变化
   */
  private monitorItemChanges(): void {
    this.segmentItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.updateThumbPosition();
        this.checkScrollButtons();
        this.updateScrollButtonsVisibility();
      });
    });
  }

  /**
   * 监听容器大小变化
   */
  private observeResize(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => {
          this.applyWidthSettings();
          this.calculateAllOptionPositions();
          this.updateThumbPosition();
          this.checkScrollButtons();
          this.updateScrollButtonsVisibility();
        });
      });

      // 监听父容器大小变化
      const body = document.body;
      if (body) {
        this.resizeObserver.observe(body);
      }
    });
  }

  /**
   * 更新组件状态
   */
  private updateComponentAfterChanges(): void {
    timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateThumbPosition();
      this.checkScrollButtons();
      this.updateScrollButtonsVisibility();
    });
  }

  /**
   * 计算并存储所有选项的位置
   */
  private calculateAllOptionPositions(): void {
    if (!this.segmentItems || this.segmentItems.length === 0) return;
    this.optionPositions.clear();
    this.segmentItems.forEach((item, index) => {
      const element = item.nativeElement;
      const option = this.options[index];
      if (option) {
        this.optionPositions.set(option.value, {
          left: element.offsetLeft,
          width: element.offsetWidth
        });
      }
    });
  }

  /**
   * 选择选项
   */
  selectOption(option: SegmentedOption): void {
    if (this.disabled || option.disabled) return;
    // 只在值有变化时更新
    if (this.value !== option.value) {
      // 更新选中值
      this.value = option.value;
      this.onChange(this.value);
      this.onTouched();
      // 找到对应选项的索引和元素
      const index = this.options.findIndex(o => o.value === option.value);
      if (index !== -1 && this.segmentItems) {
        const element = this.segmentItems.toArray()[index]?.nativeElement;
        if (element) {
          // 直接将滑块移动到目标位置
          this.moveThumbToPosition(element.offsetLeft, element.offsetWidth);
        }
      }
      // 滚动到选中项
      this.scrollToSelected();
    }
  }

  /**
   * 检查选项是否被选中
   */
  isSelected(option: SegmentedOption): boolean {
    return this.value === option.value;
  }

  /**
   * 更新滑块位置
   */
  updateThumbPosition(immediate = false): void {
    if (!this.thumbElement || this.value === null) return;
    // 找到选中项的索引
    this.selectedIndex = this.options.findIndex(option => option.value === this.value);
    if (this.selectedIndex === -1 || !this.segmentItems) return;
    // 获取选中项元素
    const selectedElement = this.segmentItems.toArray()[this.selectedIndex]?.nativeElement;
    if (!selectedElement) return;
    // 获取选中项的尺寸和位置
    const width = selectedElement.offsetWidth;
    const left = selectedElement.offsetLeft;
    // 移动滑块到目标位置
    this.moveThumbToPosition(left, width, immediate);
  }

  /**
   * 向左滚动
   */
  scrollLeft(): void {
    if (!this.segmentContainer || !this.canScrollLeft) return;
    const container = this.segmentContainer.nativeElement;
    container.scrollBy({
      left: -this.scrollStep,
      behavior: 'smooth'
    });
    timer(300).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateThumbPosition();
      this.checkScrollButtons();
    });
  }

  /**
   * 向右滚动
   */
  scrollRight(): void {
    if (!this.segmentContainer || !this.canScrollRight) return;
    const container = this.segmentContainer.nativeElement;
    container.scrollBy({
      left: this.scrollStep,
      behavior: 'smooth'
    });
    timer(300).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateThumbPosition();
      this.checkScrollButtons();
    });
  }

  /**
   * 滚动到选中项
   */
  scrollToSelected(): void {
    if (!this.segmentItems || !this.segmentContainer) return;
    const selectedIndex = this.options.findIndex(option => this.isSelected(option));
    if (selectedIndex === -1) return;
    const container = this.segmentContainer.nativeElement;
    const selectedItem = this.segmentItems.toArray()[selectedIndex]?.nativeElement;
    if (!selectedItem) return;
    // 获取选中项和容器的位置信息
    const itemLeft = selectedItem.offsetLeft;
    const itemWidth = selectedItem.offsetWidth;
    const itemRight = itemLeft + itemWidth;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const scrollRight = scrollLeft + containerWidth;
    // 确保选中项完全可见
    if (itemLeft < scrollLeft) {
      // 如果选中项在左侧不可见区域
      container.scrollTo({
        left: itemLeft,
        behavior: this.firstRender ? 'auto' : 'smooth'
      });
    } else if (itemRight > scrollRight) {
      // 如果选中项在右侧不可见区域
      const newScrollLeft = Math.min(
        itemRight - containerWidth,
        container.scrollWidth - containerWidth
      );
      container.scrollTo({
        left: newScrollLeft,
        behavior: this.firstRender ? 'auto' : 'smooth'
      });
    }
    // 更新按钮状态
    timer(300).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.checkScrollButtons();
    });
  }

  /**
   * 监听滚动事件
   */
  onScroll(): void {
    this.scrollDebounce$.next();
    this.checkScrollButtons();
    // 滚动时可能需要重新计算所有位置
    timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calculateAllOptionPositions();
    });
  }

  /**
   * 应用宽度设置
   */
  private applyWidthSettings(): void {
    if (!this.adaptParentWidth) return;
    // 设置100%宽度
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    // 如果没有指定最大宽度，则使用父容器宽度
    if (!this.maxWidth || this.maxWidth <= 0) {
      const parent = this.el.nativeElement.parentElement;
      if (parent) {
        const availableWidth = parent.clientWidth - 10; // 保留一些边距
        if (availableWidth > 0) {
          this.renderer.setStyle(this.el.nativeElement, 'max-width', `${availableWidth}px`);
        }
      }
    }
    // 延迟更新滚动按钮可见性
    timer(100).subscribe(() => {
      this.updateScrollButtonsVisibility();
    });
  }

  /**
   * 移动滑块到指定位置
   */
  private moveThumbToPosition(left: number, width: number, immediate = false): void {
    if (!this.thumbElement) return;
    const thumbElement = this.thumbElement.nativeElement;
    if (immediate || this.firstRender) {
      // 无动画移动
      this.renderer.setStyle(thumbElement, 'transition', 'none');
      this.renderer.setStyle(thumbElement, 'width', `${width}px`);
      this.renderer.setStyle(thumbElement, 'transform', `translateX(${left}px)`);
      // 强制浏览器重绘
      void thumbElement.offsetWidth;
      // 恢复动画
      requestAnimationFrame(() => {
        this.renderer.removeStyle(thumbElement, 'transition');
      });
    } else {
      // 有动画移动
      this.renderer.setStyle(thumbElement, 'transition', 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)');
      // 使用requestAnimationFrame确保过渡效果被正确应用
      requestAnimationFrame(() => {
        this.renderer.setStyle(thumbElement, 'width', `${width}px`);
        this.renderer.setStyle(thumbElement, 'transform', `translateX(${left}px)`);
      });
    }
    // 确保滑块可见
    thumbElement.style.display = 'block';
    this.cdr.detectChanges();
  }

  /**
   * 更新滚动按钮可见性
   */
  updateScrollButtonsVisibility(): void {
    if (!this.segmentContainer || !this.segmentGroup || !this.rootElement) return;
    // 使用rootElement获取wrapper的宽度
    const wrapper = this.rootElement.nativeElement;
    const container = this.segmentContainer.nativeElement;
    const group = this.segmentGroup.nativeElement;
    // 检查真实的内容是否溢出wrapper宽度
    const wrapperWidth = wrapper.clientWidth;
    const contentWidth = group.getBoundingClientRect().width;
    const hasOverflow = contentWidth > wrapperWidth + 4; // 添加一点容差
    // 更新显示状态
    const oldState = this.showScrollButtons;
    this.showScrollButtons = hasOverflow;
    // 强制更新滚动按钮状态
    if (!hasOverflow) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      // 强制滚动回起始位置
      if (container.scrollLeft > 0) {
        container.scrollLeft = 0;
      }
    } else {
      // 重新检查滚动状态
      this.checkScrollButtons();
    }
    if (oldState !== this.showScrollButtons) {
      this.cdr.detectChanges();
    }
  }

  /**
   * 检查滚动按钮状态
   */
  checkScrollButtons(): void {
    if (!this.segmentContainer || !this.segmentGroup) return;
    const container = this.segmentContainer.nativeElement;
    const group = this.segmentGroup.nativeElement;
    // 检查是否有溢出内容
    const hasOverflow = group.scrollWidth > container.clientWidth;
    // 更新是否可以滚动
    const oldLeftState = this.canScrollLeft;
    const oldRightState = this.canScrollRight;
    this.canScrollLeft = hasOverflow && container.scrollLeft > 1;
    this.canScrollRight = hasOverflow &&
      (container.scrollLeft + container.clientWidth < group.scrollWidth - 1);
    // 只有状态变化时才触发变更检测
    if (oldLeftState !== this.canScrollLeft || oldRightState !== this.canScrollRight) {
      this.cdr.detectChanges();
    }
  }

  // ControlValueAccessor 实现
  /** ngModel实现接口 */
  private onChange: (value: string | number | null) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: string | number | null): void {
    const valueChanged = this.value !== value;
    this.value = value;
    if (valueChanged && this.segmentItems) {
      this.cdr.markForCheck();
      timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
        // 如果是首次设置值，使用无动画更新
        this.updateThumbPosition(this.firstRender);
        this.scrollToSelected();
      });
    }
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();

    // 禁用状态改变后，需要更新滑块
    timer(0).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateThumbPosition();
    });
  }
}