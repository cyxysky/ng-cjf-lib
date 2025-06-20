import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, NgZone, Renderer2, TemplateRef, HostListener, OnDestroy } from '@angular/core';

import { ChartService } from '../chart.service';

export interface PieChartData {
  name: string;
  data: number;
  color?: string;
  percentage?: number;
  _id?: string;
}

export interface PieChartOptions {
  width?: number;
  height?: number;
  colors?: string[];
  backgroundColor?: string;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  showLegend?: boolean;
  donutText?: string;
  animate?: boolean;
  title?: string;
  dynamicSlices?: boolean;
  minSlicePercent?: number;
  onClick?: (info: {
    item: PieChartData;
    index: number;
    data: PieChartData[];
    options: PieChartOptions;
    event: MouseEvent;
  }) => void;
  legend?: {
    position?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
  hoverEffect?: {
    enabled?: boolean;
    showTooltip?: boolean;
    expandSlice?: boolean;
    expandRadius?: number;
    tooltipHoverable?: boolean;
  };
}

@Component({
  selector: 'lib-pie',
  standalone: true,
  imports: [],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.less'
})
export class PieComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('pieCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pieTooltip', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>;
  @ViewChild('defaultTooltip', { static: true }) defaultTooltipRef!: TemplateRef<{ $implicit: any }>;

  @Input() data: PieChartData[] = [];
  @Input() options: PieChartOptions = {};
  @Input() tooltipTemplate?: TemplateRef<{ $implicit: any }>;

  private ctx!: CanvasRenderingContext2D;
  private width = 300;
  private height = 300;
  private centerX = 150;
  private centerY = 150;
  private outerRadius = 120;
  private innerRadius = 0; // 默认为实心圆
  public hoveredIndex: number = -1;
  private animationProgress = 0;
  private animationFrameId: number | null = null;
  public processedData: Array<PieChartData & { startAngle: number; endAngle: number }> = [];
  public sliceVisibility: boolean[] = [];
  private mousePosition: { x: number, y: number } = { x: 0, y: 0 };
  private isTooltipHovered: boolean = false;
  private canvasScale: number = 1;

  // 默认选项
  private defaultOptions: PieChartOptions = {
    colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8341f4', '#3acfb4', '#fa7e1e', '#dc3545'],
    backgroundColor: '#ffffff',
    showLabels: true,
    showPercentage: true,
    showLegend: true,
    animate: true,
    dynamicSlices: true,
    legend: {
      position: 'top',
      align: 'center'
    },
    hoverEffect: {
      enabled: true,
      showTooltip: true,
      expandSlice: true,
      expandRadius: 10,
      tooltipHoverable: false
    }
  };

  // 合并后的选项
  public mergedOptions!: PieChartOptions;

  // MutationObserver实例
  private legendObserver: MutationObserver | null = null;

  // 标记是否正在切换状态，防止重复触发
  private _isToggling: boolean = false;

  constructor(
    private chartService: ChartService,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
    // 初始化合并的选项
    this.mergedOptions = { ...this.defaultOptions };
  }

  ngOnInit(): void {
    console.log('ngOnInit');

    // 合并用户提供的选项与默认选项
    this.mergedOptions = { ...this.defaultOptions, ...this.options };
    this.processData();
    this.draw();
  }

  ngAfterViewInit(): void {
    // 延迟初始化，确保容器已完全渲染
    setTimeout(() => {
      this.initializeCanvas();
      this.draw();

      // 设置事件监听器
      const canvas = this.canvasRef.nativeElement;
      const tooltip = this.tooltipRef.nativeElement;

      this.ngZone.runOutsideAngular(() => {
        // 添加Canvas事件监听器
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        canvas.addEventListener('click', this.handleCanvasClick.bind(this));

        // 添加Tooltip事件监听器
        tooltip.addEventListener('mouseenter', () => {
          if (this.isTooltipHoverable()) {
            this.isTooltipHovered = true;
          }
        });

        tooltip.addEventListener('mouseleave', () => {
          if (this.isTooltipHoverable()) {
            this.isTooltipHovered = false;
            if (this.hoveredIndex === -1) this.hideTooltip();
          }
        });
      });

      // 添加窗口大小变化监听，以便重新计算图表尺寸
      window.addEventListener('resize', this.handleResize.bind(this));

      // 确保图例可点击
      this.ensureLegendClickable();

      // 重新创建MutationObserver，避免重复观察
      this.destroyLegendObserver();

      // 使用MutationObserver监听DOM变化，确保图例始终可点击
      this.legendObserver = new MutationObserver(() => {
        this.ensureLegendClickable();
      });

      if (this.containerRef && this.containerRef.nativeElement) {
        this.legendObserver.observe(this.containerRef.nativeElement, {
          childList: true,
          subtree: true
        });
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] || changes['options']) && this.ctx) {
      // 更新合并的选项
      this.mergedOptions = { ...this.defaultOptions, ...this.options };
      this.processData();
      this.draw();
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    // 移除事件监听器
    try {
      window.removeEventListener('resize', this.handleResize.bind(this));

      // 直接使用bind创建新的处理函数时无法精确移除之前绑定的匿名函数
      // 因此这里不尝试移除canvas和tooltip上的事件监听器
      // 这由Angular的组件销毁机制处理
    } catch (error) {
      console.error('移除事件监听器失败:', error);
    }

    // 取消任何正在进行的动画
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 取消所有扇区动画
    this.cancelAllSliceAnimations();

    // 销毁MutationObserver
    this.destroyLegendObserver();
  }

  private processData(): void {
    if (!this.data || this.data.length === 0) return;
    // 确保所有数据项都有颜色
    const coloredData = this.chartService.assignPieColors(this.data, this.mergedOptions.colors);
    // 计算每个扇区的角度
    this.processedData = this.chartService.calculatePieAngles(coloredData, this.mergedOptions.minSlicePercent) as Array<PieChartData & { startAngle: number; endAngle: number }>;
    // 初始化扇区可见性数组
    this.sliceVisibility = this.processedData.map(() => true);
  }

  private initializeCanvas(skipAnimation: boolean = false): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 获取实际容器大小
    const container = this.containerRef.nativeElement;
    const containerRect = container.getBoundingClientRect();
    // 计算容器实际可用空间（减去padding）
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    // 实际可用宽高 = 容器宽高 - padding
    let availableWidth = containerRect.width - paddingLeft - paddingRight;
    let availableHeight = containerRect.height - paddingTop - paddingBottom;
    // 防止容器尺寸过小
    if (availableWidth < 100) availableWidth = 300;
    if (availableHeight < 100) availableHeight = 300;
    // 应用设置的宽高或使用容器的尺寸
    this.width = this.mergedOptions.width || availableWidth;
    this.height = this.mergedOptions.height || availableHeight;
    // 检查是否为环形图
    const isDonut = this.mergedOptions.innerRadius && this.mergedOptions.innerRadius > 0;
    // 如果是环形图，强制图例位置在上方
    if (isDonut && this.mergedOptions.showLegend) {
      if (!this.mergedOptions.legend) {
        this.mergedOptions.legend = {};
      }
      this.mergedOptions.legend.position = 'top';
    }

    // 根据图例位置适当调整尺寸
    const legendPosition = this.getLegendPosition();
    if (this.showLegend()) {
      if (legendPosition === 'left' || legendPosition === 'right') {
        this.width = this.width * 0.8; // 给图例留出空间
      } else if (legendPosition === 'top' || legendPosition === 'bottom') {
        this.height = this.height * 0.85; // 给图例留出空间
      }
    }

    // 设置画布大小和DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.width * dpr;
    canvas.height = this.height * dpr;
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    this.canvasScale = dpr;

    // 计算中心点和半径
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.outerRadius = this.mergedOptions.outerRadius || Math.min(this.width, this.height) * 0.4;

    // 环形图的内半径调整
    if (isDonut) {
      // 对于环形图，将内径设置得足够大，完全消除中间小扇形的部分
      this.innerRadius = this.outerRadius * 0.6; // 将内径设置为外径的60%

      // 如果用户设置了更大的内径，则使用用户设置
      if (this.mergedOptions.innerRadius && this.mergedOptions.innerRadius > this.innerRadius) {
        this.innerRadius = this.mergedOptions.innerRadius;
      }
    } else {
      this.innerRadius = 0; // 普通饼图没有内径
    }

    // 重置动画
    if (this.mergedOptions.animate && !skipAnimation) {
      this.animationProgress = 0;
      this.startAnimation();
    } else {
      this.animationProgress = 1;
    }

    // 确保图例元素的事件处理正常
    setTimeout(() => {
      // 确保所有图例元素的指针事件都是启用的
      const legendElements = container.querySelectorAll('.legend-item');
      legendElements.forEach(element => {
        (element as HTMLElement).style.pointerEvents = 'auto';
      });
    }, 0);
  }

  private startAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = () => {
      this.animationProgress += 0.05;
      if (this.animationProgress >= 1) {
        this.animationProgress = 1;
        this.draw();
        this.animationFrameId = null;
        return;
      }

      this.draw();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private draw(): void {
    if (!this.ctx || this.processedData.length === 0) return;

    // 清除画布
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 应用背景颜色 - 默认透明背景
    if (this.mergedOptions.backgroundColor) {
      this.ctx.fillStyle = this.mergedOptions.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 绘制标题
    if (this.mergedOptions.title) {
      this.ctx.fillStyle = '#333';
      this.ctx.textAlign = 'center';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(this.mergedOptions.title, this.centerX, 25); // 调整标题位置
    }

    // 判断是否为环形图
    const isDonut = this.innerRadius > 0;

    // 绘制可见的饼图扇区
    this.processedData.forEach((item, index) => {
      if (!this.sliceVisibility[index]) return;

      const animatedEndAngle = item.startAngle + (item.endAngle - item.startAngle) * this.animationProgress;
      const isHovered = index === this.hoveredIndex;

      this.ctx.save();

      // 如果悬停且启用了扩展效果
      if (isHovered && this.mergedOptions.hoverEffect?.expandSlice) {
        const expandRadius = this.mergedOptions.hoverEffect.expandRadius || 10;
        const midAngle = (item.startAngle + animatedEndAngle) / 2;
        const offsetX = Math.cos(midAngle) * expandRadius;
        const offsetY = Math.sin(midAngle) * expandRadius;
        this.ctx.translate(offsetX, offsetY);
      }

      // 绘制扇区
      this.ctx.beginPath();

      if (isDonut) {
        // 环形图，直接从外圆弧开始，避免从中心点画线
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, item.startAngle, animatedEndAngle);
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, animatedEndAngle, item.startAngle, true);
        this.ctx.closePath();
      } else {
        // 普通饼图，从中心点开始
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, item.startAngle, animatedEndAngle);
        this.ctx.lineTo(this.centerX, this.centerY);
      }

      // 设置填充样式 - 使用原始颜色，不进行高亮
      this.ctx.fillStyle = item.color || '#ccc';
      this.ctx.fill();

      // 添加悬停效果 - 保留除颜色高亮外的其他视觉效果
      if (isHovered) {
        // 添加阴影效果
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // 增加边框宽度，提供视觉反馈
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
      } else {
        // 非悬停状态的边框样式
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 1;
      }

      this.ctx.stroke();
      this.ctx.restore();
    });

    // 绘制标签
    if (this.mergedOptions.showLabels && this.animationProgress === 1) {
      this.drawLabels();
    }

    // 如果是环形图，绘制中心文本
    if (this.innerRadius > 0 && this.mergedOptions.donutText && this.animationProgress === 1) {
      this.drawDonutText();
    }
  }

