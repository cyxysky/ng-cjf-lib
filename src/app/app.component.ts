import { Component, effect, resource, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuItem, ProjectModule } from '../../projects/project/src/public-api';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { DocModule } from '../doc/doc.module';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash'
@Component({
  selector: 'app-root',
  imports: [FormsModule, ProjectModule, ScrollingModule, DocModule, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  standalone: true
})
export class AppComponent {
  /** 标题 */
  title = 'ng-cjf-lib';

  /** 当前组件 */
  nowComponent = signal('');

  /** 菜单折叠状态 */
  menuCollapsed = signal(false);

  /** 菜单项数据 */
  menuItems: MenuItem[] = [];

  /** 组件列表 */
  components = [
    { name: '气泡确认框', path: 'popconfirm', icon: 'bi-chat-dots-fill' },
    { name: '气泡', path: 'popover', icon: 'bi-chat' },
    { name: '按钮', path: 'button', icon: 'bi-plus-square-fill' },
    { name: '开关', path: 'switch', icon: 'bi-toggles' },
    { name: '标签', path: 'tag', icon: 'bi-tag' },
    { name: '数字输入框', path: 'number-input', icon: 'bi-123' },
    { name: '分段器', path: 'segmented', icon: 'bi-segmented-nav' },
    { name: '水印', path: 'water-mark', icon: 'bi-water' },
    { name: '输入框', path: 'input', icon: 'bi-input-cursor' },
    { name: '提示框', path: 'tooltip', icon: 'bi-chat-square-dots-fill' },
    { name: '复选框', path: 'checkbox', icon: 'bi-check2-square' },
    { name: '单选框', path: 'radio', icon: 'bi-ui-radios' },
    { name: '滑块', path: 'slider', icon: 'bi-sliders' },
    { name: '模态框', path: 'modal', icon: 'bi-calendar3-fill' },
    { name: '标签页', path: 'tabs', icon: 'bi-window-split' },
    { name: '日期时间', path: 'date-timer', icon: 'bi-calendar' },
    { name: '消息', path: 'message', icon: 'bi-chat-left' },
    { name: '抽屉', path: 'drawer', icon: 'bi-easel3' },
    { name: '下拉菜单', path: 'drop-menu', icon: 'bi-menu-down' },
    { name: '树', path: 'tree', icon: 'bi-tree' },
    { name: '选择器', path: 'select', icon: 'bi-menu-button-wide' },
    { name: '树选择器', path: 'tree-select', icon: 'bi-menu-app' },
    { name: '级联选择器', path: 'cascader', icon: 'bi-menu-button' },
    { name: '菜单', path: 'menu', icon: 'bi-list' },
    { name: '表格', path: 'table', icon: 'bi-table' },
  ]

  /** 业务组件列表 */
  businessComponents = [
    { name: '多维流程图', path: 'multi-dimensional-flowchart' },
    { name: '拖拽生成表单', path: 'customer-form' },
    { name: '流程树', path: 'process-tree' },
    { name: 'svg生成', path: 'generate-png' },
    { name: '结构树', path: 'structure-tree' },
    { name: '动态表格', path: 'dynamic-table' },
    { name: '用户选择', path: 'user-select' },
    { name: '虚拟滚动', path: 'virtual-scroll' },
    { name: '图表', path: 'chart' },
  ]

  constructor(private router: Router) {
    // 检查解锁状态，如果未解锁直接跳转到解锁页面
    // this.checkUnlockStatus();
    
    // 初始化菜单数据
    this.initMenuItems();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.nowComponent.set(event.url.split('/').pop() || '');
      }
    });
  }

  /**
   * 检查解锁状态
   */
  private checkUnlockStatus(): void {
    const UNLOCK_KEY = 'app_unlocked';
    const isUnlocked = sessionStorage.getItem(UNLOCK_KEY) === 'true';
    
    if (!isUnlocked) {
      this.router.navigate(['/unlock']);
    }
  }

  /**
   * 初始化菜单数据
   */
  private initMenuItems(): void {
    // 将组件列表转换为MenuItem类型，每个组件菜单项设置为默认展开
    const componentMenuItems: MenuItem[] = this.components.map(item => ({
      key: item.path,
      title: item.name,
      link: item.path,
      isOpen: true,
      icon: item.icon // 添加图标
    }));

    // 将业务组件列表转换为MenuItem类型，每个业务组件菜单项设置为默认展开
    const businessMenuItems: MenuItem[] = this.businessComponents.map(item => ({
      key: item.path,
      title: item.name,
      link: item.path,
      isOpen: true,
      icon: 'bi-diagram-3-fill' // 添加图标
    }));

    // 构建完整的菜单结构，所有菜单和子菜单都默认展开
    this.menuItems = [
      {
        key: 'start',
        title: '开始',
        link: 'start',
        isOpen: true,
        icon: 'bi-house'
      },
      {
        key: 'components',
        title: '基础组件',
        children: componentMenuItems,
        isOpen: true,
        icon: 'bi-grid-3x3-gap'
      },
      {
        key: 'business',
        title: '业务组件',
        children: businessMenuItems,
        isOpen: true,
        icon: 'bi-diagram-3'
      }
    ];
  }

  /**
   * 菜单点击处理
   * @param item 菜单项
   */
  handleMenuClick(item: MenuItem): void {
    if (item.link) {
      this.nowComponent.set(item.key);
      this.nav(item.link);
    }
  }

  /**
   * 导航
   * @param path 路径
   */
  nav(path: string) {
    this.router.navigate([path]);
  }

  /**
   * 切换菜单折叠状态
   */
  toggleMenuCollapse(): void {
    this.menuCollapsed.update(value => !value);
  }


}
