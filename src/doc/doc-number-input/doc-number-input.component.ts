import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { ProjectModule } from '@project';

@Component({
  selector: 'app-doc-number-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    ProjectModule
  ],
  templateUrl: './doc-number-input.component.html',
  styleUrl: './doc-number-input.component.less'
})
export class DocNumberInputComponent {
  // 基本用法示例
  basicValue: number | null = 3;

  // 前缀后缀示例
  prefixSuffixValue: number | null = 100;

  // 精度示例
  precisionValue: number | null = 1.234;

  // 禁用示例
  disabledValue: number = 99;
  disabledControl = new FormControl(this.disabledValue);

  // 只读示例
  readonlyValue: number = 88;

  // 步进示例
  stepValue: number | null = 5;

  // 最大最小值示例
  boundedValue: number | null = 5;

  // 格式化示例
  formattedValue: number | null = 1000;
  currencyFormatter = (value: number) => `${value}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  currencyParser = (value: string) => parseFloat(value.replace(/\$\s?|(,*)/g, ''));

  // API 文档 - 修改为与tag组件一致的格式
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'numberInputMin', description: '最小值', type: 'number | null', default: 'null' },
        { name: 'numberInputMax', description: '最大值', type: 'number | null', default: 'null' },
        { name: 'numberInputStep', description: '每次改变步数，可以为小数', type: 'number', default: '1' },
        { name: 'numberInputPrecision', description: '数值精度，即小数位数', type: 'number', default: '0' },
        { name: 'numberInputPlaceholder', description: '占位提示文字', type: 'string', default: '""' },
        { name: 'numberInputDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'numberInputReadonly', description: '是否只读', type: 'boolean', default: 'false' },
        { name: 'numberInputPrefix', description: '带有前缀图标的输入框', type: 'string', default: '""' },
        { name: 'numberInputPrefixIcon', description: '带有前缀图标的输入框', type: 'string', default: '""' },
        { name: 'numberInputSuffix', description: '带有后缀图标的输入框', type: 'string', default: '""' },
        { name: 'numberInputSuffixIcon', description: '带有后缀图标的输入框', type: 'string', default: '""' },
        { name: 'numberInputFormatter', description: '指定输入框展示值的格式', type: '(value: number) => string | number', default: 'value => value' },
        { name: 'numberInputColor', description: '输入框字体颜色', type: 'string', default: 'black' },
        { name: 'numberInputStatus', description: '输入框状态', type: '\'normal\' | \'error\' | \'warning\'', default: '\'normal\'' }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '值变化时的回调', type: 'EventEmitter<number | null>' }
      ]
    }
  ];

  htmlPreCode = '<span prefix>$</span><span suffix>美元</span>';

  // 演示代码 - 使用单独的source、HTML和CSS属性
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input [(ngModel)]="value"></lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number | null = 3;
}`;

  // 前缀后缀
  prefixSuffixSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputPrefix]="'¥'"
      [numberInputSuffix]="'元'"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
    <lib-number-input
      [(ngModel)]="prefixSuffixValue">
      <span prefix>$</span>
      <span suffix>美元</span>
    </lib-number-input>
  \`,
})
export class NumberInputComponent {
  value: number | null = 100;
}`;

  prefixSuffixExample =
    `[numberInputPrefix]="'¥'" [numberInputSuffix]="'元'"`

  // 精度
  precisionSource =
    `import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputPrecision]="2"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number | null = 1.234;
}`;

  // 禁用
  disabledSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputDisabled]="true"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number = 99;
}`;

  // 只读
  readonlySource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputReadonly]="true"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number = 88;
}`;

  // 步进
  stepSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputStep]="0.1"
      [numberInputPrecision]="2"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number | null = 5;
}`;

  // 范围限制
  boundedSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputMin]="1"
      [numberInputMax]="10"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number | null = 5;
}`;

  // 格式化
  formattedSource = `
import { Component } from '@angular/core';
import { NumberInputComponent } from 'your-lib';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [NumberInputComponent],
  template: \`
    <lib-number-input
      [numberInputFormatter]="currencyFormatter"
      [(ngModel)]="value">
    </lib-number-input>
    <p>当前值: {{ value }}</p>
  \`,
})
export class NumberInputComponent {
  value: number | null = 1000;
  
  currencyFormatter = (value: number) => \`\${value}\`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  currencyParser = (value: string) => parseFloat(value.replace(/\\$\\s?|(,*)/g, ''));
}`;
}