  private drawDonutText(): void {
    if (!this.mergedOptions.donutText) return;

    this.ctx.save();

    // 文本阴影效果
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 1;

    // 绘制主文本
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = 'bold 16px Arial'; // 稍微增大字体
    this.ctx.fillText(this.mergedOptions.donutText, this.centerX, this.centerY);

    this.ctx.restore();
  }

  private drawLabels(): void {
    this.processedData.forEach((item, index) => {
      if (!this.sliceVisibility[index]) return;

      const midAngle = (item.startAngle + item.endAngle) / 2;
      // 调整标签位置，放在扇形外侧而不是在中间
      const labelRadius = this.outerRadius * 0.75;

      // 计算标签位置
      const x = this.centerX + Math.cos(midAngle) * labelRadius;
      const y = this.centerY + Math.sin(midAngle) * labelRadius;

      this.ctx.save();

      // 根据位置决定文本对齐方式
      this.ctx.textAlign = 'center'; // 改为居中对齐

      // 文本阴影，增强可读性
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      this.ctx.shadowBlur = 3;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 1;

      // 仅绘制数值，不绘制名称
      const valueText = this.formatValue(item.data);
      const percentageText = `${item.percentage?.toFixed(1)}%`;

      // 使用艺术字体，不绘制背景
      this.ctx.font = 'bold 14px "Arial", sans-serif';
      this.ctx.fillStyle = '#fff'; // 使用白色，增强对比度
      this.ctx.textBaseline = 'middle';

      // 绘制描边效果增强可读性
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.lineWidth = 3;
      this.ctx.lineJoin = 'round'; // 圆角连接提高可读性
      this.ctx.strokeText(valueText, x, y);

      // 填充文本
      this.ctx.fillText(valueText, x, y);

      this.ctx.restore();
    });
  }

