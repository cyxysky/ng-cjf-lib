import { Component, forwardRef, signal, computed, input, Input, booleanAttribute, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lib-number-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent implements ControlValueAccessor {
  /** 最小值 */
  @Input({ alias: 'numberInputMin' }) min: number | null = null;
  /** 最大值 */
  @Input({ alias: 'numberInputMax' }) max: number | null = null;
  /** 步长 */
  @Input({ alias: 'numberInputStep' }) step: number = 1;
  /** 小数精度 */
  @Input({ alias: 'numberInputPrecision' }) precision: number = 0;
  /** 占位符 */
  @Input({ alias: 'numberInputPlaceholder' }) placeholder: string = '';
  /** 是否禁用 */
  @Input({ alias: 'numberInputDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 是否只读 */
  @Input({ alias: 'numberInputReadonly', transform: booleanAttribute }) readonly: boolean = false;
  /** 颜色 */
  @Input({ alias: 'numberInputColor' }) color: string = '';
  /** 前缀 */
  @Input({ alias: 'numberInputPrefix' }) prefix: string = '';
  /** 后缀 */
  @Input({ alias: 'numberInputSuffix' }) suffix: string = '';
  /** 前缀图标 */
  @Input({ alias: 'numberInputPrefixIcon' }) prefixIcon: string = '';
  /** 后缀图标 */
  @Input({ alias: 'numberInputSuffixIcon' }) suffixIcon: string = '';
  /** 状态 */
  @Input({ alias: 'numberInputStatus' }) status: 'normal' | 'error' | 'warning' = 'normal';
  /** 格式化函数 */
  @Input({ alias: 'numberInputFormatter' }) formatter: (value: number) => any = (value) => value;

  constructor(public cdr: ChangeDetectorRef) { }

  /** 当前值 */
  public value = signal<number | null>(null);
  /** 是否获得焦点 */
  public focused = signal<boolean>(false);


  /** 显示值（经过格式化处理） */
  displayValue = computed(() => {
    const val = this.value();
    if (val === null) return '';
    const formattedValue = this.applyFormatter(val);
    return typeof formattedValue === 'number' ? this.formatWithPrecision(formattedValue) : formattedValue;
  });

  /**
   * 增加值
   */
  increase(): void {
    if (this.isDisabled()) return;
    const currentValue = this.value() ?? 0;
    const newValue = currentValue + this.step;
    if (this.isValueInRange(newValue)) {
      this.updateValue(newValue);
    }
    this.cdr.detectChanges();
  }

  /**
   * 减少值
   */
  decrease(): void {
    if (this.isDisabled()) return;
    const currentValue = this.value() ?? 0;
    const newValue = currentValue - this.step;
    if (this.isValueInRange(newValue)) {
      this.updateValue(newValue);
    }
    this.cdr.detectChanges();
  }

  /**
   * 输入框值变更处理
   */
  onInputChange(value: number | null): void {
    if (value === null) {
      this.updateValue(null);
      this.cdr.detectChanges();
      return;
    }
    if (isNaN(value)) return;
    // 应用范围限制
    const boundedValue = this.applyBounds(value);
    if (boundedValue === value) {
      this.value.set(value);
      this.onChange(value);
    }
    this.cdr.detectChanges();
  }

  /**
   * 失去焦点事件处理
   */
  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    // 失去焦点时应用精度和范围限制
    const currentValue = this.value();
    if (currentValue !== null) {
      this.updateValue(currentValue);
    }
    this.cdr.detectChanges();
  }

  /**
   * 获得焦点事件处理
   */
  onFocus(): void {
    this.focused.set(true);
    this.cdr.detectChanges();
  }

  /**
   * 判断是否禁用
   * @returns 是否禁用
   */
  private isDisabled(): boolean {
    return this.disabled || this.readonly;
  }

  /**
   * 判断值是否在范围内
   * @param value 值
   * @returns 是否在范围内
   */
  private isValueInRange(value: number): boolean {
    const minVal = this.min;
    const maxVal = this.max;
    return (minVal === null || value >= minVal) && (maxVal === null || value <= maxVal);
  }

  /**
   * 应用范围限制
   * @param value 值
   * @returns 范围限制后的值
   */
  private applyBounds(value: number): number {
    const minVal = this.min;
    const maxVal = this.max;
    if (minVal !== null && value < minVal) return minVal;
    if (maxVal !== null && value > maxVal) return maxVal;
    return value;
  }

  /**
   * 应用精度
   * @param value 值
   * @returns 精度处理后的值
   */
  private applyPrecision(value: number): number {
    const precisionVal = this.precision;
    if (precisionVal >= 0) {
      return parseFloat(value.toFixed(precisionVal));
    }
    return value;
  }

  /**
   * 格式化值
   * @param value 值
   * @returns 格式化后的值
   */
  private formatWithPrecision(value: number): string {
    return value.toFixed(this.precision);
  }

  /**
   * 应用格式化函数
   * @param value 值
   * @returns 格式化后的值
   */
  private applyFormatter(value: number): any {
    return this.formatter(value);
  }

  /**
   * 更新值
   * @param value 值
   */
  private updateValue(value: number | null): void {
    if (value === null || value === undefined) {
      this.value.set(null);
      this.onChange(null);
      return;
    }
    // 应用范围限制
    const boundedValue = this.applyBounds(value);
    // 应用精度
    const preciseValue = this.applyPrecision(boundedValue);
    // 更新内部值
    this.value.set(preciseValue);
    // 通知表单控件
    this.onChange(preciseValue);
  }

  // 实现ControlValueAccessor接口
  private onChange: (value: number | null) => void = () => { };
  private onTouched: () => void = () => { };

  /**
   * 写入值
   */
  writeValue(value: number | null): void {
    if (value === null || value === undefined) {
      this.value.set(null);
      return;
    }

    // 应用精度
    const preciseValue = this.applyPrecision(value);
    this.value.set(preciseValue);
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
  setDisabledState(isDisabled: boolean): void {
    // 由于使用信号API，我们不能直接修改input信号
  }
}
