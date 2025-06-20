import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ProjectModule, DropMenu, DropMenuDirective, OverlayBasicPosition, ButtonComponent, ButtonType } from '@project';

@Component({
  selector: 'app-doc-drop-menu',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    ProjectModule,
    DropMenuDirective,
    ButtonComponent
],
  templateUrl: './doc-drop-menu.component.html',
  styleUrl: './doc-drop-menu.component.less'
})
export class DocDropMenuComponent {
  // 基本菜单项
  basicItems: DropMenu[] = [
    { title: '菜单项 1', icon: 'icon-user', children: [] },
    { title: '菜单项 2', icon: 'icon-setting', children: [], disabled: true },
    { title: '菜单项 3', icon: 'icon-folder', children: [] },
    { title: '菜单项 4', icon: 'icon-file', children: [] }
  ];

  // 嵌套菜单项
  nestedItems: DropMenu[] = [
    { 
      title: '一级菜单 1', 
      icon: 'icon-folder', 
      children: [
        { title: '二级菜单 1-1', icon: 'icon-file', children: [] },
        { title: '二级菜单 1-2', icon: 'icon-file', children: [] }
      ] 
    },
    { 
      title: '一级菜单 2', 
      icon: 'icon-folder', 
      children: [
        { title: '二级菜单 2-1', icon: 'icon-file', children: [] },
        { 
          title: '二级菜单 2-2', 
          icon: 'icon-folder', 
          children: [
            { title: '三级菜单 2-2-1', icon: 'icon-file', children: [] },
            { title: '三级菜单 2-2-2', icon: 'icon-file', children: [] }
          ] 
        }
      ] 
    },
    { title: '一级菜单 3', icon: 'icon-setting', children: [] }
  ];

  // 自定义菜单项
  customItems: DropMenu[] = [
    { title: '自定义菜单项 1', icon: 'icon-star', children: [] },
    { title: '自定义菜单项 2', icon: 'icon-heart', children: [] },
    { title: '自定义菜单项 3', icon: 'icon-bell', children: [] }
  ];

  // 所有位置选项
  placements: Array<OverlayBasicPosition> = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

  // 受控模式的可见性
  controlledVisible = false;

  // 用户选择的菜单项
  selectedItem: DropMenu | null = null;

  // 完全模板可见性
  fullCustomVisible = false;

  // 选中状态演示的选中项
  selectedMenuItem: DropMenu | null = null;

  // 菜单可见性变化处理
  onVisibleChange(visible: boolean): void {
    console.log('菜单可见性变化:', visible);
  }

  // 菜单项点击处理
  onMenuItemClick(item: DropMenu): void {
    console.log('点击菜单项:', item);
    this.selectedItem = item;
  }

  // 通用菜单项点击处理
  onItemClick(item: DropMenu): void {
    console.log('自定义模板中点击菜单项:', item);
  }

  // 选中项变化处理
  onSelectedChange(item: DropMenu | null): void {
    console.log('选中项变化:', item);
    this.selectedMenuItem = item;
  }

