import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../core/overlay/overlay.service';
import { TooltipComponent } from './tooltip.component';
import { OverlayBasicDirective, OverlayBasicPosition, OverlayBasicTrigger } from '../core/overlay/overlay-basic.directive';
import { UtilsService } from '../core/utils/utils.service';

@Directive({
  selector: '[libTooltip]',
  exportAs: 'libTooltip',
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy, OverlayBasicDirective {
  /** 提示内容 */
  @Input({ alias: 'tooltip', required: true }) tooltipContent: string | TemplateRef<any> = '';
  /** 提示位置 */
  @Input({ alias: 'tooltipPlacement' }) placement: OverlayBasicPosition = 'top';
  /** 提示触发方式 */
  @Input({ alias: 'tooltipTrigger' }) trigger: OverlayBasicTrigger = 'hover';
  /** 提示是否显示 */
  @Input({ alias: 'tooltipVisible' }) visible: boolean = false;
  /** 是否严格由编程控制显示 */
  @Input({ alias: 'tooltipStrictVisiable' }) strictVisiable: boolean = false;
  /** 提示鼠标进入延迟 */
  @Input({ alias: 'tooltipMouseEnterDelay' }) mouseEnterDelay: number = 50;
  /** 提示鼠标离开延迟 */
  @Input({ alias: 'tooltipMouseLeaveDelay' }) mouseLeaveDelay: number = 200;
  /** 提示CSS类 */
  @Input({ alias: 'tooltipClass' }) tooltipClass: string = '';
  /** 提示颜色 */
  @Input({ alias: 'tooltipColor' }) tooltipColor: string = '#000';
  /** 提示显示状态改变事件 */
  @Output('tooltipVisibleChange') visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 提示 */
  private overlayRef: OverlayRef | null = null;
  /** 进入计时器 */
  private enterTimer: any;
  /** 离开计时器 */
  private leaveTimer: any;
  /** 提示组件引用 */
  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;
  /** 组件悬停 */
  private componentHover: boolean = false;
  public isVisible: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    public overlay: Overlay,
    private utilsService: UtilsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltipContent']) {
      this.updateContent(this.tooltipContent);
    }
    if (changes['visible']) {
      this.visible ? this.show() : this.hide();
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.closeTooltip();
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.hoverOpen();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hoverClose();
  }

  @HostListener('click')
  onClick(): void {
    // 严格由编程控制显示
    if (this.strictVisiable) return;
    this.trigger === 'click' && this.visible ? this.hide() : this.show();
  }

  /**
   * 鼠标进入
   */
  private hoverOpen(): void {
    // 严格由编程控制显示
    if (this.strictVisiable) return;
    if (this.trigger === 'hover') {
      clearTimeout(this.leaveTimer);
      this.enterTimer = setTimeout(() => {
        this.show();
      }, this.mouseEnterDelay);
    }
  }

  /**
   * 鼠标离开
   */
  private hoverClose(): void {
    // 严格由编程控制显示
    if (this.strictVisiable) return;
    if (this.trigger === 'hover') {
      clearTimeout(this.enterTimer);
      this.leaveTimer = setTimeout(() => {
        this.hide();
        clearTimeout(this.leaveTimer);
      }, this.mouseLeaveDelay);
    }
  }

  /**
   * 显示tooltip
   */
  public show(): void {
    if (this.isVisible || !this.tooltipContent) return;
    this.closeTooltip();
    const positions = this.overlayService.getPositions(this.placement);
    // 创建overlay
    this.overlayRef = this.overlayService.createOverlay(
      {
        panelClass: [this.tooltipClass],
        positionStrategy: this.overlay.position().flexibleConnectedTo(this.elementRef).withPositions(positions).withPush(false).withGrowAfterOpen(true).withLockedPosition(false)
      },
      this.elementRef,
      positions,
      (ref) => {
        if (this.strictVisiable) return;
        this.utilsService.delayExecution(() => {
          this.hide();
        }, 10);
      }
    );
    const componentRef = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
    // 设置tooltip内容和位置
    componentRef.setInput('content', this.tooltipContent);
    componentRef.setInput('placement', this.placement);
    componentRef.setInput('color', this.tooltipColor);
    componentRef.location.nativeElement.addEventListener('mouseenter', () => {
      this.componentHover = true;
    });
    componentRef.location.nativeElement.addEventListener('mouseleave', () => {
      this.componentHover = false;
      this.hoverClose();
    });
    this.tooltipComponentRef = componentRef;
    this.utilsService.delayExecution(() => {
      this.changeVisible(true);
    });
  }

  /**
   * 隐藏tooltip
   */
  public hide(): void {
    if (!this.isVisible || this.componentHover) return;
    this.changeVisible(false);
    this.utilsService.delayExecution(() => {
      this.closeTooltip();
    }, OverlayService.overlayVisiableDuration);
  }

  /**
   * 改变tooltip显示状态
   * @param visible 显示状态
   */
  public changeVisible(visible: boolean): void {
    this.visible = visible;
    this.isVisible = visible;
    this.visibleChange.emit(this.visible);
    this.tooltipComponentRef && this.tooltipComponentRef.setInput('isVisible', visible);
  }

  /**
   * 更新tooltip位置
   */
  public updatePosition(): void {
    this.overlayRef && this.overlayRef.updatePosition();
  }

  /**
   * 更新tooltip内容
   * @param content 内容
   */
  public updateContent(content: string | TemplateRef<any>): void {
    this.tooltipComponentRef && this.tooltipComponentRef.setInput('content', content);
  }

  /**
   * 关闭tooltip
   */
  public closeTooltip(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.tooltipComponentRef = null;
  }

}
