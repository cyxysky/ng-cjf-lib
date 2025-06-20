# 动态表单组件 (CustomerFormComponent)

这是一个基于 Angular 的动态表单组件，使用 `*ngComponentOutlet` 实现动态组件渲染，支持多种表单元素类型。

## 特性

- ✅ 使用 `*ngComponentOutlet` 动态渲染不同类型的表单组件
- ✅ 支持 `ControlValueAccessor` 接口，完美集成 Angular 表单
- ✅ 支持多种表单元素：input、number、select、textarea、date、file 等
- ✅ 内置表单验证（必填、数字范围、文本长度等）
- ✅ 响应式宽度控制（full、half、third、quarter 等）
- ✅ 完整的 TypeScript 类型支持
- ✅ 现代化的 UI 设计

## 支持的表单元素类型

| 类型 | 描述 | 对应组件 |
|------|------|----------|
| `input` | 文本输入框 | InputComponent |
| `number` | 数字输入框 | NumberComponent |
| `select` | 下拉选择框 | SelectComponent |
| `text` | 多行文本域 | TextareaComponent |
| `checkbox` | 多选框 | SelectComponent |
| `radio` | 单选框 | SelectComponent |
| `date` | 日期选择器 | InputComponent |
| `datetime` | 日期时间选择器 | InputComponent |
| `file` | 文件上传 | InputComponent |
| `cascader` | 级联选择器 | SelectComponent |
| `treeSelect` | 树形选择器 | SelectComponent |

## 基本用法

### 1. 导入组件

```typescript
import { CustomerFormComponentComponent, FormFieldConfig } from './customer-form-component/customer-form-component.component';

@Component({
  imports: [CustomerFormComponentComponent]
})
export class YourComponent {
  // ...
}
```

### 2. 定义配置

```typescript
export class YourComponent {
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
      { label: '女', value: 'female' }
    ]
  };
}
```

### 3. 在模板中使用

```html
<!-- 基本用法 -->
<lib-customer-form-component
  [config]="textConfig"
  [(ngModel)]="formData.name"
  (valueChange)="onFieldChange('name', $event)"
></lib-customer-form-component>

<!-- 结合 Angular 响应式表单 -->
<form [formGroup]="myForm">
  <lib-customer-form-component
    [config]="numberConfig"
    formControlName="age"
  ></lib-customer-form-component>
</form>
```

## 配置选项 (FormFieldConfig)

```typescript
interface FormFieldConfig {
  element: 'input' | 'number' | 'select' | 'checkbox' | 'radio' | 'text' | 'date' | 'datetime' | 'file' | 'cascader' | 'treeSelect';
  name?: string;           // 字段标签
  key?: string;            // 字段键名
  placeholder?: string;    // 占位符文本
  required?: boolean;      // 是否必填
  disable?: boolean;       // 是否禁用
  show?: boolean;          // 是否显示
  width?: 'full' | 'half' | 'third' | 'quarter' | 'inline' | 'third-inline';  // 宽度
  helpText?: string;       // 帮助文本
  options?: SelectOption[]; // 选项列表（用于select、radio、checkbox等）
  validation?: ValidationConfig; // 验证配置
  defaultValue?: any;      // 默认值
}
```

## 验证配置 (ValidationConfig)

```typescript
interface ValidationConfig {
  min?: number;        // 最小值（数字类型）
  max?: number;        // 最大值（数字类型）
  step?: number;       // 步长（数字类型）
  rows?: number;       // 行数（文本域）
  maxLength?: number;  // 最大长度
  accept?: string;     // 接受的文件类型
  multiple?: boolean;  // 是否支持多选
}
```

## 选项配置 (SelectOption)

```typescript
interface SelectOption {
  label: string;           // 显示文本
  value: any;             // 选项值
  children?: SelectOption[]; // 子选项（用于级联选择）
}
```

## 宽度选项

| 值 | 描述 | 宽度 |
|----|------|------|
| `full` | 全宽 | 100% |
| `half` | 半宽 | 50% |
| `third` | 三分之一 | 33.333% |
| `quarter` | 四分之一 | 25% |
| `inline` | 行内块 | 自动 + 右边距 |
| `third-inline` | 行内三分之一 | 33.333% + 右边距 |

## 事件

- `valueChange`: 值变更事件
- `fieldBlur`: 字段失焦事件

## 高级用法

### 1. 动态生成表单

```typescript
export class DynamicFormComponent {
  formConfigs: FormFieldConfig[] = [
    {
      element: 'input',
      name: '用户名',
      key: 'username',
      required: true
    },
    {
      element: 'number',
      name: '年龄',
      key: 'age',
      validation: { min: 0, max: 120 }
    },
    {
      element: 'select',
      name: '城市',
      key: 'city',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' }
      ]
    }
  ];

  formData: any = {};
}
```

```html
<div *ngFor="let config of formConfigs">
  <lib-customer-form-component
    [config]="config"
    [(ngModel)]="formData[config.key]"
  ></lib-customer-form-component>
</div>
```

### 2. 自定义验证

组件内置了基本验证，如需更复杂的验证，可以结合 Angular 的响应式表单：

```typescript
this.myForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```

## 扩展组件

如需支持更多表单元素类型，可以：

1. 创建新的子组件（实现 `ControlValueAccessor`）
2. 在 `getComponentType()` 方法中添加新的 case
3. 更新 `FormFieldConfig` 接口的 `element` 类型

## 样式定制

组件使用 Less 样式，可以通过覆盖 CSS 变量或类名来定制样式：

```less
.customer-form-component {
  .form-control {
    border-color: your-color;
    // 其他样式定制
  }
}
```

## 技术实现

- 使用 `*ngComponentOutlet` 动态渲染不同类型的表单组件
- 通过 `Injector.create()` 向子组件传递数据和回调函数
- 实现 `ControlValueAccessor` 接口支持 Angular 表单集成
- 使用 TypeScript 严格类型检查确保类型安全 