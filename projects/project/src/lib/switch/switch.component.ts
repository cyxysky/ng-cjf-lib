import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, input, model, output, signal, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent implements ControlValueAccessor {
  @ViewChild('switchButton') switchButton!: ElementRef;
  /** 是否禁用 */
  @Input({ alias: 'switchDisabled', transform: booleanAttribute }) disabled = false;
  /** 是否加载中 */
  @Input({ alias: 'switchLoading', transform: booleanAttribute }) loading = false;
  /** 选中时的内容 */
  @Input({ alias: 'switchCheckedChildren' }) checkedChildren: string | TemplateRef<any> | any = null;
  /** 未选中时的内容 */
  @Input({ alias: 'switchUnCheckedChildren' }) unCheckedChildren: string | TemplateRef<any> | any = null;
  /** 大小 */
  @Input({ alias: 'switchSize' }) size: 'default' | 'small' = 'default';

  constructor(public cdr: ChangeDetectorRef) { }

  /** 是否选中 */
  checked = signal(false);
  /** 是否聚焦 */
  focused = signal(false);

  /**
   * 切换
   */
  toggle(): void {
    if (this.disabled || this.loading) {
      return;
    }
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.cdr.detectChanges();
  }

  /**
   * 是否字符串
   * @param value 
   * @returns 是否
   */
  isString(value: any): boolean {
    if (!value) return false;
    return typeof value === 'string';
  }

  /**
   * 是否模板
   * @param value 值
   * @returns 是否
   */
  isTemplate(value: any): boolean {
    if (!value) return false;
    return value instanceof TemplateRef;
  }

  // ControlValueAccessor接口实现
  private onChange: (value: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  // ControlValueAccessor接口方法
  writeValue(value: boolean): void {
    this.checked.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {

  }

  onFocus(): void {
    this.focused.set(true);
    this.onTouched();
  }

  onBlur(): void {
    this.focused.set(false);
  }
}
