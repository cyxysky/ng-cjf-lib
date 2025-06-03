import { Component, Input, forwardRef, OnInit, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, booleanAttribute, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxOption, CheckboxDirection } from './checkbox.interface';

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  /** 选项 */
  @Input({ alias: 'checkboxOptions' }) options: CheckboxOption[] = [];
  /** 方向 */
  @Input({ alias: 'checkboxDirection' }) direction: CheckboxDirection = 'horizontal';
  /** 复选框颜色 */
  @Input({ alias: 'checkboxColor' }) checkboxColor: string = '';
  /** 是否半选 */
  @Input({ alias: 'checkboxIndeterminate', transform: booleanAttribute }) indeterminate: boolean = false;
  /** 半选颜色 */
  @Input({ alias: 'checkboxIndeterminateColor' }) indeterminateColor: string = '';
  /** 标签模板 */
  @Input({ alias: 'checkboxLabelTemplate' }) labelTemplate: TemplateRef<any> | null = null;
  /** 是否禁用 */
  @Input({ alias: 'checkboxDisabled', transform: booleanAttribute }) disabled: boolean = false;
  /** 是否单独显示 */
  @Input({ alias: 'checkboxSingle', transform: booleanAttribute }) single: boolean = false;
  /** 单选标签 */
  @Input({ alias: 'checkboxSingleLabel' }) singleLabelContent: TemplateRef<any> | string | any = '';

  /** 选中的值数组 */
  value: any[] = [];
  /** 单选值 */
  singleValue: boolean = false;
  /** 选项选中状态映射 */
  isChecked: { [key: string]: boolean } = {};

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.updateCheckedStatus();
  }

  ngOnChanges(changes: any): void {
    this.cdr.detectChanges();
  }

  /**
   * 更新选中状态
   */
  updateCheckedStatus(): void {
    this.isChecked = {};
    if (this.value && this.options) {
      this.options.forEach(option => {
        const key = this.getOptionKey(option.value);
        this.isChecked[key] = this.value.some(
          val => this.getOptionKey(val) === key
        );
        if (option.indeterminate && !this.isChecked[key]) {
          this.value = [...this.value, option.value];
          this.isChecked[key] = true;
        }
      });
    }
    this.cdr.detectChanges();
  }

  /**
   * 切换单选状态
   */
  checkSingle(): void {
    this.singleValue = !this.singleValue;
    this.onChange(this.singleValue);
    this.cdr.detectChanges();
  }

  /**
   * 切换选项状态
   */
  toggleOption(option: CheckboxOption): void {
    if (this.disabled || option.disabled) return;
    const optionValue = option.value;
    const optionValueKey = this.getOptionKey(optionValue);
    if (option.indeterminate) {
      option.indeterminate = false;
      if (!this.isChecked[optionValueKey]) {
        this.value = [...this.value, optionValue];
        this.isChecked[optionValueKey] = true;
      }
    } else {
      if (this.isChecked[optionValueKey]) {
        this.value = this.value.filter(
          val => this.getOptionKey(val) !== optionValueKey
        );
      } else {
        this.value = [...this.value, optionValue];
      }
    }
    this.updateCheckedStatus();
    this.cdr.detectChanges();
    this.onChange(this.value);
    this.onTouched();
  }

  /**
   * 切换全选状态
   */
  toggleAll(): void {
    if (this.disabled) return;
    const shouldCheckAll = !this.isAllChecked();
    if (shouldCheckAll) {
      // 选中所有未禁用的选项
      this.value = this.options
        .filter(opt => !opt.disabled)
        .map(opt => opt.value);
    } else {
      // 取消所有选中
      this.value = [];
    }
    this.updateCheckedStatus();
    this.cdr.detectChanges();
    this.onChange(this.value);
    this.onTouched();
  }

  /**
   * 获取选项键
   */
  getOptionKey(value: any): string {
    return JSON.stringify(value);
  }

  /**
   * 获取不确定状态
   */
  getIndeterminateState(): boolean {
    if (this.indeterminate) return true;
    const checkedCount = Object.values(this.isChecked).filter(v => v).length;
    return checkedCount > 0 && checkedCount < this.options.length;
  }

  /**
   * 是否全选
   */
  isAllChecked(): boolean {
    return this.options.length > 0 &&
      this.options.every(opt => this.isChecked[this.getOptionKey(opt.value)]);
  }

  /**
   * 是否为模板
   */
  isTemplate(value: any): boolean {
    if (!value) return false;
    return value instanceof TemplateRef;
  }

  /**
   * 获取选项选中状态
   */
  getOptionCheckedState(option: any): boolean {
    if (option.id !== undefined) {
      return this.isChecked[this.getOptionKey(option.value)];
    }
    if (typeof option.value === 'string' || typeof option.value === 'number') {
      return this.isChecked[this.getOptionKey(option.value)];
    }
    return this.isChecked[this.getOptionKey(option.value)];
  }

  /** 值变更回调函数 */
  onChange: any = () => { };
  /** 触摸回调函数 */
  onTouched: any = () => { };

  /**
   * 写入值
   */
  writeValue(value: any): void {
    if (this.single) {
      this.singleValue = value;
    } else {
      this.value = value || [];
    }
    this.updateCheckedStatus();
  }

  /**
   * 注册变更函数
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * 注册触摸函数
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * 设置禁用状态
   */
  setDisabledState(isDisabled: boolean): void {
    // this.disabled = isDisabled;
  }
}
