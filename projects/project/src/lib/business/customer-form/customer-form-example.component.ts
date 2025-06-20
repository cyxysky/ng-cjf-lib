import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerFormComponentComponent, FormFieldConfig } from './customer-form-component/customer-form-component.component';

@Component({
  selector: 'lib-customer-form-example',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerFormComponentComponent],
  template: `
    <div class="form-example">
      <h2>动态表单组件示例</h2>
      
      <div class="form-container">
        <!-- 文本输入 -->
        <lib-customer-form-component
          [config]="textConfig"
          [(ngModel)]="formData.name"
          (valueChange)="onFieldChange('name', $event)"
        ></lib-customer-form-component>
        
        <!-- 数字输入 -->
        <lib-customer-form-component
          [config]="numberConfig"
          [(ngModel)]="formData.age"
          (valueChange)="onFieldChange('age', $event)"
        ></lib-customer-form-component>
        
        <!-- 选择框 -->
        <lib-customer-form-component
          [config]="selectConfig"
          [(ngModel)]="formData.gender"
          (valueChange)="onFieldChange('gender', $event)"
        ></lib-customer-form-component>
        
        <!-- 文本域 -->
        <lib-customer-form-component
          [config]="textareaConfig"
          [(ngModel)]="formData.description"
          (valueChange)="onFieldChange('description', $event)"
        ></lib-customer-form-component>
      </div>
      
      <div class="form-data">
        <h3>表单数据:</h3>
        <pre>{{ formData | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .form-example {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .form-container {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .form-data {
      background: #f0f0f0;
      padding: 15px;
      border-radius: 4px;
      
      pre {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
    }
    
    h2, h3 {
      margin-top: 0;
      color: #333;
    }
  `]
})
export class CustomerFormExampleComponent {
  // 表单数据
  formData = {
    name: '',
    age: null,
    gender: '',
    description: ''
  };

  // 文本输入配置
  textConfig: FormFieldConfig = {
    element: 'input',
    name: '姓名',
    placeholder: '请输入姓名',
    required: true,
    width: 'full',
    validation: {
      maxLength: 50
    }
  };

  // 数字输入配置
  numberConfig: FormFieldConfig = {
    element: 'number',
    name: '年龄',
    placeholder: '请输入年龄',
    required: true,
    width: 'half',
    validation: {
      min: 0,
      max: 120,
      step: 1
    }
  };

  // 选择框配置
  selectConfig: FormFieldConfig = {
    element: 'select',
    name: '性别',
    placeholder: '请选择性别',
    required: true,
    width: 'half',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' }
    ]
  };

  // 文本域配置
  textareaConfig: FormFieldConfig = {
    element: 'text',
    name: '个人描述',
    placeholder: '请输入个人描述',
    required: false,
    width: 'full',
    helpText: '请简要描述您的个人信息',
    validation: {
      maxLength: 500,
      rows: 4
    }
  };

  onFieldChange(fieldName: string, value: any) {
    console.log(`字段 ${fieldName} 值变更为:`, value);
  }
} 