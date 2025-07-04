import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent, ButtonComponent } from '@project';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
@Component({
  selector: 'app-doc-select',
  standalone: true,
  imports: [
    CommonModule, 
    SelectComponent, 
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
  ],
  templateUrl: './doc-select.component.html',
  styleUrl: './doc-select.component.less'
})
export class DocSelectComponent implements OnInit {
  // 基本用法
  selectedValue: any = 2;
  
  // 三种大小
  selectedSizes = {
    large: null,
    default: null,
    small: null
  };
  
  // 多选模式
  multipleSelected: string[] = [];
  
  // 标签模式
  tagsSelected: string[] = [];
  
  // 分组
  groupSelected: string | null = null;
  
  // 搜索
  searchSelected: string = '';
  
  // 远程搜索
  remoteSelected: string = '';
  remoteLoading: boolean = false;
  remoteOptions: any[] = [];
  
  // 隐藏已选择选项
  hideSelected: string[] = [];
  
  // 虚拟滚动
  virtualScrollSelected: string = '';
  
  // 无边框
  borderlessSelected: string = '';
  
  // 状态
  statusValues = {
    default: '',
    error: '',
    warning: ''
  };
  
  // 最大选择数量
  maxCountSelected: string[] = [];
  
  // 底部操作栏
  bottomBarSelected: any[] = [];
  
