import { Component, Input, forwardRef, TemplateRef, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { RadioOption } from './radio.interface';

@Component({
  selector: 'lib-radio',
  imports: [CommonModule, FormsModule],
  templateUrl: './radio.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent implements ControlValueAccessor {
  /** 选项 */
  @Input({ alias: 'radioOptions' }) options: RadioOption[] = [];
  /** 方向 */
  @Input({ alias: 'radioDirection' }) direction: 'horizontal' | 'vertical' = 'horizontal';
  /** 颜色 */
  @Input({ alias: 'radioColor' }) color: string = '';
  /** 标签模板 */
  @Input({ alias: 'radioLabelTemplate' }) labelTemplate: TemplateRef<any> | null = null;

  value: any;
  disabled: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * 选择选项
   * @param option 选项
   */
  selectOption(option: RadioOption): void {
    if (this.disabled || option.disabled) {
      return;
    }
    this.value = option.value;
    this.onChange(this.value);
    this.cdr.detectChanges();
  }

  /**
   * 判断选项是否被选中
   * @param option 选项
   * @returns 是否被选中
   */
  isChecked(option: RadioOption): boolean {
    return this.value === option.value;
  }

  // ControlValueAccessor 接口实现
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.value = value;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
