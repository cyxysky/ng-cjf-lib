import { Component, TemplateRef, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { SegmentedComponent, TabComponent, TabsComponent } from '@project';

@Component({
  selector: 'app-doc-tabs',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    SegmentedComponent,
    TabsComponent,
    TabComponent
],
  templateUrl: './doc-tabs.component.html',
  styleUrl: './doc-tabs.component.less'
})
export class DocTabsComponent {
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
  // 配置项示例
  selectedIndex = 0;

  // 位置示例
  tabPosition: 'top' | 'bottom' = 'top';
  positionOptions = [
    { value: 'top', label: '顶部' },
    { value: 'bottom', label: '底部' }
  ];

  // 动态标签页示例
  dynamicTabs = [
    { key: 'tab1', title: '标签页1', content: '标签页1的内容' },
    { key: 'tab2', title: '标签页2', content: '标签页2的内容' }
  ];
  tabIndex = 2;
  
  // 懒加载示例
  lazyLoadedTabs = new Set<number>([0]); // 默认加载第一个标签页
  tabInitTimes: { [key: number]: string } = {
    0: this.getCurrentTime() // 默认第一个标签页初始化时间
  };
  
  // 销毁非活动标签示例
  destroyInactive = false;
  destroyOptions = [
    { value: false, label: '保留非活动标签' },
    { value: true, label: '销毁非活动标签' }
  ];
  currentActiveTab = 0;
  destroyTabRenderTimes: { [key: number]: string } = {
    0: this.getCurrentTime() // 默认第一个标签页渲染时间
  };

  // API 文档
  apiSections: ApiData[] = [
    {
      title: 'Tabs 组件属性',
      items: [
        { name: 'tabsSelectedIndex', description: '当前选中的标签页索引', type: 'number', default: '0' },
        { name: 'tabsTabPosition', description: '标签位置', type: "'top' | 'bottom'", default: "'top'" },
        { name: 'tabsTabType', description: '标签页类型', type: "'line' | 'card'", default: "'line'" },
        { name: 'tabsTabAlign', description: '标签对齐方式', type: "'left' | 'center' | 'right'", default: "'left'" },
        { name: 'tabsTabSize', description: '标签大小', type: "'default' | 'small' | 'large'", default: "'default'" },
        { name: 'tabsClosable', description: '标签是否可关闭', type: 'boolean', default: 'false' },
        { name: 'tabsTabHideAdd', description: '是否隐藏新增按钮', type: 'boolean', default: 'true' },
        { name: 'tabsAddIcon', description: '新增图标的类名', type: 'string', default: "'bi-plus-circle'" },
        { name: 'tabsCloseIcon', description: '关闭图标的类名', type: 'string', default: "'bi-x-lg'" },
        { name: 'tabsLazyLoad', description: '是否启用懒加载，仅在首次选中时加载内容', type: 'boolean', default: 'false' },
        { name: 'tabsDestroyInactive', description: '是否销毁未选中的标签页，为true时未选中的标签不渲染', type: 'boolean', default: 'false' }
      ]
    },
    {
      title: 'Tabs 组件事件',
      items: [
        { name: 'tabsSelectedIndexChange', description: '选中的标签页变化时触发', type: 'EventEmitter<number>' },
        { name: 'tabsTabClick', description: '点击标签时触发', type: 'EventEmitter<{ index: number, tab: TabItem }>' },
        { name: 'tabsClose', description: '点击关闭按钮时触发', type: 'EventEmitter<{ index: number, tab: TabItem }>' },
        { name: 'tabsAdd', description: '点击新增按钮时触发', type: 'EventEmitter<void>' },
        { name: 'tabsSelectChange', description: '选中的标签页变化时触发', type: 'EventEmitter<TabItem>' }
      ]
    },
    {
      title: 'Tab 组件属性',
      items: [
        { name: 'tabTitle', description: '标签页标题', type: 'string', default: "''" },
        { name: 'tabDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'tabKey', description: '标签页唯一标识', type: 'string', default: "''" },
        { name: 'tabTitleTemplate', description: '自定义标题模板', type: 'TemplateRef<any>', default: 'null' }
      ]
    },
    {
      title: 'TabItem 接口',
      items: [
        { name: 'key', description: '唯一标识', type: 'string', default: '-' },
        { name: 'title', description: '标签页标题', type: 'string', default: '-' },
        { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'content', description: '标签页内容模板', type: 'TemplateRef<any>', default: '-' },
        { name: 'customTitle', description: '自定义标题模板', type: 'TemplateRef<any>', default: '-' }
      ]
    }
  ];

  // 代码示例
  basicSource = `
import { Component } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: \`
    <lib-tabs [tabsSelectedIndex]="0">
      <lib-tab tabTitle="标签页1">内容1</lib-tab>
      <lib-tab tabTitle="标签页2">内容2</lib-tab>
      <lib-tab tabTitle="标签页3">内容3</lib-tab>
    </lib-tabs>
  \`
})
export class BasicDemoComponent {}
  `;

  positionSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabComponent, TabsComponent, SegmentedComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-position-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent, SegmentedComponent, FormsModule],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented
        [segmentedOptions]="positionOptions"
        [(ngModel)]="tabPosition">
      </lib-segmented>
    </div>
    <lib-tabs [tabsTabPosition]="tabPosition">
      <lib-tab tabTitle="标签页1">内容1</lib-tab>
      <lib-tab tabTitle="标签页2">内容2</lib-tab>
      <lib-tab tabTitle="标签页3">内容3</lib-tab>
    </lib-tabs>
  \`
})
export class PositionDemoComponent {
  tabPosition: 'top' | 'bottom' = 'top';
  positionOptions = [
    { value: 'top', label: '顶部' },
    { value: 'bottom', label: '底部' }
  ];
}
  `;