  // 关闭自定义菜单
  closeMenu(): void {
    console.log('关闭自定义菜单');
    this.fullCustomVisible = false;
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: 'DropMenu指令属性',
      items: [
        { name: 'dropMenuItems', description: '菜单项列表', type: 'DropMenu[]', default: '[]' },
        { name: 'dropMenuPlacement', description: '菜单位置', type: 'OverlayBasicPosition', default: '\'bottom-left\'' },
        { name: 'dropMenuTrigger', description: '触发方式', type: '\'click\' | \'hover\'', default: '\'click\'' },
        { name: 'dropMenuVisible', description: '菜单是否可见', type: 'boolean', default: 'false' },
        { name: 'dropMenuStrictVisible', description: '是否严格由编程控制显示', type: 'boolean', default: 'false' },
        { name: 'dropMenuWidth', description: '菜单宽度', type: 'number | string', default: '\'auto\'' },
        { name: 'dropMenuItemTemplate', description: '自定义菜单项模板', type: 'TemplateRef<{ $implicit: DropMenu, index: number }>', default: 'null' },
        { name: 'dropMenuMouseEnterDelay', description: '鼠标进入延迟时间', type: 'number', default: '50' },
        { name: 'dropMenuMouseLeaveDelay', description: '鼠标离开延迟时间', type: 'number', default: '500' },
        { name: 'dropMenuAutoClose', description: '点击菜单项后是否自动关闭菜单', type: 'boolean', default: 'true' },
        { name: 'dropMenuSelected', description: '当前选中的菜单项', type: 'DropMenu | null', default: 'null' },
        { name: 'dropMenuTemplate', description: '完全自定义菜单模板', type: 'TemplateRef<{ $implicit: DropMenu, index: number }>', default: 'null' }
      ]
    },
    {
      title: 'DropMenu指令事件',
      items: [
        { name: 'dropMenuVisibleChange', description: '菜单显示状态改变事件', type: 'EventEmitter<boolean>' },
        { name: 'dropMenuItemClick', description: '菜单项点击事件', type: 'EventEmitter<DropMenu>' },
        { name: 'dropMenuSelectedChange', description: '菜单项选中状态改变事件', type: 'EventEmitter<DropMenu | null>' }
      ]
    },
    {
      title: 'DropMenu组件属性',
      items: [
        { name: 'items', description: '菜单项列表', type: 'DropMenu[]', default: '[]' },
        { name: 'isVisible', description: '菜单是否可见', type: 'boolean', default: 'false' },
        { name: 'placement', description: '菜单位置', type: '\'top\' | \'bottom\' | \'left\' | \'right\'', default: '\'bottom\'' },
        { name: 'width', description: '菜单宽度', type: 'number | string', default: '\'auto\'' },
        { name: 'itemTemplate', description: '自定义菜单项模板', type: 'TemplateRef<{ $implicit: DropMenu, index: number }>', default: 'null' },
        { name: 'autoClose', description: '点击菜单项后是否自动关闭菜单', type: 'boolean', default: 'true' },
        { name: 'isSubMenu', description: '是否为子菜单', type: 'boolean', default: 'false' },
        { name: 'selectedItem', description: '当前选中的菜单项', type: 'DropMenu | null', default: 'null' },
        { name: 'template', description: '完全自定义菜单模板', type: 'TemplateRef<{ $implicit: DropMenu, index: number }>', default: 'null' }
      ]
    },
    {
      title: 'DropMenu接口',
      items: [
        { name: 'title', description: '菜单项文本', type: 'string', default: '-' },
        { name: 'icon', description: '菜单项图标', type: 'string', default: '-' },
        { name: 'children', description: '子菜单项列表', type: 'DropMenu[]', default: '[]' },
        { name: 'disabled', description: '菜单项是否禁用', type: 'boolean', default: 'false' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems"
      [buttonContent]="'点击显示菜单'"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [
    { title: '菜单项 1', icon: 'icon-user', children: [] },
    { title: '菜单项 2', icon: 'icon-setting', children: [] },
    { title: '菜单项 3', icon: 'icon-folder', children: [] }
  ];
}`;

  // 触发方式
  triggerSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuTrigger]="'click'"
      [buttonContent]="'点击触发'"
      [buttonType]="'default'">
    </lib-button>
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuTrigger]="'hover'"
      [buttonContent]="'悬停触发'"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [
    { title: '菜单项 1', icon: 'icon-user', children: [] },
    { title: '菜单项 2', icon: 'icon-setting', children: [] }
  ];
}`;

  // 菜单位置
  placementSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button *ngFor="let pos of placements" 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuPlacement]="pos"
      [buttonContent]="pos"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [...];
  placements: string[] = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
}`;

  // 自定义宽度
  widthSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuWidth]="200"
      [buttonContent]="'宽度: 200px'"
      [buttonType]="'default'">
    </lib-button>
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuWidth]="'300px'"
      [buttonContent]="'宽度: 300px'"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [...];
}`;