  // 基础选项
  options = [
    { label: '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 },
    { label: '选项4', value: 4 },
    { label: '选项5', value: 5 },
    { label: '选项6', value: 6 }
  ];
  
  // 分组选项
  groupOptions = [
    { label: '水果', value: 'fruit1', group: '水果类' },
    { label: '苹果', value: 'apple', group: '水果类' },
    { label: '香蕉', value: 'banana', group: '水果类' },
    { label: '橙子', value: 'orange', group: '水果类' },
    { label: '蔬菜', value: 'vegetable1', group: '蔬菜类' },
    { label: '西红柿', value: 'tomato', group: '蔬菜类' },
    { label: '黄瓜', value: 'cucumber', group: '蔬菜类' },
    { label: '茄子', value: 'eggplant', group: '蔬菜类' }
  ];
  
  
  // 大量选项用于测试搜索
  largeOptions: any[] = [];
  
  // 超大量选项用于虚拟滚动
  hugeOptions: any[] = [];
  
  // 禁用选择框
  disabledValue: string = '';
  disabledMultipleValue: string[] = [];
  
  // 选项禁用
  disabledOptionValue: string = '';
  disabledOptions = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2', disabled: true },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4', disabled: true },
    { label: '选项5', value: 'option5' }
  ];
  
  // 自定义选项模板
  customOptionTemplateValue: string = '';
  customLabelTemplateValue: string = '';
  customOptions = [
    { label: '苹果', value: 'apple', icon: 'bi-apple', description: '水果' },
    { label: '图书', value: 'book', icon: 'bi-book', description: '阅读' },
    { label: '音乐', value: 'music', icon: 'bi-music-note', description: '娱乐' },
    { label: '相机', value: 'camera', icon: 'bi-camera', description: '摄影' },
    { label: '汽车', value: 'car', icon: 'bi-car-front', description: '交通' }
  ];
  
  ngOnInit(): void {
    // 初始化大量选项
    this.largeOptions = Array.from({ length: 50 }, (_, i) => ({
      label: `选项 ${i + 1}`,
      value: `option-${i + 1}`
    }));
    
    // 初始化超大量选项
    this.hugeOptions = Array.from({ length: 1000 }, (_, i) => ({
      label: `选项 ${i + 1}`,
      value: `huge-option-${i + 1}`,
      group: `组 ${Math.floor(i / 100)}`
    }));
  }
  
  // 远程搜索方法
  onRemoteSearch = (value: string): Promise<any[]> => {
    this.remoteLoading = true;
    
    // 模拟远程搜索请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.largeOptions.filter(option => 
          option.label.toLowerCase().includes(value.toLowerCase())
        );
        this.remoteLoading = false;
        resolve(result);
      }, 800); // 模拟网络延迟
    });
  };
  
  // API 文档数据
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'selectMode', description: '选择模式', type: "'single' | 'multiple'", default: "'single'" },
        { name: 'selectSize', description: '选择框大小', type: "'large' | 'default' | 'small'", default: "'default'" },
        { name: 'selectPlaceHolder', description: '选择框占位文本', type: 'string', default: "'请选择'" },
        { name: 'selectAllowClear', description: '是否显示清除按钮', type: 'boolean', default: 'true' },
        { name: 'selectSearch', description: '是否显示搜索框', type: 'boolean', default: 'true' },
        { name: 'selectOption', description: '选项数据源', type: 'Array<any>', default: '[]' },
        { name: 'selectOptionKey', description: '选项显示的文本字段', type: 'string', default: "'label'" },
        { name: 'selectOptionValue', description: '选项的值字段', type: 'string', default: "'value'" },
        { name: 'selectPanelMaxHeight', description: '下拉面板的最大高度', type: 'number', default: '400' },
        { name: 'selectTagMode', description: '是否启用标签模式', type: 'boolean', default: 'false' },
        { name: 'selectBorderless', description: '是否无边框', type: 'boolean', default: 'false' },
        { name: 'selectStatus', description: '设置校验状态', type: "'error' | 'warning' | null", default: 'null' },
        { name: 'selectMaxMultipleCount', description: '多选模式下最多选择的数量', type: 'number', default: 'Infinity' },
        { name: 'selectHideSelected', description: '是否隐藏已选择的选项', type: 'boolean', default: 'false' },
        { name: 'selectLoading', description: '是否显示加载图标', type: 'boolean', default: 'false' },
        { name: 'selectSearchFn', description: '自定义搜索函数', type: '(value: string) => Promise<any[]>', default: 'null' },
        { name: 'selectMinWidth', description: '选择框的最小宽度', type: 'string', default: "'120px'" },
        { name: 'selectDisabled', description: '是否禁用选择框', type: 'boolean', default: 'false' },
        { name: 'selectOptionDisabledKey', description: '选项禁用属性名', type: 'string', default: "'disabled'" },
        { name: 'selectBottomBar', description: '底部操作栏模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'selectOptionTemplate', description: '自定义选项模板', type: 'TemplateRef<any>', default: 'null' },
        { name: 'selectOptionLabelTemplate', description: '自定义选中内容模板', type: 'TemplateRef<any>', default: 'null' }
      ]
    }
  ];
  
  // 示例代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="selectedValue"
      [selectOption]="options"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="请选择">
    </lib-select>
    <div *ngIf="selectedValue" class="example-value">
      当前选择: {{ selectedValue }}
    </div>
  \`
})
export class BasicDemoComponent {
  selectedValue: string = '';
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];
}`;

  // 不同大小
  sizeSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-size-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-select
        selectSize="large"
        [(ngModel)]="selectedSizes.large"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="大号选择框">
      </lib-select>
      
      <lib-select
        [(ngModel)]="selectedSizes.default"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="默认大小">
      </lib-select>
      
      <lib-select
        selectSize="small"
        [(ngModel)]="selectedSizes.small"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="小号选择框">
      </lib-select>
    </div>
  \`
})
export class SizeDemoComponent {
  selectedSizes = {
    large: '',
    default: '',
    small: ''
  };
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' }
  ];
}`;

  // 多选模式
  multipleSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-multiple-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      selectMode="multiple"
      [(ngModel)]="multipleSelected"
      [selectOption]="options"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="请选择多个选项">
    </lib-select>
    <div *ngIf="multipleSelected && multipleSelected.length > 0" class="example-value">
      当前选择: {{ multipleSelected.join(', ') }}
    </div>
  \`
})
export class MultipleDemoComponent {
  multipleSelected: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];
}`;

  // 标签模式
  tagsSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-tags-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      selectMode="multiple"
      [selectTagMode]="true"
      [(ngModel)]="tagsSelected"
      [selectOption]="options"
      selectSize="small"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="可输入自定义标签">
    </lib-select>
    <div *ngIf="tagsSelected && tagsSelected.length > 0" class="example-value">
      当前选择: {{ tagsSelected.join(', ') }}
    </div>
    <div class="tip">
      提示: 可以尝试输入"露西,杰克"并按回车键
    </div>
  \`
})
export class TagsDemoComponent {
  tagsSelected: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' }
  ];
}`;

  // 分组
  groupSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-group-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="groupSelected"
      [selectOption]="groupOptions"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="请选择分组选项">
    </lib-select>
    <div *ngIf="groupSelected" class="example-value">
      当前选择: {{ groupSelected }}
    </div>
  \`
})
export class GroupDemoComponent {
  groupSelected: string = '';
  
  groupOptions = [
    { label: '苹果', value: 'apple', group: '水果类' },
    { label: '香蕉', value: 'banana', group: '水果类' },
    { label: '橙子', value: 'orange', group: '水果类' },
    { label: '西红柿', value: 'tomato', group: '蔬菜类' },
    { label: '黄瓜', value: 'cucumber', group: '蔬菜类' },
    { label: '茄子', value: 'eggplant', group: '蔬菜类' }
  ];
}`;

  // 搜索功能
  searchSource = `
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="searchSelected"
      [selectSearch]="true"
      [selectOption]="largeOptions"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="支持搜索的选择框">
    </lib-select>
    <div *ngIf="searchSelected" class="example-value">
      当前选择: {{ searchSelected }}
    </div>
  \`
})
export class SearchDemoComponent implements OnInit {
  searchSelected: string = '';
  largeOptions: any[] = [];
  
  ngOnInit(): void {
    // 初始化大量选项
    this.largeOptions = Array.from({ length: 50 }, (_, i) => ({
      label: \`选项 \${i + 1}\`,
      value: \`option-\${i + 1}\`
    }));
  }
}`;

  // 远程搜索
  remoteSearchSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-remote-search-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="remoteSelected"
      [selectSearch]="true"
      [selectLoading]="remoteLoading"
      [selectSearchFn]="onRemoteSearch"
      [selectOption]="remoteOptions"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="输入关键字搜索">
    </lib-select>
    <div *ngIf="remoteSelected" class="example-value">
      当前选择: {{ remoteSelected }}
    </div>
  \`
})
export class RemoteSearchDemoComponent {
  remoteSelected: string = '';
  remoteLoading: boolean = false;
  remoteOptions: any[] = [];
  
  // 创建模拟数据源
  mockDataSource = Array.from({ length: 100 }, (_, i) => ({
    label: \`选项 \${i + 1}\`,
    value: \`option-\${i + 1}\`
  }));
  
  // 远程搜索方法
  onRemoteSearch = (value: string): Promise<any[]> => {
    this.remoteLoading = true;
    
    // 模拟远程搜索请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.mockDataSource.filter(option => 
          option.label.toLowerCase().includes(value.toLowerCase())
        );
        this.remoteLoading = false;
        resolve(result);
      }, 800); // 模拟网络延迟
    });
  };
}`;

  // 隐藏已选择选项
  hideSelectedSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-hide-selected-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      selectMode="multiple"
      [selectHideSelected]="true"
      [(ngModel)]="hideSelected"
      [selectOption]="options"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="已选项不会显示在下拉列表中">
    </lib-select>
    <div *ngIf="hideSelected && hideSelected.length > 0" class="example-value">
      当前选择: {{ hideSelected.join(', ') }}
    </div>
  \`
})
export class HideSelectedDemoComponent {
  hideSelected: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];
}`;

  // 虚拟滚动
  virtualScrollSource = `
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-virtual-scroll-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="virtualScrollSelected"
      [selectOption]="hugeOptions"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="包含1000个选项">
    </lib-select>
    <div *ngIf="virtualScrollSelected" class="example-value">
      当前选择: {{ virtualScrollSelected }}
    </div>
  \`
})
export class VirtualScrollDemoComponent implements OnInit {
  virtualScrollSelected: string = '';
  hugeOptions: any[] = [];
  
  ngOnInit(): void {
    // 初始化1000个选项
    this.hugeOptions = Array.from({ length: 1000 }, (_, i) => ({
      label: \`选项 \${i + 1}\`,
      value: \`huge-option-\${i + 1}\`
    }));
  }
}`;

  // 无边框
  borderlessSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-borderless-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <div style="padding: 16px; background-color: #f5f5f5;">
      <lib-select
        [selectBorderless]="true"
        [(ngModel)]="borderlessSelected"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="无边框选择框">
      </lib-select>
    </div>
  \`
})
export class BorderlessDemoComponent {
  borderlessSelected: string = '';
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' }
  ];
}`;

  // 状态
  statusSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-status-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-select
        [(ngModel)]="statusValues.default"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="默认状态">
      </lib-select>
      
      <lib-select
        [(ngModel)]="statusValues.error"
        [selectStatus]="'error'"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="错误状态">
      </lib-select>
      
      <lib-select
        [(ngModel)]="statusValues.warning"
        [selectStatus]="'warning'"
        [selectOption]="options"
        selectOptionKey="label"
        selectOptionValue="value"
        selectPlaceHolder="警告状态">
      </lib-select>
    </div>
  \`
})
export class StatusDemoComponent {
  statusValues = {
    default: '',
    error: '',
    warning: ''
  };
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' }
  ];
}`;

  // 最大选项数
  maxCountSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-max-count-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      selectMode="multiple"
      [selectMaxMultipleCount]="3"
      [(ngModel)]="maxCountSelected"
      [selectOption]="options"
      selectOptionKey="label"
      selectOptionValue="value"
      selectPlaceHolder="最多选择3项">
    </lib-select>
    <div *ngIf="maxCountSelected && maxCountSelected.length > 0" class="example-value">
      当前选择: {{ maxCountSelected.join(', ') }} (已选择 {{ maxCountSelected.length }}/3)
    </div>
  \`
})
export class MaxCountDemoComponent {
  maxCountSelected: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' },
    { label: '选项6', value: 'option6' }
  ];
}`;

  // 禁用选择框示例代码
  disabledSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-disabled-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-select
        [(ngModel)]="disabledValue"
        [selectOption]="options"
        [selectDisabled]="true"
        selectPlaceHolder="禁用状态的选择框">
      </lib-select>
      
      <lib-select
        selectMode="multiple"
        [(ngModel)]="disabledMultipleValue"
        [selectOption]="options"
        [selectDisabled]="true"
        selectPlaceHolder="禁用状态的多选框">
      </lib-select>
    </div>
  \`
})
export class DisabledDemoComponent {
  disabledValue: string = '';
  disabledMultipleValue: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' }
  ];
}`;

  // 选项禁用示例代码
  disabledOptionSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';