  cardSource = `
import { Component } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: \`
    <lib-tabs [tabsTabType]="'card'">
      <lib-tab tabTitle="标签页1">内容1</lib-tab>
      <lib-tab tabTitle="标签页2">内容2</lib-tab>
      <lib-tab tabTitle="标签页3">内容3</lib-tab>
    </lib-tabs>
  \`
})
export class CardDemoComponent {}
  `;

  disabledSource = `
import { Component } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-disabled-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: \`
    <lib-tabs>
      <lib-tab tabTitle="标签页1">内容1</lib-tab>
      <lib-tab tabTitle="标签页2" [tabDisabled]="true">内容2</lib-tab>
      <lib-tab tabTitle="标签页3">内容3</lib-tab>
    </lib-tabs>
  \`
})
export class DisabledDemoComponent {}
  `;

  centeredSource = `
import { Component } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-centered-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: \`
    <lib-tabs [tabsTabAlign]="'center'">
      <lib-tab tabTitle="标签页1">内容1</lib-tab>
      <lib-tab tabTitle="标签页2">内容2</lib-tab>
      <lib-tab tabTitle="标签页3">内容3</lib-tab>
    </lib-tabs>
  \`
})
export class CenteredDemoComponent {}
  `;

  closableSource = `
import { Component } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-closable-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent, CommonModule],
  template: \`
    <lib-tabs [tabsClosable]="true" (tabsClose)="closeTab($event)" [tabsTabHideAdd]="false" (tabsAdd)="addTab()">
      <lib-tab 
        *ngFor="let tab of tabs; let i = index" 
        [tabTitle]="tab.title" 
        [tabKey]="tab.key">
        {{ tab.content }}
      </lib-tab>
    </lib-tabs>
  \`
})
export class ClosableDemoComponent {
  tabs = [
    { key: 'tab1', title: '标签页1', content: '标签页1的内容' },
    { key: 'tab2', title: '标签页2', content: '标签页2的内容' }
  ];

  closeTab(event: {index: number, tab: any}): void {
    this.tabs.splice(event.index, 1);
  }

  addTab(): void {
    const tabIndex = this.tabs.length + 1;
    this.tabs.push({
      key: \`tab\${tabIndex}\`,
      title: \`标签页\${tabIndex}\`,
      content: \`这是动态添加的标签页\${tabIndex}的内容\`
    });
  }
}
  `;