  /**
   * 使颜色变亮
   */
  private lightenColor(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const brightenFactor = percent / 100;
    const brightenR = Math.min(255, Math.round(r + (255 - r) * brightenFactor));
    const brightenG = Math.min(255, Math.round(g + (255 - g) * brightenFactor));
    const brightenB = Math.min(255, Math.round(b + (255 - b) * brightenFactor));

    const rStr = brightenR.toString(16).padStart(2, '0');
    const gStr = brightenG.toString(16).padStart(2, '0');
    const bStr = brightenB.toString(16).padStart(2, '0');

    return `#${rStr}${gStr}${bStr}`;
  }

  /**
   * 图例相关方法
   */
  public showLegend(): boolean {
    return this.mergedOptions.showLegend !== false && this.processedData.length > 0;
  }

  public getLegendPosition(): string {
    return this.mergedOptions.legend?.position || 'top';
  }

  public isSliceVisible(index: number): boolean {
    return this.sliceVisibility[index] === true;
  }

  /**
   * 切换扇区选择状态
   */
  public toggleSliceSelection(index: number): void {
    // 防止重复触发
    if (this._isToggling) {
      return;
    }

    try {
      this._isToggling = true;

      // 立即取消所有动画
      this.cancelAllAnimations();

      // 切换可见性
      this.sliceVisibility[index] = !this.sliceVisibility[index];

      // 如果启用了动态扇区，则重新计算角度
      if (this.mergedOptions.dynamicSlices) {
        // 过滤出可见的数据
        const visibleData = this.processedData.filter((_, i) => this.sliceVisibility[i]);

        // 重新计算可见数据的角度，直接应用无需动画
        if (visibleData.length > 0) {
          const recalculatedData = this.chartService.calculatePieAngles(visibleData);

          // 更新原始数据中可见项的角度（直接应用，不使用动画）
          let visibleIndex = 0;
          for (let i = 0; i < this.processedData.length; i++) {
            if (this.sliceVisibility[i]) {
              // 直接设置新角度，不使用动画
              this.processedData[i].startAngle = recalculatedData[visibleIndex].startAngle;
              this.processedData[i].endAngle = recalculatedData[visibleIndex].endAngle;

              // 更新百分比
              this.processedData[i].percentage = recalculatedData[visibleIndex].percentage;

              visibleIndex++;
            }
          }
        }
      }

      // 重置动画进度并直接绘制（跳过动画）
      this.animationProgress = 1;

      // 如果取消选中当前悬停的扇区，重置悬停状态
      if (this.hoveredIndex === index && !this.sliceVisibility[index]) {
        this.hoveredIndex = -1;
      }

      // 同步绘制，避免使用requestAnimationFrame
      this.ngZone.run(() => {
        this.draw();
      });
    } finally {
      // 确保最终重置标志，避免永久锁定
      setTimeout(() => {
        this._isToggling = false;
      }, 100); // 100ms防抖
    }
  }

