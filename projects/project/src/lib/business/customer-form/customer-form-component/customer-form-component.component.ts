import { Component, Input, Output, EventEmitter, Injector, Type, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CascaderComponent, CheckboxComponent, DateTimerComponent, InputComponent, NumberInputComponent, RadioComponent, SelectComponent, TreeSelectComponent } from '@project';

// 表单字段配置接口
export interface FormFieldConfig {
  element: 'input' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'cascader' | 'treeSelect';
  name?: string;
  key?: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  show?: boolean;
  width?: 'full' | 'half' | 'third' | 'quarter' | 'inline' | 'third-inline';
  helpText?: string;
  options?: any[];
  defaultValue?: any;
}


@Component({
  selector: 'lib-customer-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form-component.component.html',
  styleUrl: './customer-form-component.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomerFormComponentComponent,
      multi: true
    }
  ]
})
export class CustomerFormComponentComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() config: FormFieldConfig = { element: 'input' };

  public value: any;
  public disabled: boolean = false;
  public errorMessage: string = '';

  public onChange: any = (value: any) => { };
  public onTouched: any = () => { };

  constructor(private injector: Injector) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    // 清理资源
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // 获取要渲染的组件类型
  getComponentType(): Type<any> {
    switch (this.config.element) {
      case 'input':
        return InputComponent;
      case 'number':
        return NumberInputComponent;
      case 'select':
        return SelectComponent;
      case 'checkbox':
        return CheckboxComponent;
      case 'radio':
        return RadioComponent;
      case 'cascader':
        return CascaderComponent;
      case 'treeSelect':
        return TreeSelectComponent;
      case 'date':
        return DateTimerComponent; // 可以扩展为专门的组件
      default:
        return InputComponent;
    }
  }


  // 处理值变更
  private handleValueChange(value: any) {
    this.value = value;
    this.onChange(this.value);
  }

}
