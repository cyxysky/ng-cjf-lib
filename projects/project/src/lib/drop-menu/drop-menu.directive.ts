import { Directive, TemplateRef, Input, ElementRef, HostListener, SimpleChanges, ComponentRef, EventEmitter, Output, ViewContainerRef, Injector, Optional, SkipSelf, booleanAttribute } from '@angular/core';
import { OverlayBasicDirective, OverlayBasicPosition, OverlayBasicPositionConfigs, OverlayBasicTrigger } from '../core/overlay/overlay-basic.directive';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DropMenuComponent } from './drop-menu.component';
import { OverlayService } from '../core/overlay/overlay.service';
import { DropMenu } from './drop-menu.interface';
import * as _ from 'lodash';
import { UtilsService } from '../core/utils/utils.service';
import { Subject, Subscription } from 'rxjs';

@Directive({
  selector: '[libDropMenu]',
  standalone: true,
  exportAs: 'libDropMenu'
})
export class DropMenuDirective implements OverlayBasicDirective {
  /** 菜单项 */
  @Input({ alias: 'dropMenuItems' }) menuItems: DropMenu[] = [];
  /** 菜单位置 */
  @Input({ alias: 'dropMenuPlacement' }) placement: OverlayBasicPosition = 'bottom-left';
  /** 菜单触发方式 */
  @Input({ alias: 'dropMenuTrigger' }) trigger: OverlayBasicTrigger = 'click';
  /** 菜单是否显示 */
  @Input({ alias: 'dropMenuVisible', transform: booleanAttribute }) visible: boolean = false;
  /** 是否严格由编程控制显示 */
  @Input({ alias: 'dropMenuStrictVisible', transform: booleanAttribute }) strictVisible: boolean = false;
  /** 菜单类 */
  @Input({ alias: 'dropMenuClass' }) dropMenuClass: string = '';
  /** 菜单宽度 */
  @Input({ alias: 'dropMenuWidth', transform: (value: any) => typeof value === 'string' ? value : value + 'px' }) width: number | string = 'auto';
  /** 菜单项模板 */
  @Input({ alias: 'dropMenuItemTemplate' }) itemTemplate: TemplateRef<{ $implicit: DropMenu, index: number }> | null = null;
  /** 菜单鼠标进入延迟 */
  @Input({ alias: 'dropMenuMouseEnterDelay', transform: (value: any) => typeof value === 'string' ? parseInt(value) : value }) mouseEnterDelay: number = 50;
  /** 菜单鼠标离开延迟 */
  @Input({ alias: 'dropMenuMouseLeaveDelay', transform: (value: any) => typeof value === 'string' ? parseInt(value) : value }) mouseLeaveDelay: number = 200;
  /** 是否自动关闭菜单 */
  @Input({ alias: 'dropMenuAutoClose', transform: booleanAttribute }) autoClose: boolean = true;
  /** 当前选中的菜单项 */
  @Input({ alias: 'dropMenuSelected' }) selectedItem: DropMenu | null = null;
  /** 纯模板 */
  @Input({ alias: 'dropMenuTemplate' }) template: TemplateRef<{ $implicit: DropMenu, index: number }> | null = null;
  /** 是否允许选中父级 */
  @Input({ alias: 'dropMenuAllowParentSelect', transform: booleanAttribute }) allowParentSelect: boolean = false;
  /** 是否允许有选中效果 */
  @Input({ alias: 'dropMenuAllowSelected', transform: booleanAttribute }) allowSelected: boolean = true;

  /** 菜单显示状态改变事件 */
  @Output('dropMenuVisibleChange') visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** 菜单项点击事件 */
  @Output('dropMenuItemClick') itemClick: EventEmitter<DropMenu> = new EventEmitter<DropMenu>();
  /** 菜单项选中事件 */
  @Output('dropMenuSelectedChange') selectedChange: EventEmitter<DropMenu | null> = new EventEmitter<DropMenu | null>();

  /** 悬停状态Subject - 用于在整个菜单链中共享悬停状态 */
  private hoverStateSubject = new Subject<boolean>();
  /** 订阅集合 */
  private subscription = new Subscription();
  /** overlay引用 */
  private overlayRef: OverlayRef | null = null;
  /** 菜单组件引用 */
  private dropMenuComponentRef: ComponentRef<DropMenuComponent> | null = null;
  /** 菜单组件是否被悬停 */
  private componentHover = false;
  /** 触发元素是否被悬停 */
  private triggerHover = false;
  /** 菜单是否可见 */
  public isVisible = false;
  /** 进入计时器 */
  private enterTimer: any = null;
  /** 离开计时器 */
  private leaveTimer: any = null;