  // 取消所有动画（包括主动画和扇区动画）
  private cancelAllAnimations(): void {
    // 取消主动画
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 取消所有扇区动画
    this.cancelAllSliceAnimations();
  }

  // 取消所有扇区动画
  private cancelAllSliceAnimations(): void {
    if (this.sliceAnimationIds) {
      this.sliceAnimationIds.forEach(id => {
        if (id) {
          cancelAnimationFrame(id);
        }
      });
      this.sliceAnimationIds = [];
    }
  }

  // 存储扇区动画ID的数组
  private sliceAnimationIds: number[] = [];

  /**
   * 对扇区进行角度过渡动画 - 优化版，带取消功能和动画限制
   */
  private animateSliceTransition(index: number, oldStartAngle: number, oldEndAngle: number, newStartAngle: number, newEndAngle: number): void {
    // 保存初始值
    const startStartAngle = oldStartAngle;
    const startEndAngle = oldEndAngle;
    const targetStartAngle = newStartAngle;
    const targetEndAngle = newEndAngle;

    // 如果存在正在运行的该扇区动画，取消它
    if (this.sliceAnimationIds[index]) {
      cancelAnimationFrame(this.sliceAnimationIds[index]);
      this.sliceAnimationIds[index] = 0;
    }

    let progress = 0;
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      // 计算帧间隔，控制动画速度
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // 根据帧率调整增量，使动画平滑且速度一致
      progress += Math.min(0.05, elapsed / 300); // 最大增量为0.05，300ms完成动画

      if (progress >= 1) {
        progress = 1;
        // 设置最终角度
        this.processedData[index].startAngle = targetStartAngle;
        this.processedData[index].endAngle = targetEndAngle;
        this.draw();

        // 清除动画ID
        this.sliceAnimationIds[index] = 0;
        return;
      }

      // 使用缓动函数使动画更平滑
      const easedProgress = this.easeInOutQuad(progress);

      // 计算当前帧的角度
      this.processedData[index].startAngle = startStartAngle + (targetStartAngle - startStartAngle) * easedProgress;
      this.processedData[index].endAngle = startEndAngle + (targetEndAngle - startEndAngle) * easedProgress;

      // 绘制当前帧
      this.draw();

      // 请求下一帧
      this.sliceAnimationIds[index] = requestAnimationFrame(animate);
    };

