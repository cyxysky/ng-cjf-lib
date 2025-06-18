import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libWaterMarkDirective]',
  standalone: true,
})
export class WaterMarkDirectiveDirective {
  /** 水印文字 */
  @Input({ alias: 'waterMarkText' }) text = '水印文字';
  /** 水印字体颜色 */
  @Input({ alias: 'waterMarkFontColor' }) fontColor = 'rgba(0, 0, 0, 0.15)';
  /** 水印字体大小 */
  @Input({ alias: 'waterMarkFontSize' }) fontSize = 16;
  /** 水印字体 */
  @Input({ alias: 'waterMarkFontFamily' }) fontFamily = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
  /** 水印字体粗细 */
  @Input({ alias: 'waterMarkFontWeight' }) fontWeight = '200';
  /** 水印间距 */
  @Input({ alias: 'waterMarkGap' }) gap = 30;
  /** 水印层级 */
  @Input({ alias: 'waterMarkZIndex' }) zIndex = 9999;
  /** 水印旋转角度 */
  @Input({ alias: 'waterMarkRotate' }) rotate = -22;
  /** 水印宽度 */
  @Input({ alias: 'waterMarkWidth' }) width = 240;
  /** 水印高度 */
  @Input({ alias: 'waterMarkHeight' }) height = 120;
  /** 水印偏移量 */
  @Input({ alias: 'waterMarkOffsetLeft' }) offsetLeft = 0;
  @Input({ alias: 'waterMarkOffsetTop' }) offsetTop = 0;
  /** 水印图片 */
  @Input({ alias: 'waterMarkImageBase64' }) imageBase64: string | null = null;

