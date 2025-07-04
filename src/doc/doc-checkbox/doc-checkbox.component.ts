import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { CheckboxComponent } from '@project';
import { ProjectModule } from "../../../projects/project/src/lib/project.module";

@Component({
  selector: 'app-doc-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    CheckboxComponent,
    ProjectModule
  ],
  templateUrl: './doc-checkbox.component.html',
  styleUrl: './doc-checkbox.component.less'
})
export class DocCheckboxComponent {
  // 基本用法示例
  basicValues: any[] = [1];
  basicOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2,  indeterminate: true  },
    { label: '选项3', value: 3 }
  ];

  // 垂直排列示例
  verticalValues: any[] = [1];

  // 自定义颜色示例
  colorValues: any[] = [1, 2];

  // 禁用示例
  disabledValues: any[] = [1];
  disabledOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3, disabled: true }
  ];
  componentDisabled = false;

  // 半选状态示例
  indeterminateValues: any[] = [1];
  indeterminateOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '半选状态', value: 3, indeterminate: true },
    { label: '选项4', value: 4 }
  ];

  // 自定义模板示例
  templateValues: any[] = [1, 3];

  // 添加单选模式示例的数据
  singleValue: boolean = true;

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'checkboxOptions', description: '选项列表', type: 'CheckboxOption[]', default: '[]' },
        { name: 'disabled', description: '是否禁用整个组件', type: 'boolean', default: 'false' },
        { name: 'checkboxDirection', description: '排列方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { name: 'checkboxColor', description: '复选框选中状态的颜色', type: 'string', default: '#1890ff' },
        { name: 'checkboxLabelTemplate', description: '自定义标签模板', type: 'TemplateRef<any>', default: '-' },
        { name: 'checkboxIndeterminate', description: '是否为半选状态', type: 'boolean', default: 'false' },
        { name: 'checkboxSingle', description: '是否为单选模式', type: 'boolean', default: 'false' },
        { name: 'checkboxSingleLabel', description: '单选模式下的标签文本或模板', type: 'string | TemplateRef<any>', default: '""' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '选中值变化时的回调', type: 'EventEmitter<any[]>' }
      ]
    },
    {
      title: 'CheckboxOption接口',
      items: [
        { name: 'value', description: '选项值', type: 'any', default: '-' },
        { name: 'label', description: '选项标签', type: 'string', default: '-' },
        { name: 'disabled', description: '是否禁用该选项', type: 'boolean', default: 'false' },
        { name: 'indeterminate', description: '是否为半选状态', type: 'boolean', default: 'false' }
      ]
    }
  ];

  // 演示代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options">
    </lib-checkbox>
    <p>当前值: {{ values | json }}</p>
  \`,
})
export class CheckboxComponent {
  values: any[] = [1];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 垂直排列
  verticalSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options"
      checkboxDirection="vertical">
    </lib-checkbox>
    <p>当前值: {{ values | json }}</p>
  \`,
})
export class CheckboxComponent {
  values: any[] = [1];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 自定义颜色
  colorSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options"
      checkboxColor="#ff4d4f">
    </lib-checkbox>
    <p>当前值: {{ values | json }}</p>
  \`,
})
export class CheckboxComponent {
  values: any[] = [1, 2];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 禁用
  disabledSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options">
    </lib-checkbox>
    <p>当前值: {{ values | json }}</p>
  \`,
})
export class CheckboxComponent {
  values: any[] = [1];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3, disabled: true }
  ];
  componentDisabled = false;
}`;

  // 半选状态
  indeterminateSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options"
      checkboxIndeterminate="true">
    </lib-checkbox>
    <p>当前值: {{ values | json }}</p>
  \`,
})
export class CheckboxComponent {
  values: any[] = [1];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '半选状态', value: 3, indeterminate: true },
    { label: '选项4', value: 4 }
  ];
}`;

  // 自定义模板
  templateSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="values" 
      [checkboxOptions]="options"
      [checkboxLabelTemplate]="customLabel">
    </lib-checkbox>
    <ng-template #customLabel let-option>
      <span class="custom-label">{{option.label}} - 自定义 (值: {{option.value}})</span>
    </ng-template>
    <p>当前值: {{ values | json }}</p>
  \`,
  styles: ['.custom-label { font-weight: 500; color: #1890ff; }']
})
export class CheckboxComponent {
  values: any[] = [1, 3];
  options = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 }
  ];
}`;

  // 添加单选模式示例代码
  singleSource = `
import { Component } from '@angular/core';
import { CheckboxComponent } from 'ng-cjf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  template: \`
    <lib-checkbox 
      [(ngModel)]="value" 
      [checkboxSingle]="true"
      checkboxSingleLabel="同意用户协议">
    </lib-checkbox>
    <p>当前值: {{ value }}</p>
  \`
})
export class ExampleComponent {
  value: boolean = false;
}`;

  toggleDisabled(): void {
    this.componentDisabled = !this.componentDisabled;
  }
}