    // 启动动画
    this.sliceAnimationIds[index] = requestAnimationFrame(animate);
  }

  /**
   * 二次缓动函数
   */
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /**
   * 获取悬浮扇区的颜色
   */
  public getHoveredSliceColor(): string {
    if (this.hoveredIndex < 0 || this.hoveredIndex >= this.processedData.length) {
      return '';
    }
    return this.processedData[this.hoveredIndex].color || '';
  }

  /**
   * 格式化数值显示
   */
  public formatValue(data: number | undefined): string {
    if (typeof data === 'number') {
      return this.chartService.formatNumber(data);
    }
    return '0';
  }

  /**
   * 格式化百分比显示
   */
  public formatPercentage(percentage: number | undefined): string {
    return percentage !== undefined ? percentage.toFixed(1) : '0';
  }

  /**
   * 是否允许悬浮框可悬停
   */
  public isTooltipHoverable(): boolean {
    return this.mergedOptions.hoverEffect?.tooltipHoverable === true;
  }

  // ============================================================
  // 事件处理方法
  // ============================================================

  private handleMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // 计算鼠标在Canvas中的位置
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    this.mousePosition = { x, y };

    const hoveredSliceIndex = this.findHoveredSlice(x, y);

    if (!this.isTooltipHoverable() || !this.isTooltipHovered) {
      if (hoveredSliceIndex !== this.hoveredIndex) {
        this.hoveredIndex = hoveredSliceIndex;
        this.draw();

        if (hoveredSliceIndex !== -1 && this.mergedOptions.hoverEffect?.showTooltip) {
          this.showTooltip(hoveredSliceIndex, event);
        } else {
          this.hideTooltip();
        }
      } else if (hoveredSliceIndex !== -1) {
        this.updateTooltipPosition(event);
      }
    }
  }

  private handleMouseOut(event: MouseEvent): void {
    if (this.isEventToTooltip(event)) {
      return;
    }

    if (!this.isEventToChildElement(event)) {
      this.hideAllTooltips();
    }
  }

  public handleCanvasMouseLeave(event: MouseEvent): void {
    if (this.isEventToTooltip(event) && this.isTooltipHoverable()) {
      return;
    }
    this.hideAllTooltips();
  }

  @HostListener('document:mouseleave', ['$event'])
  onDocumentMouseLeave(event: MouseEvent) {
    this.hideAllTooltips();
  }

  @HostListener('window:blur', ['$event'])
  onWindowBlur(event: Event) {
    this.hideAllTooltips();
  }

  private findHoveredSlice(x: number, y: number): number {
    // 计算鼠标距离圆心的距离
    const dx = x - this.centerX;
    const dy = y - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 计算鼠标的角度
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    // 判断是否在饼图内（考虑内径，支持环形图）
    const inPie = distance <= this.outerRadius && distance >= this.innerRadius;

    if (inPie) {
      // 查找鼠标所在的扇区
      for (let i = 0; i < this.processedData.length; i++) {
        if (!this.sliceVisibility[i]) continue;

        const slice = this.processedData[i];
        if (angle >= slice.startAngle && angle <= slice.endAngle) {
          return i;
        }
      }
    }

    return -1;
  }

  private isEventToTooltip(event: MouseEvent): boolean {
    if (!event.relatedTarget) return false;
    if (!this.isTooltipHoverable()) return false;

    const tooltip = this.tooltipRef.nativeElement;
    return tooltip.contains(event.relatedTarget as Node);
  }

  private isEventToChildElement(event: MouseEvent): boolean {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.closest('.pie-chart-container');

    if (!event.relatedTarget || !container) return false;
    return container.contains(event.relatedTarget as Node);
  }

  private handleCanvasClick(event: MouseEvent): void {
    // 检查是否有点击回调函数
    if (!this.mergedOptions.onClick) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // 计算点击在canvas中的位置
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    // 查找点击的扇区索引
    const clickedSliceIndex = this.findHoveredSlice(x, y);

    // 如果点击到了扇区，执行回调
    if (clickedSliceIndex !== -1) {
      this.ngZone.run(() => {
        this.mergedOptions.onClick!({
          item: this.processedData[clickedSliceIndex],
          index: clickedSliceIndex,
          data: this.processedData,
          options: this.mergedOptions,
          event: event
        });
      });
    }
  }

  // 工具提示相关方法
  private showTooltip(sliceIndex: number, event?: MouseEvent): void {
    if (!this.mergedOptions.hoverEffect?.showTooltip || sliceIndex < 0 || sliceIndex >= this.processedData.length) return;

    const tooltip = this.tooltipRef.nativeElement;
    const sliceData = this.processedData[sliceIndex];

    tooltip.innerHTML = '';

    const tooltipData = {
      item: sliceData,
      index: sliceIndex
    };

    if (this.tooltipTemplate) {
      this.ngZone.run(() => {
        const viewRef = this.tooltipTemplate!.createEmbeddedView({ $implicit: tooltipData });
        viewRef.detectChanges();

        viewRef.rootNodes.forEach(node => {
          this.renderer.appendChild(tooltip, node);
        });
      });
    } else {
      this.ngZone.run(() => {
        const viewRef = this.defaultTooltipRef.createEmbeddedView({ $implicit: tooltipData });
        viewRef.detectChanges();
        viewRef.rootNodes.forEach(node => {
          this.renderer.appendChild(tooltip, node);
        });
      });
    }

    this.hoveredIndex = sliceIndex;

    if (event) {
      this.updateTooltipPosition(event);
    } else {
      this.updateTooltipPosition();
    }
  }

  private updateTooltipPosition(event?: MouseEvent): void {
    if (this.hoveredIndex === -1) return;

    const tooltip = this.tooltipRef.nativeElement;
    const tooltipRect = tooltip.getBoundingClientRect();
    const canvas = this.canvasRef.nativeElement;
    const canvasRect = canvas.getBoundingClientRect();

    let x, y;
    if (event) {
      x = event.clientX - canvasRect.left - 15;
      y = event.clientY - canvasRect.top;
    } else {
      x = this.mousePosition.x;
      y = this.mousePosition.y;
    }

    // 检查是否接近右边界，如果接近右边界，调整位置
    if (x + tooltipRect.width > canvasRect.width) {
      x = x - tooltipRect.width + 5;
    }

    this.renderer.setStyle(tooltip, 'left', `${x + 15}px`);
    this.renderer.setStyle(tooltip, 'top', `${y - tooltipRect.height / 2}px`);
  }

  private hideTooltip(): void {
    this.ngZone.run(() => {
      this.hoveredIndex = -1;
    });
  }

  private hideAllTooltips(): void {
    this.ngZone.run(() => {
      this.hoveredIndex = -1;
    });

    try {
      this.draw();
    } catch (e) {
      console.error('隐藏提示时重绘图表失败:', e);
    }
  }

  private handleResize(): void {
    // 使用requestAnimationFrame避免频繁重绘
    if (!this.resizeTimeout) {
      this.resizeTimeout = window.requestAnimationFrame(() => {
        // 调整大小时显式跳过动画
        this.initializeCanvas(true);
        this.draw();
        this.resizeTimeout = null;
      });
    }
  }

  private resizeTimeout: number | null = null;

  // 简化ensureLegendClickable方法，只设置样式，不额外绑定事件
  private ensureLegendClickable(): void {
    if (!this.containerRef) return;

    const container = this.containerRef.nativeElement;
    if (!container) return;

    // 查找所有图例项
    const legendItems = container.querySelectorAll('.legend-item');
    if (!legendItems || legendItems.length === 0) return;

    // 仅设置样式，不绑定事件
    legendItems.forEach((item) => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.pointerEvents = 'all';
      htmlItem.style.cursor = 'pointer';
      htmlItem.style.zIndex = '100';
    });

    // 确保图例容器本身也可点击
    const legendContainers = container.querySelectorAll('.chart-legend');
    legendContainers.forEach((containerEl) => {
      const htmlContainer = containerEl as HTMLElement;
      htmlContainer.style.pointerEvents = 'all';
      htmlContainer.style.zIndex = '99';
    });
  }

  // 销毁MutationObserver
  private destroyLegendObserver(): void {
    if (this.legendObserver) {
      this.legendObserver.disconnect();
      this.legendObserver = null;
    }
  }
}
