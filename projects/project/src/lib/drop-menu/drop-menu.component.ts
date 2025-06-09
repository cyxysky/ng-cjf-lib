import { Component, Input, Output, EventEmitter, TemplateRef, ChangeDetectorRef, ElementRef, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewEncapsulation, ViewChildren, QueryList, AfterViewInit, ViewChild, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropMenu } from './drop-menu.interface';
import { UtilsService } from '../core/utils/utils.service';
import { Overlay, OverlayRef, CdkOverlayOrigin, CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayService } from '../core/overlay/overlay.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'lib-drop-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-menu.component.html',
  encapsulation: ViewEncapsulation.None, // 确保嵌套样式可以渗透到子组件
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropMenuComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  /** 菜单数据 */
  @Input({ alias: 'items' }) items: DropMenu[] = [];
  /** 是否可见 */
  @Input({ alias: 'isVisible', transform: booleanAttribute }) isVisible: boolean = false;
  /** 菜单位置 */
  @Input({ alias: 'placement' }) placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  /** 菜单宽度 */
  @Input({ alias: 'width', transform: (value: any) => typeof value === 'string' ? value : value + 'px' }) width: number | string = 'auto';
  /** 自定义菜单项模板 */
  @Input({ alias: 'itemTemplate' }) itemTemplate: TemplateRef<{ $implicit: DropMenu, index: number }> | null = null;
  /** 是否自动关闭菜单 */
  @Input({ alias: 'autoClose', transform: booleanAttribute }) autoClose: boolean = true;
  /** 是否为子菜单 */
  @Input({ alias: 'isSubMenu', transform: booleanAttribute }) isSubMenu: boolean = false;
  /** 是否选中 */
  @Input({ alias: 'selectedItem' }) selectedItem: DropMenu | null = null;
  /** 父级是否禁用 */
  @Input({ alias: 'parentDisabled', transform: booleanAttribute }) parentDisabled: boolean = false;
  /** 纯模板 */
  @Input({ alias: 'template' }) template: TemplateRef<{ $implicit: DropMenu, index: number }> | null = null;
  /** 父菜单组件 */
  @Input({ alias: 'parentMenu' }) parentMenu: DropMenuComponent | null = null;
  /** 菜单悬停状态流 */
  @Input({ alias: 'hoverStateSubject' }) hoverStateSubject: Subject<boolean> | null = null;
  /** 是否允许选中父级 */
  @Input({ alias: 'allowParentSelect', transform: booleanAttribute }) allowParentSelect: boolean = false;
  /** 是否允许选中 */
  @Input({ alias: 'allowSelected', transform: booleanAttribute }) allowSelected: boolean = true;
  /** 点击菜单项事件 */
  @Output() itemClick = new EventEmitter<DropMenu>();
  /** 菜单关闭事件 */
  @Output() menuClose = new EventEmitter<void>();

  /** 悬浮元素引用 */
  @ViewChild(CdkOverlayOrigin, { static: false }) overlayOrigin!: CdkOverlayOrigin;
  /** 悬浮层引用 */
  @ViewChild(CdkConnectedOverlay, { static: false }) cdkOverlay!: CdkConnectedOverlay;
  /** 获取所有菜单项元素 */
  @ViewChildren('menuItemEl') menuItemElements!: QueryList<ElementRef>;

  /** 订阅集合 */
  private subscriptions = new Subscription();
  /** 跟踪当前悬停的子菜单 */
  public hoveredItemIndex: number = -1;
  /** 鼠标离开计时器 */
  private leaveTimer: any = null;
  /** 子菜单引用 */
  private subMenuOverlayRef: OverlayRef | null = null;
  /** 子菜单组件引用 */
  private subMenuComponentRef: any = null;
  /** 菜单项DOM引用 */
  private menuItemRefs = new Map<number, ElementRef>();
  /** 当前菜单是否处于悬停状态 */
  private isMenuHovered = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private overlay: Overlay,
    private overlayService: OverlayService,
  ) {
  }

  ngOnInit(): void {
    // 订阅悬停状态变化
    if (this.hoverStateSubject) {
      this.subscriptions.add(
        this.hoverStateSubject.subscribe(isHovered => {
          if (isHovered) {
            // 清除离开计时器
            if (this.leaveTimer) {
              clearTimeout(this.leaveTimer);
              this.leaveTimer = null;
            }
          } else {
            // 如果菜单链中的任何菜单都没有悬停，则准备关闭子菜单
            this.leaveTimer = setTimeout(() => {
              this.closeSubMenu();
              this.hoveredItemIndex = -1;
              this.cdr.detectChanges();
            }, OverlayService.overlayVisiableDuration);
          }
        })
      );
    }
  }

  ngAfterViewInit(): void {
    // 更新菜单项DOM引用
    this.updateMenuItemRefs();
    // 监听菜单项变化
    this.menuItemElements.changes.subscribe(() => {
      this.updateMenuItemRefs();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
    this.closeSubMenu();
    this.menuItemRefs.clear();
    this.subscriptions.unsubscribe();
  }

  /**
   * 通知悬停状态变化
   */
  public notifyHoverState(isHovered: boolean): void {
    this.hoverStateSubject && this.hoverStateSubject.next(isHovered);
  }

  /**
   * 更新菜单项DOM引用
   */
  public updateMenuItemRefs(): void {
    this.menuItemRefs.clear();
    this.menuItemElements.forEach((item, index) => {
      this.menuItemRefs.set(index, item);
    });
  }

  /**
   * 检查菜单项是否禁用（自身或父级禁用）
   */
  public isItemDisabled(item: DropMenu): boolean {
    return this.parentDisabled || !!item.disabled;
  }

  /**
   * 关闭菜单
   */
  public closeMenu(): void {
    this.closeSubMenu();
    this.menuClose.emit();
    this.isVisible = false;
    this.cdr.detectChanges();
  }

  /**
   * 点击菜单项
   */
  public onItemClick(item: DropMenu, event?: MouseEvent): void {
    if (this.isItemDisabled(item)) return;
    if (!this.allowParentSelect && item.children && item.children.length) return;
    event?.stopPropagation();
    this.itemClick.emit(item);
    // 如果没有子菜单且启用了自动关闭，则关闭菜单
    if (this.autoClose && (!item.children || item.children.length === 0)) {
      this.closeMenu();
    }
  }

  /**
   * 子菜单关闭
   */
  public onSubMenuClose(): void {
    this.menuClose.emit();
    this.subMenuComponentRef?.setInput('isVisible', false);
    this.subMenuOverlayRef?.detach();
    this.subMenuOverlayRef?.dispose();
    this.subMenuOverlayRef = null;
    this.subMenuComponentRef = null;
    this.cdr.detectChanges();
  }

  /**
   * 鼠标进入菜单项
   */
  public onMouseEnterItem(index: number): void {
    // 检查菜单项是否禁用
    if (!this.isItemDisabled(this.items[index])) {
      // 如果悬停在不同的菜单项上
      if (this.hoveredItemIndex !== index) {
        // 关闭当前打开的子菜单
        this.closeSubMenu();
        this.hoveredItemIndex = index;
        this.cdr.detectChanges();
      }
      // 展示子菜单
      const item = this.items[index];
      if (item.children?.length && this.menuItemRefs.has(index)) {
        this.showSubMenu(item, index);
      }
    }
    // 通知悬停状态变化
    this.notifyHoverState(true);
  }

  /**
   * 鼠标离开菜单项
   */
  public onMouseLeaveItem(): void {
    this.leaveTimer = setTimeout(() => {
      if (!this.isMenuHovered) {
        // 没有悬停在菜单上，发送状态变化
        this.notifyHoverState(false);
        this.cdr.detectChanges();
      }
    }, OverlayService.overlayVisiableDuration); // 使用统一的延迟时间
  }

  /**
   * 显示子菜单
   */
  private showSubMenu(item: DropMenu, index: number): void {
    // 如果子菜单已打开且索引相同，不重复操作
    if (this.subMenuOverlayRef && this.hoveredItemIndex === index) return;
    // 关闭当前子菜单
    this.closeSubMenu();
    const itemElement = this.menuItemRefs.get(index);
    if (!itemElement) return;
    // 创建子菜单位置策略
    const positions = this.getSubMenuPositions('right');
    this.subMenuOverlayRef = this.overlayService.createOverlay(
      {
        positionStrategy: this.overlay.position()
          .flexibleConnectedTo(itemElement)
          .withPositions(positions)
          .withPush(true)
          .withGrowAfterOpen(true)
      },
      itemElement,
      positions,
      // 外部点击不处理
      () => { },
      // 位置变化处理
      (position, isBackupUsed) => {
        if (isBackupUsed && this.subMenuComponentRef) {
          const isLeftPosition = position.overlayX === 'end' && position.originX === 'start';
          this.subMenuComponentRef.setInput('placement', isLeftPosition ? 'left' : 'right');
          this.subMenuComponentRef.changeDetectorRef.detectChanges();
        }
      }
    );
    const overlayElement = this.subMenuOverlayRef.overlayElement;
    overlayElement.style.zIndex = OverlayService.DropdownZIndex;
    // 创建子菜单组件
    const componentRef = this.subMenuOverlayRef.attach(new ComponentPortal(DropMenuComponent));
    // 设置子菜单属性
    componentRef.setInput('items', item.children || []);
    componentRef.setInput('placement', 'right');
    componentRef.setInput('width', this.width);
    componentRef.setInput('itemTemplate', this.itemTemplate);
    componentRef.setInput('autoClose', this.autoClose);
    componentRef.setInput('isSubMenu', true);
    componentRef.setInput('selectedItem', this.selectedItem);
    componentRef.setInput('parentDisabled', this.isItemDisabled(item));
    componentRef.setInput('template', this.template);
    componentRef.setInput('parentMenu', this);
    componentRef.setInput('hoverStateSubject', this.hoverStateSubject);
    componentRef.setInput('allowParentSelect', this.allowParentSelect);
    // 订阅子菜单事件
    const itemClickSub = componentRef.instance.itemClick.subscribe((clickedItem: DropMenu) => {
      this.itemClick.emit(clickedItem);
    });
    const menuCloseSub = componentRef.instance.menuClose.subscribe(() => {
      this.onSubMenuClose();
    });
    // 组件销毁时清理
    componentRef.onDestroy(() => {
      itemClickSub.unsubscribe();
      menuCloseSub.unsubscribe();
    });
    // 保存子菜单引用
    this.subMenuComponentRef = componentRef;
    this.cdr.detectChanges();
    this.utilsService.delayExecution(() => {
      componentRef.setInput('isVisible', true);
    });
  }

  /**
   * 关闭当前子菜单
   */
  private closeSubMenu(): void {
    if (this.subMenuOverlayRef) {
      this.subMenuOverlayRef.detach();
      this.subMenuOverlayRef.dispose();
      this.subMenuOverlayRef = null;
      this.subMenuComponentRef = null;
      this.cdr.detectChanges();
    }
  }

  /**
   * 获取子菜单位置配置
   */
  private getSubMenuPositions(preferredPlacement: string): any[] {
    if (preferredPlacement === 'right') {
      return [
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' }, // 右侧
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' }  // 左侧(最后)
      ];
    } else {
      return [
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' }, // 左侧
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' }  // 右侧(最后)
      ];
    }
  }

  /**
   * 更新浮层位置
   */
  public updateOverlayPosition(): void {
    if (this.cdkOverlay?.overlayRef) {
      this.overlayService.asyncUpdateOverlayPosition(this.cdkOverlay.overlayRef, 0);
    }
    this.cdr.detectChanges();
  }
}
