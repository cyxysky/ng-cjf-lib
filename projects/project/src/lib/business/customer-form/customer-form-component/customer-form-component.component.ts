import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class CustomerFormComponentComponent implements ControlValueAccessor {
  public value: any;
  public disabled: boolean = false;
  public onChange: any = (value: any) => {};
  public onTouched: any = () => { };
  writeValue(value: any) {
    this.value = value;
    // this.onChange(this.value);
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

  changeValue(value: any) {
    this.value = value;
    this.onChange(this.value);
  }
}