  // 嵌套菜单
  nestedSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="nestedItems"
      [buttonContent]="'嵌套菜单'"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  nestedItems: DropMenu[] = [
    { 
      title: '一级菜单 1', 
      icon: 'icon-folder', 
      children: [
        { title: '二级菜单 1-1', icon: 'icon-file', children: [] },
        { title: '二级菜单 1-2', icon: 'icon-file', children: [] }
      ] 
    },
    { 
      title: '一级菜单 2', 
      icon: 'icon-folder', 
      children: [
        { title: '二级菜单 2-1', icon: 'icon-file', children: [] },
        { 
          title: '二级菜单 2-2', 
          icon: 'icon-folder', 
          children: [
            { title: '三级菜单 2-2-1', icon: 'icon-file', children: [] },
            { title: '三级菜单 2-2-2', icon: 'icon-file', children: [] }
          ] 
        }
      ] 
    }
  ];
}`;

  // 自定义模板
  customTemplateSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="customItems" 
      [dropMenuItemTemplate]="customItemTpl"
      [buttonContent]="'自定义菜单项'"
      [buttonType]="'default'">
    </lib-button>
    
    <ng-template #customItemTpl let-item let-index="index">
      <li class="custom-menu-item" (click)="onItemClick(item)">
        <span class="custom-menu-item-icon" *ngIf="item.icon">
          <i [class]="item.icon"></i>
        </span>
        <span class="custom-menu-item-title">
          {{ index + 1 }}. {{ item.title }}
        </span>
      </li>
    </ng-template>
  \`
})
export class DemoComponent {
  customItems: DropMenu[] = [
    { title: '自定义菜单项 1', icon: 'icon-star', children: [] },
    { title: '自定义菜单项 2', icon: 'icon-heart', children: [] },
    { title: '自定义菜单项 3', icon: 'icon-bell', children: [] }
  ];
  
  onItemClick(item: DropMenu): void {
    console.log('点击菜单项:', item);
  }
}`;

  // 受控模式
  controlledSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      (click)="visible = !visible"
      [buttonContent]="visible ? '隐藏菜单' : '显示菜单'"
      [buttonType]="'default'">
    </lib-button>
    
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuVisible]="visible"
      [dropMenuStrictVisible]="true"
      (dropMenuVisibleChange)="onVisibleChange($event)"
      [buttonContent]="'受控的菜单'"
      [buttonType]="'default'">
    </lib-button>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [...];
  visible = false;
  
  onVisibleChange(visible: boolean): void {
    this.visible = visible;
  }
}`;

  // 监听菜单项点击
  eventSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      (dropMenuItemClick)="onMenuItemClick($event)"
      [buttonContent]="'点击菜单项'"
      [buttonType]="'default'">
    </lib-button>
    
    <div *ngIf="selectedItem" class="example-value">
      已选择: {{ selectedItem.title }}
    </div>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [...];
  selectedItem: DropMenu | null = null;
  
  onMenuItemClick(item: DropMenu): void {
    this.selectedItem = item;
  }
}`;

  // 更新自动关闭模式示例
  autoCloseSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <div style="display: flex; gap: 16px;">
      <lib-button 
        libDropMenu 
        [dropMenuItems]="menuItems" 
        [dropMenuAutoClose]="true"
        [buttonContent]="'自动关闭'"
        [buttonType]="'default'">
      </lib-button>
      
      <lib-button 
        libDropMenu 
        [dropMenuItems]="menuItems" 
        [dropMenuAutoClose]="false"
        [buttonContent]="'点击不关闭'"
        [buttonType]="'default'">
      </lib-button>
    </div>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [
    { title: '菜单项 1', icon: 'icon-user', children: [] },
    { title: '菜单项 2', icon: 'icon-setting', children: [] },
    { 
      title: '多级菜单', 
      icon: 'icon-folder', 
      children: [
        { title: '子菜单项 1', icon: 'icon-file', children: [] },
        { title: '子菜单项 2', icon: 'icon-file', children: [] }
      ] 
    }
  ];
}`;

  // 选中状态示例
  selectedItemSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuItems]="menuItems" 
      [dropMenuSelected]="selectedItem"
      (dropMenuSelectedChange)="onSelectedChange($event)"
      [buttonContent]="'选择菜单项'"
      [buttonType]="'default'">
    </lib-button>
    
    <div *ngIf="selectedItem" class="example-value">
      当前选中: {{ selectedItem.title }}
    </div>
  \`
})
export class DemoComponent {
  menuItems: DropMenu[] = [...];
  selectedItem: DropMenu | null = null;
  
  onSelectedChange(item: DropMenu | null): void {
    this.selectedItem = item;
  }
}`;

  // 完全自定义模板示例
  fullTemplateSource = `
import { Component } from '@angular/core';
import { DropMenu } from 'your-lib';

@Component({
  selector: 'app-demo',
  template: \`
    <lib-button 
      libDropMenu 
      [dropMenuTemplate]="customTpl"
      [buttonContent]="'完全自定义模板'"
      [buttonType]="'default'">
    </lib-button>
    
    <ng-template #customTpl>
      <div class="custom-menu-container">
        <div class="custom-menu-header">
          <h3>自定义菜单头部</h3>
        </div>
        <div class="custom-menu-content">
          <p>这是一个完全自定义的菜单内容</p>
          <ul>
            <li>自定义项 1</li>
            <li>自定义项 2</li>
            <li>自定义项 3</li>
          </ul>
        </div>
        <div class="custom-menu-footer">
          <lib-button 
            [buttonContent]="'关闭菜单'"
            [buttonType]="'primary'"
            [buttonSize]="'small'"
            (click)="closeMenu()">
          </lib-button>
        </div>
      </div>
    </ng-template>
  \`
})
export class DemoComponent {
  closeMenu(): void {
    // 在实际应用中，这里应该通过获取指令实例来调用其hide方法
    console.log('关闭菜单');
  }
}`;
}