  customSource = `
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-custom-title-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: \`
    <lib-tabs>
      <lib-tab [tabTitleTemplate]="customTitle1">
        自定义标题模板内容1
        <ng-template #customTitle1>
          <span style="color: red">自定义</span>标题1
        </ng-template>
      </lib-tab>
      <lib-tab [tabTitleTemplate]="customTitle2">
        自定义标题模板内容2
        <ng-template #customTitle2>
          <span style="color: blue">自定义</span>标题2
        </ng-template>
      </lib-tab>
    </lib-tabs>
  \`
})
export class CustomTitleDemoComponent {}
  `;
  
  // 懒加载示例代码
  lazyLoadSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent, TabsComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-lazy-load-demo',
  standalone: true,
  imports: [CommonModule, TabsComponent, TabComponent],
  template: \`
    <p class="load-status">当前已加载的标签页: {{ loadedTabsInfo }}</p>
    <lib-tabs [tabsLazyLoad]="true" (tabsSelectedIndexChange)="onTabChange($event)">
      <lib-tab tabTitle="标签页1">
        <div class="tab-content">
          <p>标签页1的内容</p>
          <p><b>初始化时间:</b> {{ getTabInitTime(0) }}</p>
        </div>
      </lib-tab>
      <lib-tab tabTitle="标签页2">
        <div class="tab-content">
          <p>标签页2的内容</p>
          <p><b>初始化时间:</b> {{ getTabInitTime(1) }}</p>
        </div>
      </lib-tab>
      <lib-tab tabTitle="标签页3">
        <div class="tab-content">
          <p>标签页3的内容</p>
          <p><b>初始化时间:</b> {{ getTabInitTime(2) }}</p>
        </div>
      </lib-tab>
    </lib-tabs>
  \`,
  styles: [\`
    .load-status {
      margin-bottom: 16px;
      padding: 8px 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .tab-content {
      padding: 16px;
      background-color: #fafafa;
      border-radius: 4px;
    }
  \`]
})
export class LazyLoadDemoComponent {
  // 记录已加载的标签页
  lazyLoadedTabs = new Set<number>([0]); // 默认加载第一个标签页
  tabInitTimes: { [key: number]: string } = {
    0: this.getCurrentTime() // 默认第一个标签页初始化时间
  };
  
  // 获取当前已加载标签页的信息
  get loadedTabsInfo(): string {
    return Array.from(this.lazyLoadedTabs)
      .map(index => \`标签页\${index + 1}\`)
      .join(', ');
  }
  
  // 标签页切换时更新加载状态
  onTabChange(index: number): void {
    if (!this.lazyLoadedTabs.has(index)) {
      this.lazyLoadedTabs.add(index);
      this.tabInitTimes[index] = this.getCurrentTime();
    }
  }
  
  // 获取标签页初始化时间
  getTabInitTime(index: number): string {
    return this.tabInitTimes[index] || '未初始化';
  }
  
  // 获取当前时间
  private getCurrentTime(): string {
    const now = new Date();
    return \`\${now.getHours()}:\${now.getMinutes()}:\${now.getSeconds()}.\${now.getMilliseconds()}\`;
  }
}
  `;
  