@Component({
  selector: 'app-disabled-option-demo',
  standalone: true,
  imports: [FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="disabledOptionValue"
      [selectOption]="disabledOptions"
      selectPlaceHolder="包含禁用选项的选择框">
    </lib-select>
    <div *ngIf="disabledOptionValue" class="example-value">
      当前选择: {{ disabledOptionValue }}
    </div>
  \`
})
export class DisabledOptionDemoComponent {
  disabledOptionValue: string = '';
  
  disabledOptions = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2', disabled: true },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4', disabled: true },
    { label: '选项5', value: 'option5' }
  ];
}`;

  // 自定义选项模板示例代码
  customOptionTemplateSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-option-template-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="customOptionTemplateValue"
      [selectOption]="customOptions"
      [optionTemplate]="customOptionTpl"
      selectPlaceHolder="自定义选项显示内容">
    </lib-select>
    
    <ng-template #customOptionTpl let-option>
      <div class="custom-option">
        <i class="bi" [ngClass]="option.icon"></i>
        <span>{{option.label}}</span>
        <span class="option-desc" *ngIf="option.description">{{option.description}}</span>
      </div>
    </ng-template>
    
    <div *ngIf="customOptionTemplateValue" class="example-value">
      当前选择: {{ customOptionTemplateValue }}
    </div>
  \`,
  styles: [\`
    .custom-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .option-desc {
      font-size: 12px;
      color: #999;
      margin-left: auto;
    }
  \`]
})
export class CustomOptionTemplateDemoComponent {
  customOptionTemplateValue: string = '';
  
  customOptions = [
    { label: '苹果', value: 'apple', icon: 'bi-apple', description: '水果' },
    { label: '图书', value: 'book', icon: 'bi-book', description: '阅读' },
    { label: '音乐', value: 'music', icon: 'bi-music-note', description: '娱乐' },
    { label: '相机', value: 'camera', icon: 'bi-camera', description: '摄影' },
    { label: '汽车', value: 'car', icon: 'bi-car-front', description: '交通' }
  ];
}`;

  // 自定义选中内容模板示例代码
  customLabelTemplateSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-label-template-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: \`
    <lib-select
      [(ngModel)]="customLabelTemplateValue"
      [selectOption]="customOptions"
      [optionLabelTemplate]="customLabelTpl"
      selectPlaceHolder="自定义选中内容显示">
    </lib-select>
    
    <ng-template #customLabelTpl let-option>
      <div class="custom-label">
        <i class="bi" [ngClass]="option.icon"></i>
        <span>{{option.label}}</span>
      </div>
    </ng-template>
    
    <div *ngIf="customLabelTemplateValue" class="example-value">
      当前选择: {{ customLabelTemplateValue }}
    </div>
  \`,
  styles: [\`
    .custom-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  \`]
})
export class CustomLabelTemplateDemoComponent {
  customLabelTemplateValue: string = '';
  
  customOptions = [
    { label: '苹果', value: 'apple', icon: 'bi-apple', description: '水果' },
    { label: '图书', value: 'book', icon: 'bi-book', description: '阅读' },
    { label: '音乐', value: 'music', icon: 'bi-music-note', description: '娱乐' },
    { label: '相机', value: 'camera', icon: 'bi-camera', description: '摄影' },
    { label: '汽车', value: 'car', icon: 'bi-car-front', description: '交通' }
  ];
}`;

// 底部操作栏示例代码
bottomBarSource = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '@ng-cjf-lib';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-bar-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: \`
    <lib-select
      selectMode="multiple"
      [(ngModel)]="bottomBarSelected"
      [selectOption]="options"
      selectOptionKey="label"
      selectOptionValue="value"
      [selectBottomBar]="bottomBarTpl"
      selectPlaceHolder="带底部操作栏的选择器">
    </lib-select>
    
    <ng-template #bottomBarTpl>
      <div style="display: flex; justify-content: space-between; padding: 8px 12px; border-top: 1px solid #f0f0f0;">
        <a style="color: #1677ff; font-size: 12px; cursor: pointer;" (click)="selectAll()">全选</a>
        <a style="color: #1677ff; font-size: 12px; cursor: pointer;" (click)="clearAll()">清空</a>
      </div>
    </ng-template>
    
    <div *ngIf="bottomBarSelected && bottomBarSelected.length > 0" class="example-value">
      当前选择: {{ bottomBarSelected.join(', ') }}
    </div>
  \`
})
export class BottomBarDemoComponent {
  bottomBarSelected: string[] = [];
  
  options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
    { label: '选项4', value: 'option4' },
    { label: '选项5', value: 'option5' }
  ];
  
  selectAll() {
    this.bottomBarSelected = this.options.map(item => item.value);
  }
  
  clearAll() {
    this.bottomBarSelected = [];
  }
}`;

  // 获取对象键的辅助方法，用于模板中的 *ngFor
  getObjectKeys(obj: Object): string[] {
    return Object.keys(obj);
  }

  selectAll() {
    this.bottomBarSelected = this.options.map(item => item.value);
  }
  
  clearAll() {
    this.bottomBarSelected = [];
  }
}
