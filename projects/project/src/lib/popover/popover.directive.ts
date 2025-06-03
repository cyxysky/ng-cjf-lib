import { Directive, TemplateRef, Input, ElementRef, HostListener, SimpleChanges, ComponentRef, EventEmitter, Output, booleanAttribute } from '@angular/core';
import { OverlayBasicDirective, OverlayBasicPosition, OverlayBasicPositionConfigs, OverlayBasicTrigger } from '../core/overlay/overlay-basic.directive';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverComponent } from './popover.component';
import { OverlayService } from '../core/overlay/overlay.service';
import * as _ from 'lodash';
import { UtilsService } from '../core/utils/utils.service';

@Directive({
  selector: '[libPopover]'
})
export class PopoverDirective implements OverlayBasicDirective {
  /** 提示内容 */
  @Input({ alias: 'popoverContent', required: true }) popoverContent: string | TemplateRef<any> = '';
  /** 提示标题 */
  @Input({ alias: 'popoverTitle', required: true }) popoverTitle: string | TemplateRef<any> = '';
  /** 提示位置 */
  @Input({ alias: 'popoverPlacement' }) placement: OverlayBasicPosition = 'top';
  /** 提示触发方式 */
  @Input({ alias: 'popoverTrigger' }) trigger: OverlayBasicTrigger = 'hover';
  /** 气泡类 */
  @Input({ alias: 'popoverClass' }) popoverClass: string = '';
  /** 提示是否显示 */
  @Input({ alias: 'popoverVisible', transform: booleanAttribute }) visible: boolean = false;
  /** 是否严格由编程控制显示 */
  @Input({ alias: 'popoverStrictVisiable', transform: booleanAttribute }) strictVisiable: boolean = false;
  /** 提示鼠标进入延迟 */
  @Input({ alias: 'popoverMouseEnterDelay' }) mouseEnterDelay: number = 50;
  /** 提示鼠标离开延迟 */
  @Input({ alias: 'popoverMouseLeaveDelay' }) mouseLeaveDelay: number = 200;
  /** 提示显示状态改变事件 */
  @Output('popoverVisibleChange') visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 气泡 */
  private overlayRef: OverlayRef | null = null;
  /** 进入计时器 */
  private enterTimer: any;
  /** 离开计时器 */
  private leaveTimer: any;
  /** 气泡组件 */
  private popoverComponentRef: ComponentRef<PopoverComponent> | null = null;
  /** 组件悬停 */
  private componentHover: boolean = false;
  /** 是否显示 */
  private isVisible: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    public overlay: Overlay,
    private utilsService: UtilsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['popoverTitle']) {
      this.updateComponent('title', this.popoverTitle);
    }
    if (changes['popoverContent']) {
      this.updateComponent('content', this.popoverContent);
    }
    if (changes['visible']) {
      this.visible ? this.show() : this.hide();
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.closePopover();
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
  hoverOpen() {
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
  hoverClose() {
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
   * 显示
   */
  public show(): void {
    if (this.isVisible) return;
    this.closePopover();
    const positions = this.overlayService.getPositions(this.placement);
    this.overlayRef = this.overlayService.createOverlay(
      {
        panelClass: [this.popoverClass],
        positionStrategy: this.overlay.position().flexibleConnectedTo(this.elementRef).withPositions(positions).withPush(false).withGrowAfterOpen(true).withLockedPosition(false)
      },
      this.elementRef,
      positions,
      (ref) => {
        if (this.strictVisiable) return;
        this.utilsService.delayExecution(() => {
          this.hide();
        }, 10);
      },
      (position, isBackupUsed) => {
        for (const key in OverlayBasicPositionConfigs) {
          if (_.isEqual(OverlayBasicPositionConfigs[key], position)) {
            if (this.popoverComponentRef) {
              this.popoverComponentRef.setInput('placement', key as OverlayBasicPosition);
              this.popoverComponentRef.instance?.getMargin();
              this.popoverComponentRef.instance?.cdr?.detectChanges();
            }
            break;
          }
        }
      }
    );
    // 创建并附加组件
    const componentRef = this.overlayRef.attach(new ComponentPortal(PopoverComponent));
    componentRef.setInput('title', this.popoverTitle);
    componentRef.setInput('content', this.popoverContent);
    componentRef.setInput('placement', this.placement);
    componentRef.location.nativeElement.addEventListener('mouseenter', () => {
      this.componentHover = true;
      this.hoverOpen();
    });
    componentRef.location.nativeElement.addEventListener('mouseleave', () => {
      this.componentHover = false;
      this.hoverClose();
    });
    this.popoverComponentRef = componentRef;
    // 设置CSS类以添加动画效果
    this.utilsService.delayExecution(() => {
      this.changeVisible(true);
    });
  }

  /**
   * 隐藏
   */
  public hide(): void {
    if (!this.isVisible || this.componentHover) return;
    this.changeVisible(false);
    this.utilsService.delayExecution(() => {
      this.closePopover();
    }, OverlayService.overlayVisiableDuration);
  }

  /**
   * 改变显示状态
   * @param visible 显示状态
   */
  changeVisible(visible: boolean): void {
    this.visible = visible;
    this.isVisible = visible;
    this.visibleChange.emit(this.visible);
    this.popoverComponentRef?.setInput('isVisible', visible);
  }

  /**
   * 更新位置
   */
  public updatePosition(): void {
    this.overlayRef && this.overlayRef.updatePosition();
  }

  /**
   * 更新内容
   * @param key 键
   * @param value 值
   */
  public updateComponent(key: string, value: any): void {
    this.popoverComponentRef?.setInput(key, value);
  }

  /**
   * 关闭
   */
  public closePopover(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.popoverComponentRef = null;
  }

}
