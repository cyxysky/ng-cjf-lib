import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef, ElementRef, ViewContainerRef, TemplateRef, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import * as _ from 'lodash';
import { DropMenuDirective } from '../drop-menu/drop-menu.directive';
import { DropMenu } from '../drop-menu/drop-menu.interface';
import { CustomerExpandCollapse } from '../core';
import { MenuItem } from './menu.interface';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [DropMenuDirective],
  templateUrl: './menu.component.html',
  animations: [
    CustomerExpandCollapse(300)
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit, OnChanges {
  /** 菜单模式 */
  @Input() mode: 'vertical' | 'inline' | 'horizontal' = 'inline';
  /** 菜单主题 */
  @Input() theme: 'light' | 'dark' = 'light';
  /** 是否折叠 */
  @Input() inlineCollapsed = false;
  /** 菜单项 */
  @Input() items: MenuItem[] = [];
  /** 是否可选择 */
  @Input() selectable = true;
  /** 内联缩进 */
  @Input() inlineIndent = 24;
  /** 选中项 */
  @Input() selectedKeys: string[] = [];
  /** 菜单项点击事件 */
  @Output() menuItemClick = new EventEmitter<MenuItem>();
  /** 展开/折叠事件 */
  @Output() openChange = new EventEmitter<{ item: MenuItem, open: boolean }>();

  // 组件内部数据，与输入数据隔离
  internalItems: MenuItem[] = [];
  /** 当前选中的菜单项 */
  currentSelectedItem: MenuItem | null = null;

  constructor(
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // 深拷贝输入数据，实现数据隔离
    this.internalItems = _.cloneDeep(this.items);
    this.updateSelectedItems();
    // 确保初始时所有子菜单都是关闭的
    this.ensureAllMenusClosed();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 当输入数据变化时更新内部数据
    if (changes['items']) {
      this.internalItems = _.cloneDeep(this.items);
    }
    if (changes['selectedKeys'] && !changes['selectedKeys'].firstChange) {
      this.updateSelectedItems();
    }
    if (changes['mode'] || changes['inlineCollapsed']) {
      // 在水平模式或折叠模式下关闭所有展开的子菜单
      if (this.mode === 'horizontal' || this.inlineCollapsed) {
        this.collapseAllSubMenus(this.internalItems);
      }
    }
    this.cdr.detectChanges();
  }

  /**
   * 确保所有菜单初始时是关闭的
   */
  private ensureAllMenusClosed(): void {
    if (this.internalItems) {
      this.internalItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          // 初始状态设为关闭
          item.isOpen = false;
          // 递归处理子菜单
          this.closeAllSubMenus(item.children);
        }
      });
    }
  }

  /**
   * 递归关闭所有子菜单
   * @param items 菜单项
   */
  private closeAllSubMenus(items: MenuItem[]): void {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.isOpen = false;
        this.closeAllSubMenus(item.children);
      }
    });
  }

  /**
   * 切换子菜单状态 - 只用于内联模式
   * @param item 菜单项
   */
  toggleSubMenu(item: MenuItem): void {
    if (item.disabled || !item.children || item.children.length === 0 || !(this.mode === 'inline' && !this.inlineCollapsed)) {
      return;
    }
    // 内联模式：切换当前子菜单的展开/折叠状态
    item.isOpen = !item.isOpen;
    this.openChange.emit({ item, open: !!item.isOpen });
    this.cdr.detectChanges();
  }

  /**
   * 点击菜单项
   * @param item 菜单项
   * @param event 事件
   */
  public onMenuItemClick(item: MenuItem, event?: MouseEvent | null): void {
    if (this.selectable && !item.disabled) {
      // 先取消所有选中状态
      this.clearSelectedState(this.internalItems);
      // 设置当前选中
      item.selected = true;
      // 如果是子菜单项，确保父菜单项展开
      if (this.mode === 'inline' && !this.inlineCollapsed) {
        this.openParentMenus(this.internalItems, item);
      }
      // 通过找到原始数据中对应的项发送事件，保持输入输出数据一致性
      const originalItem = this.findOriginalItem(item.key, this.items);
      this.menuItemClick.emit(originalItem || item);
      // 阻止事件冒泡
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.cdr.detectChanges();
    }
  }

  /**
   * 根据key查找原始数据中的菜单项
   * @param key 键
   * @param items 菜单项
   * @param findKey 查找键
   * @returns 菜单项
   */
  private findOriginalItem(key: string, items: MenuItem[], findKey: string = 'key'): MenuItem | null {
    for (const item of items) {
      if (item[findKey as keyof MenuItem] === key) return item;
      if (item.children && item.children.length > 0) {
        const found = this.findOriginalItem(key, item.children, findKey);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 检查是否有选中的子菜单项
   * @param item 菜单项
   * @returns 是否包含
   */
  hasSelectedChild(item: MenuItem): boolean {
    if (!item.children) {
      return false;
    }
    // 直接检查该项的子菜单项是否有选中状态
    const hasDirectSelectedChild = item.children.some(child => child.selected);
    if (hasDirectSelectedChild) {
      return true;
    }
    // 递归检查子级的子级是否有选中项
    return item.children.some(child => {
      if (child.children && child.children.length > 0) {
        return this.hasSelectedChild(child);
      }
      return false;
    });
  }

  /**
   * 打开选中项的所有父级菜单
   * @param items 菜单项
   * @param selectedItem 选中项
   */
  private openParentMenus(items: MenuItem[], selectedItem: MenuItem): void {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        // 检查当前项的直接子项中是否包含选中项
        const directChild = item.children.find(child => child === selectedItem);
        if (directChild) {
          item.isOpen = true;
          return;
        }
        // 递归检查更深层次的子项
        const hasSelectedChild = this.hasSelectedChildInTree(item, selectedItem);
        if (hasSelectedChild) {
          item.isOpen = true;
          this.openParentMenus(item.children, selectedItem);
        }
      }
    }
  }

  /**
   * 检查菜单树中是否包含指定的菜单项
   * @param parent 父菜单项
   * @param targetItem 目标菜单项
   * @returns 是否包含
   */
  private hasSelectedChildInTree(parent: MenuItem, targetItem: MenuItem): boolean {
    if (!parent.children) return false;
    for (const child of parent.children) {
      if (child === targetItem) return true;
      if (child.children && child.children.length > 0) {
        if (this.hasSelectedChildInTree(child, targetItem)) return true;
      }
    }
    return false;
  }

  /**
   * 清除所有菜单项的选中状态
   * @param items 菜单项
   */
  private clearSelectedState(items: MenuItem[]): void {
    items.forEach(item => {
      item.selected = false;
      if (item.children && item.children.length > 0) {
        this.clearSelectedState(item.children);
      }
    });
  }

  /**
   * 根据selectedKeys更新选中状态
   */
  private updateSelectedItems(): void {
    if (!this.selectedKeys || this.selectedKeys.length === 0) {
      // 如果没有选中项，清除所有选中状态
      this.clearSelectedState(this.internalItems);
      return;
    }
    // 先清除所有选中状态
    this.clearSelectedState(this.internalItems);
    // 只使用第一个选中键 (如果有多个，只选中第一个)
    const selectedKey = this.selectedKeys[0];
    this.setSelectedByKey(this.internalItems, selectedKey);
    // 确保所有选中项的父菜单是展开的
    if (this.mode === 'inline' && !this.inlineCollapsed) {
      this.ensureParentMenusOpen(this.internalItems);
    }
  }

  /**
   * 根据单个key设置选中项
   * @param items 菜单项
   * @param key 键
   */
  private setSelectedByKey(items: MenuItem[], key: string): void {
    for (const item of items) {
      if (item.key === key) {
        item.selected = true;
        return; // 找到第一个匹配项就返回
      }
      if (item.children && item.children.length > 0) {
        this.setSelectedByKey(item.children, key);
      }
    }
  }

  /**
   * 确保所有选中项的父菜单是展开的
   * @param items 菜单项
   */
  private ensureParentMenusOpen(items: MenuItem[]): void {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        const hasSelected = this.hasSelectedChild(item);
        if (hasSelected && this.mode === 'inline' && !this.inlineCollapsed) {
          item.isOpen = true;
        }
        this.ensureParentMenusOpen(item.children);
      }
    });
  }

  /**
   * 收起所有子菜单
   * @param items 菜单项
   */
  private collapseAllSubMenus(items: MenuItem[]): void {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.isOpen = false;
        this.collapseAllSubMenus(item.children);
      }
    });
  }

  /**
   * 处理从DropMenu指令传递过来的菜单项点击事件
   * @param dropMenuItem 菜单项
   * @param event 事件
   */
  public onDropMenuItemClick(dropMenuItem: DropMenu, event?: MouseEvent | null): void {
    // 查找对应的MenuItem
    const menuItem = this.findOriginalItem(dropMenuItem.title, this.internalItems, 'title');
    if (menuItem && !menuItem.disabled && !menuItem.children) {
      this.onMenuItemClick(menuItem, event as MouseEvent);
    }
  }

  /**
   * 判断是否显示下拉菜单
   * @returns 是否显示
   */
  public showDropMenu(): boolean {
    return this.mode !== 'vertical' && !this.inlineCollapsed && this.mode !== 'horizontal'
  }
}


