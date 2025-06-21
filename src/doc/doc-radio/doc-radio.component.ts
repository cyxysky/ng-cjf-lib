import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { RadioComponent } from '@project';

@Component({
  selector: 'app-doc-radio',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    RadioComponent
],
  templateUrl: './doc-radio.component.html',
  styleUrl: './doc-radio.component.less'
})
export class DocRadioComponent {
  // 基本用法示例
  basicValue: any = 1;
  basicOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];

  // 垂直排列示例
  verticalValue: any = 1;

  // 自定义颜色示例
  colorValue: any = 2;

  // 禁用示例
  disabledValue: any = 1;
  disabledOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3, disabled: true }
  ];

  // 事件监听示例
  eventValue: any = 1;
  lastChangedValue: any = null;
  
  onValueChange(value: any): void {
    this.lastChangedValue = value;
    console.log('值已更改为:', value);
  }

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'radioOptions', description: '选项列表', type: 'RadioOption[]', default: '[]' },
        { name: 'disabled', description: '是否禁用整个组件', type: 'boolean', default: 'false' },
        { name: 'radioDirection', description: '排列方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { name: 'radioColor', description: '单选框选中状态的颜色', type: 'string', default: '#1890ff' },
        { name: 'radioLabelTemplate', description: '选项标签模板', type: 'TemplateRef<any>', default: 'null' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '选中值变化时的回调', type: 'EventEmitter<any>' }
      ]
    },
    {
      title: 'RadioOption接口',
      items: [
        { name: 'value', description: '选项值', type: 'any', default: '-' },
        { name: 'label', description: '选项标签', type: 'string', default: '-' },
        { name: 'disabled', description: '是否禁用该选项', type: 'boolean', default: 'false' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { RadioComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: \`
    <lib-radio 
      [(ngModel)]="value" 
      [radioOptions]="options">
    </lib-radio>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: any = 1;
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 垂直排列
  verticalSource = `
import { Component } from '@angular/core';
import { RadioComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: \`
    <lib-radio 
      [(ngModel)]="value" 
      [radioOptions]="options"
      radioDirection="vertical">
    </lib-radio>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: any = 1;
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 自定义颜色
  colorSource = `
import { Component } from '@angular/core';
import { RadioComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: \`
    <lib-radio 
      [(ngModel)]="colorValue" 
      [radioOptions]="basicOptions"
      [radioColor]="'#ff4d4f'">
    </lib-radio>
    <lib-radio 
      [(ngModel)]="colorValue" 
      [radioOptions]="basicOptions"
      [radioLabelTemplate]="customLabelTemplate">
    </lib-radio>
    <ng-template #customLabelTemplate let-option>
      <span class="custom-label">自定义 - {{ option.label }}</span>
    </ng-template>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: any = 2;
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 禁用
  disabledSource = `
import { Component } from '@angular/core';
import { RadioComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: \`
    <lib-radio 
      [(ngModel)]="value" 
      [radioOptions]="options">
    </lib-radio>
    <p>当前值: {{ value }}</p>
  \`,
})
export class ExampleComponent {
  value: any = 1;
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3, disabled: true }
  ];
}`;

  // 事件监听
  eventSource = `
import { Component } from '@angular/core';
import { RadioComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [RadioComponent, FormsModule],
  template: \`
    <lib-radio 
      [(ngModel)]="value" 
      [radioOptions]="options"
      (valueChange)="onValueChange($event)">
    </lib-radio>
    <p>当前值: {{ value }}</p>
    <p>上次改变: {{ lastChangedValue }}</p>
  \`,
})
export class ExampleComponent {
  value: any = 1;
  lastChangedValue: any = null;
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
  
  onValueChange(value: any): void {
    this.lastChangedValue = value;
    console.log('值已更改为:', value);
  }
}`;
}
