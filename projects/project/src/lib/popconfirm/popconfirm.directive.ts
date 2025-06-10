import { booleanAttribute, ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { OverlayBasicDirective, OverlayBasicPosition, OverlayBasicPositionConfigs, OverlayBasicTrigger } from '../core/overlay/overlay-basic.directive';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverComponent } from '../popover/popover.component';
import _ from 'lodash';
import { OverlayService } from '../core/overlay/overlay.service';
import { ButtonType, ButtonColor } from '../button/button.interface';
import { UtilsService } from '../core/utils/utils.service';

@Directive({
  selector: '[libPopconfirm]'
})
export class PopconfirmDirective implements OverlayBasicDirective {
  /** 提示内容 */
  @Input({ alias: 'popconfirmContent', required: true }) popconfirmContent: string | TemplateRef<any> = '';
  /** 提示标题 */
  @Input({ alias: 'popconfirmTitle', required: true }) popconfirmTitle: string | TemplateRef<any> = '';
  /** 提示位置 */
  @Input({ alias: 'popconfirmPlacement' }) placement: OverlayBasicPosition = 'top';
  /** 提示是否显示 */
  @Input({ alias: 'popconfirmVisible', transform: booleanAttribute }) visible: boolean = false;
  /** 是否严格由编程控制显示 */
  @Input({ alias: 'popconfirmStrictVisiable', transform: booleanAttribute }) strictVisiable: boolean = false;
  /** 提示类 */
  @Input({ alias: 'popconfirmClass' }) popconfirmClass: string = '';
  /** 确认按钮类型 */
  @Input({ alias: 'popconfirmConfirmButtonType' }) confirmButtonType: ButtonType = 'default';
  /** 确认按钮颜色 */
  @Input({ alias: 'popconfirmConfirmButtonColor' }) confirmButtonColor: ButtonColor = 'primary';
  /** 确认按钮内容 */
  @Input({ alias: 'popconfirmConfirmButtonContent' }) confirmButtonContent: string | TemplateRef<void> = '确认';
  /** 取消按钮类型 */
  @Input({ alias: 'popconfirmCancelButtonType' }) cancelButtonType: ButtonType = 'default';
  /** 取消按钮颜色 */
  @Input({ alias: 'popconfirmCancelButtonColor' }) cancelButtonColor: ButtonColor = 'ghost';
  /** 取消按钮内容 */
  @Input({ alias: 'popconfirmCancelButtonContent' }) cancelButtonContent: string | TemplateRef<void> = '取消';
  /** 底部模板 */
  @Input({ alias: 'popconfirmBottomTemplate' }) bottomTemplate: null | TemplateRef<void> = null;
  /** 提示显示状态改变事件 */
  @Output('popconfirmVisibleChange') visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** 确认函数 */
  @Output('popconfirmOnConfirm') onConfirm: EventEmitter<void> = new EventEmitter<void>();
  /** 取消函数 */
  @Output('popconfirmOnCancel') onCancel: EventEmitter<void> = new EventEmitter<void>();

  private overlayRef: OverlayRef | null = null;
  private enterTimer: any;
  private leaveTimer: any;
  private portal: ComponentPortal<PopoverComponent> | null = null;
  private popconfirmComponentRef: ComponentRef<PopoverComponent> | null = null;
  public isVisible: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    public overlay: Overlay,
    private utilsService: UtilsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['popconfirmContent']) {
      this.updateComponent('content', this.popconfirmContent);
    }
    if (changes['popconfirmTitle']) {
      this.updateComponent('title', this.popconfirmTitle);
    }
    if (changes['visible']) {
      this.visible ? this.show() : this.hide();
    }
  }

  ngOnInit(): void {
    // 初始化时如果visible为true，则显示tooltip
    if (this.visible) {
      this.show();
    }
  }

  ngOnDestroy(): void {
    this.closePopover();
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
  }

  @HostListener('click')
  onClick(): void {
    if (this.strictVisiable) return;
    this.visible ? this.hide() : this.show();
  }

  /**
   * 显示
   */
  public show(): void {
    if (this.isVisible) return;
    this.closePopover();
    const positions = this.overlayService.getPositions(this.placement);
    // 创建overlay
    this.overlayRef = this.overlayService.createOverlay(
      {
        panelClass: [this.popconfirmClass],
        positionStrategy: this.overlay.position().flexibleConnectedTo(this.elementRef).withPositions(positions).withPush(false).withGrowAfterOpen(true).withLockedPosition(false)
      },
      this.elementRef,
      positions,
      (ref, event) => {
        // 阻止事件冒泡
        // event && event.stopPropagation();
        if (this.strictVisiable) return;
        this.utilsService.delayExecution(() => {
          this.hide();
        }, 10);
      },
      (position, isBackupUsed) => {
        for (const key in OverlayBasicPositionConfigs) {
          if (_.isEqual(OverlayBasicPositionConfigs[key], position)) {
            if (this.popconfirmComponentRef) {
              this.popconfirmComponentRef.setInput('placement', key as OverlayBasicPosition);
              this.popconfirmComponentRef.instance?.getMargin();
              this.popconfirmComponentRef.instance?.cdr?.detectChanges();
            }
            break;
          }
        }
      }
    );
    // 创建并附加组件
    this.portal = new ComponentPortal(PopoverComponent);
    const componentRef = this.overlayRef.attach(this.portal);
    componentRef.setInput('title', this.popconfirmTitle);
    componentRef.setInput('content', this.popconfirmContent);
    componentRef.setInput('placement', this.placement);
    componentRef.setInput('confirm', true);
    componentRef.setInput('confirmButtonType', this.confirmButtonType);
    componentRef.setInput('confirmButtonColor', this.confirmButtonColor);
    componentRef.setInput('confirmButtonContent', this.confirmButtonContent);
    componentRef.setInput('cancelButtonType', this.cancelButtonType);
    componentRef.setInput('cancelButtonColor', this.cancelButtonColor);
    componentRef.setInput('cancelButtonContent', this.cancelButtonContent);
    componentRef.setInput('bottomTemplate', this.bottomTemplate);
    componentRef.instance.onConfirm.subscribe(() => {
      this.onConfirm.emit();
      this.hide();
    });
    componentRef.instance.onCancel.subscribe(() => {
      this.onCancel.emit();
      this.hide();
    });
    // 设置tooltip内容和位置
    this.popconfirmComponentRef = componentRef;
    // 设置CSS类以添加动画效果
    this.utilsService.delayExecution(() => {
      this.changeVisible(true);
    });
  }

  /**
   * 隐藏
   */
  public hide(): void {
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
    this.popconfirmComponentRef?.setInput('isVisible', visible);
  }

  /**
   * 更新位置
   */
  public updatePosition(): void {
    if (this.overlayRef) {
      this.overlayRef.updatePosition();
    }
  }

  /**
   * 更新内容
   * @param key 键
   * @param value 值
   */
  public updateComponent(key: string, value: any): void {
    this.popconfirmComponentRef && this.popconfirmComponentRef?.setInput(key, value);
  }

  /**
   * 关闭
   */
  private closePopover(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.popconfirmComponentRef = null;
  }

}