  // 销毁非活动标签示例代码
  destroyInactiveSource = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabComponent, TabsComponent, SegmentedComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-destroy-inactive-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TabsComponent, TabComponent, SegmentedComponent],
  template: \`
    <div style="margin-bottom: 16px;">
      <lib-segmented 
        [segmentedOptions]="destroyOptions" 
        [(ngModel)]="destroyInactive"
        (ngModelChange)="onDestroyModeChange()">
      </lib-segmented>
    </div>
    <p class="load-status">当前已渲染的标签页: {{ currentTabInfo }}</p>
    <lib-tabs [tabsDestroyInactive]="destroyInactive" (tabsSelectedIndexChange)="onTabChange($event)">
      <lib-tab tabTitle="标签页1">
        <div class="tab-content">
          <p>标签页1的内容</p>
          <p><b>最近渲染时间:</b> {{ getTabRenderTime(0) }}</p>
        </div>
      </lib-tab>
      <lib-tab tabTitle="标签页2">
        <div class="tab-content">
          <p>标签页2的内容</p>
          <p><b>最近渲染时间:</b> {{ getTabRenderTime(1) }}</p>
        </div>
      </lib-tab>
      <lib-tab tabTitle="标签页3">
        <div class="tab-content">
          <p>标签页3的内容</p>
          <p><b>最近渲染时间:</b> {{ getTabRenderTime(2) }}</p>
        </div>
      </lib-tab>
    </lib-tabs>
  \`,
  styles: [\`
    .load-status {
      margin-bottom: 16px;
      padding: 8px 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .tab-content {
      padding: 16px;
      background-color: #fafafa;
      border-radius: 4px;
    }
  \`]
})
export class DestroyInactiveDemoComponent {
  destroyInactive = false;
  destroyOptions = [
    { value: false, label: '保留非活动标签' },
    { value: true, label: '销毁非活动标签' }
  ];
  currentActiveTab = 0;
  tabRenderTimes: { [key: number]: string } = {
    0: this.getCurrentTime() // 默认第一个标签页渲染时间
  };
  
  // 获取当前渲染的标签页信息
  get currentTabInfo(): string {
    if (this.destroyInactive) {
      return \`仅标签页\${this.currentActiveTab + 1}\`;
    } else {
      return '所有标签页';
    }
  }
  
  // 切换销毁模式时重置渲染时间
  onDestroyModeChange(): void {
    if (!this.destroyInactive) {
      // 如果切换到保留模式，更新所有标签页的渲染时间
      const currentTime = this.getCurrentTime();
      for (let i = 0; i < 3; i++) {
        this.tabRenderTimes[i] = currentTime;
      }
    } else {
      // 如果切换到销毁模式，只保留当前标签页的渲染时间
      this.tabRenderTimes = {
        [this.currentActiveTab]: this.getCurrentTime()
      };
    }
  }
  
  // 标签页切换时更新渲染时间
  onTabChange(index: number): void {
    this.currentActiveTab = index;
    this.tabRenderTimes[index] = this.getCurrentTime();
  }
  
  // 获取标签页渲染时间
  getTabRenderTime(index: number): string {
    return this.tabRenderTimes[index] || '未渲染';
  }
  
  // 获取当前时间
  private getCurrentTime(): string {
    const now = new Date();
    return \`\${now.getHours()}:\${now.getMinutes()}:\${now.getSeconds()}.\${now.getMilliseconds()}\`;
  }
}
  `;

  closeTab(event: { index: number }): void {
    this.dynamicTabs.splice(event.index, 1);
  }

  addTab(): void {
    const key = `tab${this.tabIndex}`;
    this.dynamicTabs.push({
      key,
      title: `标签页${this.tabIndex}`,
      content: `这是动态添加的标签页${this.tabIndex}的内容`
    });
    this.tabIndex++;
  }
  
  // 懒加载示例方法
  onLazyTabChange(index: number): void {
    if (!this.lazyLoadedTabs.has(index)) {
      this.lazyLoadedTabs.add(index);
      this.tabInitTimes[index] = this.getCurrentTime();
    }
  }
  
  getTabInitTime(index: number): string {
    return this.tabInitTimes[index] || '未初始化';
  }
  
  get loadedTabsInfo(): string {
    return Array.from(this.lazyLoadedTabs)
      .map(index => `标签页${index + 1}`)
      .join(', ');
  }
  
  // 销毁非活动标签示例方法
  onDestroyTabChange(index: number): void {
    this.currentActiveTab = index;
    this.destroyTabRenderTimes[index] = this.getCurrentTime();
  }
  
  getDestroyTabRenderTime(index: number): string {
    return this.destroyTabRenderTimes[index] || '未渲染';
  }
  
  get currentTabInfo(): string {
    if (this.destroyInactive) {
      return `仅标签页${this.currentActiveTab + 1}`;
    } else {
      return '所有标签页';
    }
  }
  
  onDestroyModeChange(): void {
    if (!this.destroyInactive) {
      // 如果切换到保留模式，更新所有标签页的渲染时间
      const currentTime = this.getCurrentTime();
      for (let i = 0; i < 3; i++) {
        this.destroyTabRenderTimes[i] = currentTime;
      }
    } else {
      // 如果切换到销毁模式，只保留当前标签页的渲染时间
      this.destroyTabRenderTimes = {
        [this.currentActiveTab]: this.getCurrentTime()
      };
    }
  }
  
  // 通用方法
  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  }
}
