import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DocBoxComponent } from '../doc-box/doc-box.component';
import { ApiData, DocApiTableComponent } from '../doc-api-table/doc-api-table.component';
import { InputComponent } from '@project';
import { ProjectModule } from "../../../projects/project/src/lib/project.module";

@Component({
  selector: 'app-doc-input',
  standalone: true,
  imports: [
    FormsModule,
    DocBoxComponent,
    DocApiTableComponent,
    InputComponent,
    ProjectModule
],
  templateUrl: './doc-input.component.html',
  styleUrl: './doc-input.component.less'
})
export class DocInputComponent {
  // 基本用法示例
  basicValue: string = '';

  // 尺寸示例
  largeValue: string = '';
  defaultValue: string = '';
  smallValue: string = '';

  // 前缀和后缀示例
  prefixValue: string = '';
  suffixValue: string = '';
  prefixIconValue: string = '';
  suffixIconValue: string = '';

  // 允许清除示例
  clearValue: string = '';

  // 禁用和只读示例
  disabledValue: string = '禁用状态示例值';
  readonlyValue: string = '只读状态示例值';

  // 状态示例
  errorValue: string = '';
  warningValue: string = '';

  // 字数限制示例
  countValue: string = '';

  // 无边框示例
  borderlessValue: string = '';

  // API 文档
  apiSections: ApiData[] = [
    {
      title: '属性',
      items: [
        { name: 'inputPlaceholder', description: '输入框提示文本', type: 'string', default: "''" },
        { name: 'inputDisabled', description: '是否禁用', type: 'boolean', default: 'false' },
        { name: 'inputReadonly', description: '是否只读', type: 'boolean', default: 'false' },
        { name: 'inputSize', description: '输入框大小', type: "'large' | 'default' | 'small'", default: "'default'" },
        { name: 'inputPrefix', description: '输入框前缀文本', type: 'string', default: "''" },
        { name: 'inputSuffix', description: '输入框后缀文本', type: 'string', default: "''" },
        { name: 'inputPrefixIcon', description: '输入框前缀图标', type: 'string', default: "''" },
        { name: 'inputSuffixIcon', description: '输入框后缀图标', type: 'string', default: "''" },
        { name: 'inputAllowClear', description: '是否允许清除', type: 'boolean', default: 'true' },
        { name: 'inputMaxlength', description: '最大字符数', type: 'number | null', default: 'null' },
        { name: 'inputMinlength', description: '最小字符数', type: 'number | null', default: 'null' },
        { name: 'inputType', description: '输入框类型', type: 'string', default: "'text'" },
        { name: 'inputStatus', description: '输入框状态', type: "'error' | 'warning' | 'default'", default: "'default'" },
        { name: 'inputBordered', description: '是否有边框', type: 'boolean', default: 'true' },
        { name: 'inputShowCount', description: '是否显示字数统计', type: 'boolean', default: 'false' },
        { name: 'inputAutofocus', description: '是否自动获取焦点', type: 'boolean', default: 'false' },
        { name: 'inputId', description: '输入框ID', type: 'string', default: "''" },
        { name: 'inputPattern', description: '输入框校验规则', type: '((value: string) => boolean) | RegExp | null', default: 'null' },
        { name: 'inputAutocomplete', description: '浏览器自动完成', type: 'string', default: "'off'" }
      ]
    },
    {
      title: '事件',
      items: [
        { name: 'valueChange', description: '值变化时的回调', type: 'EventEmitter<any>' },
        { name: 'focus', description: '获取焦点时的回调', type: 'EventEmitter<FocusEvent>' },
        { name: 'blur', description: '失去焦点时的回调', type: 'EventEmitter<FocusEvent>' },
        { name: 'keydown', description: '键盘按下时的回调', type: 'EventEmitter<KeyboardEvent>' },
        { name: 'keyup', description: '键盘弹起时的回调', type: 'EventEmitter<KeyboardEvent>' },
        { name: 'keypress', description: '键盘按下时的回调', type: 'EventEmitter<KeyboardEvent>' },
        { name: 'click', description: '鼠标点击时的回调', type: 'EventEmitter<MouseEvent>' }
      ]
    }
  ];

  // 示例代码
  // 基本用法
  basicSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <lib-input 
      inputPlaceholder="请输入内容" 
      [(ngModel)]="value">
    </lib-input>
    <p>当前值: {{ value }}</p>
  \`
})
export class InputComponent {
  value: string = '';
}`;

  // 尺寸
  sizeSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-input 
        inputPlaceholder="大尺寸" 
        inputSize="large"
        [(ngModel)]="largeValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="默认尺寸" 
        [(ngModel)]="defaultValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="小尺寸" 
        inputSize="small"
        [(ngModel)]="smallValue">
      </lib-input>
    </div>
  \`,
})
export class InputComponent {
  largeValue: string = '';
  defaultValue: string = '';
  smallValue: string = '';
}`;

  // 前缀和后缀
  affixSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-input 
        inputPlaceholder="前缀" 
        inputPrefix="￥"
        [(ngModel)]="prefixValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="后缀" 
        inputSuffix="RMB"
        [(ngModel)]="suffixValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="前缀图标" 
        inputPrefixIcon="icon-user"
        [(ngModel)]="prefixIconValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="后缀图标" 
        inputSuffixIcon="icon-search"
        [(ngModel)]="suffixIconValue">
      </lib-input>
    </div>
  \`,
})
export class InputComponent {
  prefixValue: string = '';
  suffixValue: string = '';
  prefixIconValue: string = '';
  suffixIconValue: string = '';
}`;

  // 允许清除
  clearSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <lib-input 
      inputPlaceholder="输入后显示清除按钮" 
      [inputAllowClear]="true"
      [(ngModel)]="value">
    </lib-input>
  \`,
})
export class InputComponent {
  value: string = '';
}`;

  // 禁用和只读
  disabledSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-input 
        inputPlaceholder="禁用状态" 
        [inputDisabled]="true"
        [(ngModel)]="disabledValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="只读状态" 
        [inputReadonly]="true"
        [(ngModel)]="readonlyValue">
      </lib-input>
    </div>
  \`,
})
export class InputComponent {
  disabledValue: string = '禁用状态示例值';
  readonlyValue: string = '只读状态示例值';
}`;

  // 状态
  statusSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lib-input 
        inputPlaceholder="错误状态" 
        inputStatus="error"
        [(ngModel)]="errorValue">
      </lib-input>
      <lib-input 
        inputPlaceholder="警告状态" 
        inputStatus="warning"
        [(ngModel)]="warningValue">
      </lib-input>
    </div>
  \`,
})
export class InputComponent {
  errorValue: string = '';
  warningValue: string = '';
}`;

  // 字数限制
  countSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <lib-input 
      inputPlaceholder="最多输入10个字符" 
      [inputMaxlength]="10"
      [inputShowCount]="true"
      [(ngModel)]="value">
    </lib-input>
  \`,
})
export class InputComponent {
  value: string = '';
}`;

  // 无边框
  borderlessSource = `
import { Component } from '@angular/core';
import { InputComponent } from '@project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [InputComponent, FormsModule],
  template: \`
    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px;">
      <lib-input 
        inputPlaceholder="无边框输入框" 
        [inputBordered]="false"
        [(ngModel)]="value">
      </lib-input>
    </div>
  \`,
})
export class InputComponent {
  value: string = '';
}`;
}
