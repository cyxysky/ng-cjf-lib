import { Component, Input, Output, EventEmitter, Injector, Type, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

// 表单字段配置接口
export interface FormFieldConfig {
  element: 'input' | 'number' | 'select' | 'checkbox' | 'radio' | 'text' | 'date' | 'datetime' | 'file' | 'cascader' | 'treeSelect';
  name?: string;
  key?: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  show?: boolean;
  width?: 'full' | 'half' | 'third' | 'quarter' | 'inline' | 'third-inline';
  helpText?: string;
  options?: SelectOption[];
  validation?: ValidationConfig;
  defaultValue?: any;
}

// 选项接口
export interface SelectOption {
  label: string;
  value: any;
  children?: SelectOption[];
}

// 验证配置接口
export interface ValidationConfig {
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  maxLength?: number;
  accept?: string;
  multiple?: boolean;
}

// 基础输入组件
@Component({
  selector: 'lib-input-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class]="config?.width || 'full'">
      <label *ngIf="config?.name" [class.required]="config?.required">
        {{ config.name }}
      </label>
      <input
        type="text"
        [placeholder]="config?.placeholder || ''"
        [value]="value || ''"
        [disabled]="disabled || config?.disable"
        [required]="config?.required"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        class="form-control"
      />
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() config!: FormFieldConfig;
  @Input() value: any;
  @Input() disabled: boolean = false;
  
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any) { this.value = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
}

// 数字输入组件
@Component({
  selector: 'lib-number-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class]="config?.width || 'full'">
      <label *ngIf="config?.name" [class.required]="config?.required">
        {{ config.name }}
      </label>
      <input
        type="number"
        [placeholder]="config?.placeholder || ''"
        [value]="value || ''"
        [disabled]="disabled || config?.disable"
        [required]="config?.required"
        [min]="config?.validation?.min"
        [max]="config?.validation?.max"
        [step]="config?.validation?.step || 1"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        class="form-control"
      />
    </div>
  `
})
export class NumberComponent implements ControlValueAccessor {
  @Input() config!: FormFieldConfig;
  @Input() value: any;
  @Input() disabled: boolean = false;
  
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any) { this.value = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
}

// 选择框组件
@Component({
  selector: 'lib-select-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class]="config?.width || 'full'">
      <label *ngIf="config?.name" [class.required]="config?.required">
        {{ config.name }}
      </label>
      <select
        [value]="value || ''"
        [disabled]="disabled || config?.disable"
        [required]="config?.required"
        (change)="onSelectChange($event)"
        (blur)="onTouched()"
        class="form-control"
      >
        <option value="" *ngIf="config?.placeholder">{{ config.placeholder }}</option>
        <option 
          *ngFor="let option of config?.options" 
          [value]="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() config!: FormFieldConfig;
  @Input() value: any;
  @Input() disabled: boolean = false;
  
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any) { this.value = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  onSelectChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
}

// 文本域组件
@Component({
  selector: 'lib-textarea-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field" [class]="config?.width || 'full'">
      <label *ngIf="config?.name" [class.required]="config?.required">
        {{ config.name }}
      </label>
      <textarea
        [placeholder]="config?.placeholder || ''"
        [value]="value || ''"
        [disabled]="disabled || config?.disable"
        [required]="config?.required"
        [rows]="config?.validation?.rows || 4"
        [attr.maxlength]="config?.validation?.maxLength"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        class="form-control"
      ></textarea>
    </div>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() config!: FormFieldConfig;
  @Input() value: any;
  @Input() disabled: boolean = false;
  
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any) { this.value = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
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
  @Output() valueChange = new EventEmitter<any>();
  @Output() fieldBlur = new EventEmitter<void>();

  public value: any;
  public disabled: boolean = false;
  public errorMessage: string = '';

  public onChange: any = (value: any) => {};
  public onTouched: any = () => {};

  constructor(private injector: Injector) {}

  ngOnInit() {
    this.validateField();
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
        return NumberComponent;
      case 'select':
      case 'checkbox':
      case 'radio':
      case 'cascader':
      case 'treeSelect':
        return SelectComponent;
      case 'text':
        return TextareaComponent;
      case 'date':
      case 'datetime':
      case 'file':
        return InputComponent; // 可以扩展为专门的组件
      default:
        return InputComponent;
    }
  }

  // 创建注入器，传递数据给子组件
  getInjector(): Injector {
    return Injector.create({
      providers: [
        { provide: 'config', useValue: this.config },
        { provide: 'value', useValue: this.value },
        { provide: 'disabled', useValue: this.disabled },
        { provide: 'onChange', useValue: this.handleValueChange.bind(this) },
        { provide: 'onTouched', useValue: this.handleTouched.bind(this) }
      ],
      parent: this.injector
    });
  }

  // 处理值变更
  private handleValueChange(value: any) {
    this.value = value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.validateField();
  }

  // 处理失焦事件
  private handleTouched() {
    this.onTouched();
    this.fieldBlur.emit();
  }

  // 字段验证
  private validateField() {
    this.errorMessage = '';
    
    // 必填验证
    if (this.config.required && (!this.value || this.value === '')) {
      this.errorMessage = `${this.config.name || '此字段'}为必填项`;
      return;
    }
    
    // 数字类型验证
    if (this.config.element === 'number' && this.value !== '' && this.value != null) {
      const numValue = Number(this.value);
      
      if (isNaN(numValue)) {
        this.errorMessage = '请输入有效的数字';
        return;
      }
      
      if (this.config.validation?.min !== undefined && numValue < this.config.validation.min) {
        this.errorMessage = `最小值为 ${this.config.validation.min}`;
        return;
      }
      
      if (this.config.validation?.max !== undefined && numValue > this.config.validation.max) {
        this.errorMessage = `最大值为 ${this.config.validation.max}`;
        return;
      }
    }
    
    // 文本长度验证
    if ((this.config.element === 'input' || this.config.element === 'text') && this.value) {
      if (this.config.validation?.maxLength && this.value.length > this.config.validation.maxLength) {
        this.errorMessage = `最大长度为 ${this.config.validation.maxLength} 个字符`;
        return;
      }
    }
  }
}
