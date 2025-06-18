import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Output, signal, Input, booleanAttribute, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputSize, InputStatus } from './input.interface';

@Component({
  selector: 'lib-input',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  /** 输入框大小 */
  @Input({ alias: 'inputSize' }) size: InputSize = 'default';
  /** 输入框前缀 */
  @Input({ alias: 'inputPrefix' }) prefix: string = '';
  /** 输入框后缀 */
  @Input({ alias: 'inputSuffix' }) suffix: string = '';
  /** 前缀图标 */
  @Input({ alias: 'inputPrefixIcon' }) prefixIcon: string = '';
  /** 后缀图标 */
  @Input({ alias: 'inputSuffixIcon' }) suffixIcon: string = '';
  /** 输入框提示 */
  @Input({ alias: 'inputPlaceholder' }) placeholder: string = '请输入';
  /** 输入框禁用 */
  @Input({ alias: 'inputDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 输入框只读 */
  @Input({ alias: 'inputReadonly', transform: booleanAttribute }) readonly: boolean = false;
  /** 允许清除 */
  @Input({ alias: 'inputAllowClear', transform: booleanAttribute }) allowClear: boolean = true;
  /** 输入框最大长度 */
  @Input({ alias: 'inputMaxlength' }) maxlength: number | null = null;
  /** 输入框最小长度 */
  @Input({ alias: 'inputMinlength' }) minlength: number | null = null;
  /** 输入框类型 */
  @Input({ alias: 'inputType' }) type: string = 'text';
  /** 输入框状态 */
  @Input({ alias: 'inputStatus' }) status: InputStatus = 'default';
  /** 边框 */
  @Input({ alias: 'inputBordered', transform: booleanAttribute }) bordered: boolean = true;
  /** 是否显示字数统计 */
  @Input({ alias: 'inputShowCount', transform: booleanAttribute }) showCount: boolean = false;
  /** 自动获取焦点 */
  @Input({ alias: 'inputAutofocus', transform: booleanAttribute }) autofocus: boolean = false;
  /** 是否自动调整大小 */
  @Input({ alias: 'inputAutosize' }) autosize: boolean | { minRows: number; maxRows: number } = false;
  /** 输入框id */
  @Input({ alias: 'inputId' }) id: string = '';
  /** 输入框校验规则 */
  @Input({ alias: 'inputPattern' }) pattern: ((value: string) => boolean) | RegExp | null = null;
  /** 输入框自动完成 */
  @Input({ alias: 'inputAutocomplete' }) autocomplete: string = 'off';

  /** 输入框获得焦点事件 */
  @Output() focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  /** 输入框失去焦点事件 */
  @Output() blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  /** 输入框键盘按下事件 */
  @Output() keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  /** 输入框键盘弹起事件 */
  @Output() keyup: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  /** 输入框键盘按下事件 */
  @Output() keypress: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  /** 输入框鼠标点击事件 */
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /** 焦点状态 */
  public hasFocus = signal<boolean>(false);
  /** 左内边距 */
  public paddingLeft = signal<number>(12);
  /** 右内边距 */
  public paddingRight = signal<number>(12);
  /** 内部数据 */
  public _data: any = '';

  /**
   * 获得焦点事件处理
   */
  onFocus(event: FocusEvent): void {
    this.hasFocus.set(true);
    this.focus.emit(event);
    this.onTouched();
  }

  /**
   * 失去焦点事件处理
   */
  onBlur(event: FocusEvent): void {
    this.hasFocus.set(false);
    this.blur.emit(event);
  }

  /**
   * 键盘按下事件处理
   */
  onKeyDown(event: KeyboardEvent): void {
    this.keydown.emit(event);
  }

  /**
   * 键盘弹起事件处理
   */
  onKeyUp(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

  /**
   * 键盘按下事件处理
   */
  onKeyPress(event: KeyboardEvent): void {
    this.keypress.emit(event);
  }

  /**
   * 鼠标点击事件处理
   */
  onClick(event: MouseEvent): void {
    this.click.emit(event);
  }

  /**
   * 值变更处理
   */
  changeValue(value: any): void {
    // 验证输入值
    if (this.pattern) {
      const pattern = this.pattern;
      if (typeof pattern === 'function' && !pattern(value)) {
        // 自定义验证函数失败
        return;
      } else if (pattern instanceof RegExp && !pattern.test(value)) {
        // 正则表达式验证失败
        return;
      }
    }
    this._data = value;
    this.onChange(value);
  }

  /**
   * 清除输入内容
   */
  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.setAndSubmitData('');
  }

  /**
   * 设置并提交数据
   */
  setAndSubmitData(value: any): void {
    this._data = value;
    this.onChange(this._data);
  }

  /**
   * 计算字符统计
   */
  getCharCount(): string {
    const count = this._data?.length || 0;
    if (this.maxlength) {
      return `${count}/${this.maxlength}`;
    }
    return `${count}`;
  }

  // ControlValueAccessor接口实现
  public onChange: any = (value: any) => { };
  public onTouched: any = () => { };

  /**
   * 写入值
   */
  writeValue(obj: any): void {
    this._data = obj ?? '';
  }

  /**
   * 注册变更处理函数
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * 注册触摸处理函数
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * 设置禁用状态
   */
  setDisabledState?(isDisabled: boolean): void {
    // 使用输入信号不需要在这里设置
  }
}