  constructor(
    private elementRef: ElementRef,
    private overlayService: OverlayService,
    private overlay: Overlay,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    // 订阅悬停状态变化
    this.subscription.add(
      this.hoverStateSubject.subscribe(isHovered => {
        if (isHovered) {
          // 收到true时，清除任何离开计时器
          this.clearLeaveTimer();
        } else if (this.trigger === 'hover' && !this.strictVisible) {
          // 悬停状态为false且触发方式为hover时，启动关闭计时器
          this.startLeaveTimer();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 更新菜单组件数据
    if (changes['menuItems'] && this.dropMenuComponentRef) {
      this.dropMenuComponentRef.setInput('items', this.menuItems);
    }
    // 处理可见性变化
    if (changes['visible']) {
      this.visible ? this.show() : this.hide();
    }
  }

  ngOnDestroy(): void {
    this.closeDropMenu();
    this.clearAllTimers();
    this.subscription.unsubscribe();
    this.hoverStateSubject.complete();
  }

  /**
   * 清除所有计时器
   */
  private clearAllTimers(): void {
    this.clearEnterTimer();
    this.clearLeaveTimer();
  }

  /**
   * 清除进入计时器
   */
  private clearEnterTimer(): void {
    if (this.enterTimer) {
      clearTimeout(this.enterTimer);
      this.enterTimer = null;
    }
  }

  /**
   * 清除离开计时器
   */
  private clearLeaveTimer(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  }

  /**
   * 启动离开计时器
   */
  private startLeaveTimer(): void {
    this.clearLeaveTimer();
    this.leaveTimer = setTimeout(() => {
      // 如果触发器和组件都没有悬停，则隐藏菜单
      if (!this.triggerHover && !this.componentHover) {
        this.hide();
      }
    }, this.mouseLeaveDelay);
  }

  /**
   * 启动进入计时器
   */
  private startEnterTimer(): void {
    this.clearEnterTimer();
    this.enterTimer = setTimeout(() => {
      this.show();
    }, this.mouseEnterDelay);
  }

  /**
   * 鼠标进入触发元素
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.triggerHover = true;
    // 通知菜单链悬停状态变化
    this.hoverStateSubject.next(true);

    if (this.trigger === 'hover' && !this.strictVisible) {
      this.clearLeaveTimer();
      this.startEnterTimer();
    }
  }

  /**
   * 鼠标离开触发元素
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.triggerHover = false;
    // 只有当组件也未悬停时才发送false状态
    if (!this.componentHover) {
      this.hoverStateSubject.next(false);
    }
    if (this.trigger === 'hover' && !this.strictVisible) {
      this.clearEnterTimer();
      this.startLeaveTimer();
    }
  }

  /**
   * 点击触发元素
   */
  @HostListener('click')
  onClick(): void {
    if (this.strictVisible) return;
    if (this.trigger === 'click') {
      this.visible ? this.hide() : this.show();
    }
  }

  /**
   * 显示下拉菜单
   */
  public show(): void {
    if (this.isVisible) return;
    // 关闭已存在的菜单
    this.closeDropMenu();
    // 获取位置配置
    const positions = this.overlayService.getPositions(this.placement);
    // 创建overlay
    this.overlayRef = this.overlayService.createOverlay(
      {
        panelClass: [this.dropMenuClass, 'c-lib-drop-menu-panel'],
        positionStrategy: this.overlay.position()
          .flexibleConnectedTo(this.elementRef)
          .withPositions(positions)
          .withPush(true)
          .withGrowAfterOpen(true)
          .withLockedPosition(false),
      },
      this.elementRef,
      positions,
      // 外部点击处理
      (ref, event) => {
        // 阻止事件冒泡
        event && event.stopPropagation();
        if (this.strictVisible) return;
        // 延迟关闭，给其他事件处理器有机会执行
        this.utilsService.delayExecution(() => {
          this.hide();
        }, 10);
      },
      // 位置变化处理
      (position, isBackupUsed) => {
        if (isBackupUsed && this.dropMenuComponentRef) {
          // 查找匹配的位置配置
          for (const key in OverlayBasicPositionConfigs) {
            if (_.isEqual(OverlayBasicPositionConfigs[key], position)) {
              this.dropMenuComponentRef.setInput('placement', key as any);
              this.dropMenuComponentRef.changeDetectorRef.detectChanges();
              break;
            }
          }
        }
      }
    );

    // 创建并附加菜单组件
    const componentRef = this.overlayRef.attach(new ComponentPortal(DropMenuComponent));
    // 设置组件属性
    componentRef.setInput('items', this.menuItems);
    componentRef.setInput('placement', this.placement);
    componentRef.setInput('width', this.width);
    componentRef.setInput('itemTemplate', this.itemTemplate);
    componentRef.setInput('autoClose', this.autoClose);
    componentRef.setInput('selectedItem', this.selectedItem);
    componentRef.setInput('template', this.template);
    componentRef.setInput('allowParentSelect', this.allowParentSelect);
    componentRef.setInput('allowSelected', this.allowSelected);
    // 传递悬停状态Subject
    componentRef.setInput('hoverStateSubject', this.hoverStateSubject);
    // 订阅组件事件
    const itemClickSub = componentRef.instance.itemClick.subscribe((item: DropMenu) => {
      if (!item.disabled) {
        this.itemClick.emit(item);
        this.selectedItem = item;
        this.selectedChange.emit(this.selectedItem);
        // 更新组件的选中项
        this.dropMenuComponentRef?.setInput('selectedItem', this.selectedItem);
      }
    });
    const menuCloseSub = componentRef.instance.menuClose.subscribe(() => {
      this.hide();
    });
    // 组件销毁时取消订阅
    componentRef.onDestroy(() => {
      itemClickSub.unsubscribe();
      menuCloseSub.unsubscribe();
    });
    // 保存组件引用
    this.dropMenuComponentRef = componentRef;
    // 更新状态并通知变化
    this.utilsService.delayExecution(() => {
      this.changeVisible(true);
    });
  }

  /**
   * 隐藏下拉菜单
   */
  public hide(): void {
    if (this.componentHover && !this.autoClose) return;
    this.changeVisible(false);
    // 延迟关闭，确保动画有时间完成
    this.utilsService.delayExecution(() => {
      this.closeDropMenu();
    }, OverlayService.overlayVisiableDuration);
  }

  /**
   * 更改菜单可见状态
   */
  private changeVisible(visible: boolean): void {
    this.visible = visible;
    this.isVisible = visible;
    this.visibleChange.emit(visible);
    this.dropMenuComponentRef?.setInput('isVisible', visible);
  }

  /**
   * 更新菜单位置
   */
  public updatePosition(): void {
    this.overlayRef?.updatePosition();
  }

  /**
   * 关闭并销毁下拉菜单
   */
  private closeDropMenu(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.dropMenuComponentRef = null;
  }
} 