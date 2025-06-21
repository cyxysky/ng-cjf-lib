import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { MenuComponent, MenuItem } from '@project';

@Component({
  selector: 'app-doc-menu',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    MenuComponent
],
  templateUrl: './doc-menu.component.html',
  styleUrl: './doc-menu.component.less'
})
export class DocMenuComponent {
  // 基本菜单数据
  basicMenuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'bi-123',
      children: [
        {
          key: '1-1',
          title: '选项1',
          icon: 'bi-2-circle',
          children: [
            {
              key: '1-1-1',
              title: '选项1-1',
              icon: 'bi-3-circle',
            }
          ]
        },
        {
          key: '1-2',
          title: '选项2',
          icon: 'bi-3-circle'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'bi-4-circle'
    },
    {
      key: '4',
      title: '导航四',
      icon: 'bi-4-circle'
    },
    {
      key: '5',
      title: '导航五',
      icon: 'bi-4-circle'
    },
    {
      key: '6',
      title: '导航六',
      icon: 'bi-4-circle'
    },
    {
      key: '7',
      title: '导航七',
      icon: 'bi-4-circle'
    },
    {
      key: '3',
      title: '导航三',
      icon: 'bi-5-circle',
      children: [
        {
          key: '3-1',
          title: '选项3',
          icon: 'bi-6-circle'
        },
        {
          key: '3-2',
          title: '选项4',
          icon: 'bi-7-circle'
        }
      ]
    }
  ];

  // 主题模式示例
  darkThemeItems: MenuItem[] = [...this.basicMenuItems];

  // 菜单模式示例
  verticalMenuItems: MenuItem[] = [...this.basicMenuItems];
  horizontalMenuItems: MenuItem[] = [...this.basicMenuItems];

  // 折叠示例
  collapsedMenuItems: MenuItem[] = [...this.basicMenuItems];
  isCollapsed = false;

  // 禁用示例
  disabledMenuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1',
          icon: 'icon-appstore'
        },
        {
          key: '1-2',
          title: '选项2',
          icon: 'icon-setting',
          disabled: true
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team',
      disabled: true
    },
    {
      key: '3',
      title: '导航三',
      icon: 'icon-dashboard'
    }
  ];

  // 事件处理
  selectedItem: MenuItem | null = null;

  onMenuItemClick(item: MenuItem): void {
    this.selectedItem = item;
    console.log('菜单项点击:', item);
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'mode', description: '菜单类型', type: "'vertical' | 'inline' | 'horizontal'", default: "'inline'" },
        { name: 'theme', description: '主题颜色', type: "'light' | 'dark'", default: "'light'" },
        { name: 'inlineCollapsed', description: '内联菜单折叠状态', type: 'boolean', default: 'false' },
        { name: 'items', description: '菜单数据', type: 'MenuItem[]', default: '[]' },
        { name: 'selectable', description: '是否允许选择菜单项', type: 'boolean', default: 'true' },
        { name: 'inlineIndent', description: '内联菜单缩进宽度', type: 'number', default: '24' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'menuItemClick', description: '点击菜单项时的回调', type: 'EventEmitter<MenuItem>' }
      ]
    },
    {
      title: 'MenuItem接口',
      items: [
        { name: 'key', description: '菜单项的唯一标识', type: 'string', default: '-' },
        { name: 'title', description: '菜单项标题', type: 'string', default: '-' },
        { name: 'icon', description: '菜单项图标', type: 'string', default: '-' },
        { name: 'children', description: '子菜单项', type: 'MenuItem[]', default: '-' },
        { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'isOpen', description: '子菜单是否展开', type: 'boolean', default: 'false' },
        { name: 'selected', description: '是否选中', type: 'boolean', default: 'false' },
        { name: 'link', description: '链接地址', type: 'string', default: '-' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <lib-menu
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
    <p *ngIf="selectedItem">当前选中: {{ selectedItem.title }}</p>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1',
          icon: 'icon-appstore'
        },
        {
          key: '1-2',
          title: '选项2',
          icon: 'icon-setting'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team'
    }
  ];
  
  selectedItem: MenuItem | null = null;

  onMenuItemClick(item: MenuItem): void {
    this.selectedItem = item;
    console.log('菜单项点击:', item);
  }
}`;

  // 深色主题
  darkThemeSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <lib-menu
      [theme]="'dark'"
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1',
          icon: 'icon-appstore'
        },
        {
          key: '1-2',
          title: '选项2',
          icon: 'icon-setting'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team'
    }
  ];
  
  onMenuItemClick(item: MenuItem): void {
    console.log('菜单项点击:', item);
  }
}`;

  // 垂直模式
  verticalSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <lib-menu
      [mode]="'vertical'"
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1'
        },
        {
          key: '1-2',
          title: '选项2'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team'
    }
  ];
  
  onMenuItemClick(item: MenuItem): void {
    console.log('菜单项点击:', item);
  }
}`;

  // 水平模式
  horizontalSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <lib-menu
      [mode]="'horizontal'"
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1'
        },
        {
          key: '1-2',
          title: '选项2'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team'
    }
  ];
  
  onMenuItemClick(item: MenuItem): void {
    console.log('菜单项点击:', item);
  }
}`;

  // 折叠菜单
  collapsedSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <button (click)="toggleCollapsed()">
      {{ isCollapsed ? '展开' : '折叠' }}
    </button>
    <lib-menu
      [inlineCollapsed]="isCollapsed"
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1'
        },
        {
          key: '1-2',
          title: '选项2'
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team'
    }
  ];
  
  isCollapsed = false;
  
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  
  onMenuItemClick(item: MenuItem): void {
    console.log('菜单项点击:', item);
  }
}`;

  // 禁用菜单项
  disabledSource = `
import { Component } from '@angular/core';
import { MenuComponent, MenuItem } from 'ng-cjf-lib';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [MenuComponent],
  template: \`
    <lib-menu
      [items]="menuItems"
      (menuItemClick)="onMenuItemClick($event)">
    </lib-menu>
  \`,
})
export class ExampleComponent {
  menuItems: MenuItem[] = [
    {
      key: '1',
      title: '导航一',
      icon: 'icon-home',
      children: [
        {
          key: '1-1',
          title: '选项1'
        },
        {
          key: '1-2',
          title: '选项2',
          disabled: true
        }
      ]
    },
    {
      key: '2',
      title: '导航二',
      icon: 'icon-team',
      disabled: true
    },
    {
      key: '3',
      title: '导航三',
      icon: 'icon-dashboard'
    }
  ];
  
  onMenuItemClick(item: MenuItem): void {
    console.log('菜单项点击:', item);
  }
}`;
}