  private watermarkElement?: HTMLDivElement;
  private observer?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private timer?: any;
  private isRestoring = false;
  private currentImageLoad?: HTMLImageElement; // 当前正在加载的图片

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.createWatermark();
    this.setupAntiTamperingMeasures();
  }

  ngOnDestroy(): void {
    this.removeWatermark();
    this.removeTamperingProtection();
  }

  ngOnChanges(changes: any): void {
    this.createWatermark();
  }

  private createWatermark(): void {
    // 设置标志，表明这是内部操作
    this.isRestoring = true;

    // 中断之前的图片加载
    if (this.currentImageLoad) {
      this.currentImageLoad.onload = null;
      this.currentImageLoad.onerror = null;
      this.currentImageLoad = undefined;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) {
      this.isRestoring = false;
      return;
    }

    // 获取设备像素比
    const ratio = window.devicePixelRatio || 1;

    // 计算合适的Canvas尺寸
    const [markWidth, markHeight] = [this.width, this.height];
    const canvasWidth = (this.gap + markWidth) * ratio;
    const canvasHeight = (this.gap + markHeight) * ratio;

    // 设置canvas属性，这里用2倍大小以实现交错效果，通过计算比例来保证清晰
    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    canvas.style.width = `${canvasWidth * 2 / ratio}px`;
    canvas.style.height = `${canvasHeight * 2 / ratio}px`;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置字体样式
    const fontSize = this.fontSize * ratio;
    ctx.font = `${this.fontWeight} ${fontSize}px ${this.fontFamily}`;
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // 计算绘制参数
    const drawX = (this.gap * ratio) / 2;
    const drawY = (this.gap * ratio) / 2;
    const drawWidth = markWidth * ratio;
    const drawHeight = markHeight * ratio;

    // 交错绘制参数
    const alternateDrawX = drawX + canvasWidth;
    const alternateDrawY = drawY + canvasHeight;

    // 旋转中心点
    const rotateX = (drawWidth + this.gap * ratio) / 2;
    const rotateY = (drawHeight + this.gap * ratio) / 2;
    const alternateRotateX = rotateX + canvasWidth;
    const alternateRotateY = rotateY + canvasHeight;

    // 第一次绘制
    ctx.save();
    this.rotateWatermark(ctx, rotateX, rotateY);

    if (this.imageBase64) {
      const img = new Image();
      this.currentImageLoad = img; // 记录当前加载的图片

      // 检查是否为Base64图像（内部资源，无需跨域设置）
      const isBase64 = this.imageBase64.startsWith('data:image');

      // 对于非Base64的外部资源，添加跨域设置
      if (!isBase64) {
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
      }

      // 文字水印备选方案
      const fallbackToTextOnly = () => {
        // 检查是否还是当前的加载请求
        if (this.currentImageLoad !== img) return;

        console.warn('Water mark image failed to load, falling back to text only');
        // 重置canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        this.rotateWatermark(ctx, rotateX, rotateY);

        // 只绘制文字作为备选方案
        this.drawText(ctx, this.text, drawX + drawWidth / 2, drawY + drawHeight / 2, drawWidth);

        // 第二次绘制（交错效果）
        ctx.restore();
        this.rotateWatermark(ctx, alternateRotateX, alternateRotateY);
        this.drawText(ctx, this.text, alternateDrawX + drawWidth / 2, alternateDrawY + drawHeight / 2, drawWidth);

        // 更新水印
        this.updateWatermarkDiv(canvas.toDataURL('image/png', 1.0), markWidth);
        // 重置标志
        this.isRestoring = false;
        this.currentImageLoad = undefined;
      };

      img.onload = () => {
        // 检查是否还是当前的加载请求
        if (this.currentImageLoad !== img) return;

        const imgWidth = img.width * 0.6;
        const imgHeight = img.height * 0.6;

        // 尝试绘制图像的函数
        try {
          // 第一次绘制（图片+文本）
          ctx.drawImage(
            img,
            drawX + (drawWidth - imgWidth * ratio) / 2,
            drawY + (drawHeight - imgHeight * ratio) / 3,
            imgWidth * ratio,
            imgHeight * ratio
          );

          this.drawText(ctx, this.text, drawX + drawWidth / 2, drawY + (drawHeight / 3) * 2, drawWidth);

          // 第二次绘制（交错效果）
          ctx.restore();
          this.rotateWatermark(ctx, alternateRotateX, alternateRotateY);

          ctx.drawImage(
            img,
            alternateDrawX + (drawWidth - imgWidth * ratio) / 2,
            alternateDrawY + (drawHeight - imgHeight * ratio) / 3,
            imgWidth * ratio,
            imgHeight * ratio
          );

          this.drawText(ctx, this.text, alternateDrawX + drawWidth / 2, alternateDrawY + (drawHeight / 3) * 2, drawWidth);

          // 更新水印
          this.updateWatermarkDiv(canvas.toDataURL('image/png', 1.0), markWidth);
          // 重置标志
          this.isRestoring = false;
          this.currentImageLoad = undefined;
        } catch (error) {
          console.warn('Water mark image processing error:', error);
          fallbackToTextOnly();
        }
      };

      // 添加错误处理
      img.onerror = fallbackToTextOnly;

      // 设置图像源
      img.src = this.imageBase64;
    } else {
      // 只绘制文字
      this.drawText(ctx, this.text, drawX + drawWidth / 2, drawY + drawHeight / 2, drawWidth);

      // 第二次绘制（交错效果）
      ctx.restore();
      this.rotateWatermark(ctx, alternateRotateX, alternateRotateY);
      this.drawText(ctx, this.text, alternateDrawX + drawWidth / 2, alternateDrawY + drawHeight / 2, drawWidth);

      // 更新水印
      this.updateWatermarkDiv(canvas.toDataURL('image/png', 1.0), markWidth);
      // 重置标志
      this.isRestoring = false;
    }
  }

  private rotateWatermark(ctx: CanvasRenderingContext2D, rotateX: number, rotateY: number): void {
    ctx.translate(rotateX, rotateY);
    ctx.rotate((this.rotate * Math.PI) / 180);
    ctx.translate(-rotateX, -rotateY);
  }

  private drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number): void {
    // 启用抗锯齿
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 文本轮廓，提高清晰度
    ctx.strokeStyle = this.fontColor;
    ctx.lineWidth = 0.5;
    ctx.strokeText(text, x, y);

    // 填充文本
    ctx.fillText(text, x, y);
  }

  private updateWatermarkDiv(url: string, markWidth: number): void {
    // 删除旧水印（如果存在）
    if (this.watermarkElement) {
      this.renderer.removeChild(this.el.nativeElement, this.watermarkElement);
    }

    const parentElement = this.el.nativeElement;
    const parentPosition = getComputedStyle(parentElement).position;

    // 确保父元素是定位元素
    if (parentPosition === 'static') {
      this.renderer.setStyle(parentElement, 'position', 'relative');
    }

    // 创建水印元素
    const div = this.renderer.createElement('div');
    this.watermarkElement = div;

    // 通过生成随机类名来防止CSS选择器篡改
    const randomClassName = `watermark-${Math.random().toString(36).substring(2)}`;
    this.renderer.addClass(div, randomClassName);

    // 设置关键样式
    const styles = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: this.zIndex.toString(),
      pointerEvents: 'none',
      backgroundImage: `url('${url}')`,
      backgroundRepeat: 'repeat',
      backgroundPosition: `${this.offsetLeft}px ${this.offsetTop}px`,
      backgroundSize: `${(this.gap + markWidth) * 2}px`,
      imageRendering: '-webkit-optimize-contrast',
      userSelect: 'none'
    };

    // 应用样式并添加元素
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(div, property, value);
    });

    // 添加到DOM
    this.renderer.appendChild(parentElement, div);

    // 在CSS样式中添加保护规则，使水印更难以通过CSS修改
    this.addProtectiveCSSRules(randomClassName);
  }

  private addProtectiveCSSRules(className: string): void {
    // 创建一个样式表来保护水印元素
    const styleEl = this.renderer.createElement('style');
    const styleContent = `
      .${className} {
        opacity: 1 !important;
        display: block !important;
        visibility: visible !important;
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
        image-rendering: pixelated !important;
      }
    `;
    this.renderer.appendChild(styleEl, this.renderer.createText(styleContent));
    this.renderer.appendChild(document.head, styleEl);
  }

  private setupAntiTamperingMeasures(): void {
    // 创建MutationObserver来监视DOM变化
    this.observer = new MutationObserver((mutations) => {
      // 如果正在内部操作，忽略变化
      if (this.isRestoring) {
        return;
      }

      let needRestore = false;

      mutations.forEach((mutation) => {
        // 检查是否有节点被删除
        if (mutation.type === 'childList' && mutation.removedNodes.length) {
          for (let i = 0; i < mutation.removedNodes.length; i++) {
            if (mutation.removedNodes[i] === this.watermarkElement) {
              needRestore = true;
              break;
            }
          }
        }

        // 检查属性变化
        if (
          mutation.type === 'attributes' &&
          mutation.target === this.watermarkElement
        ) {
          needRestore = true;
        }
      });

      if (needRestore) {
        // 如果水印被篡改，立即恢复
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.createWatermark();
        }, 100);
      }
    });

    // 配置观察器
    const config = {
      childList: true,       // 观察子节点的变化
      attributes: true,      // 观察属性变化
      characterData: true,   // 观察文本变化
      subtree: true          // 观察所有后代节点
    };

    // 开始观察
    this.observer.observe(this.el.nativeElement, config);

    // 监听窗口大小变化，重新生成水印
    this.resizeObserver = new ResizeObserver(() => {
      this.createWatermark();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  private removeWatermark(): void {
    if (this.watermarkElement && this.el.nativeElement.contains(this.watermarkElement)) {
      this.renderer.removeChild(this.el.nativeElement, this.watermarkElement);
    }
  }

  private removeTamperingProtection(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
