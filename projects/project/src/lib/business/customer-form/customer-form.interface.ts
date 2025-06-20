export type ElementType = 'input' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'cascader' | 'treeSelect';

export interface FormOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FormComponent {
  id: number | string;
  title: string;
  type: ElementType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  width: number;
  x: number;
  y: number;
  options?: FormOption[];
  value?: any;
  template?: string;
}

export interface FormGroup {
  id: number | string;
  title: string;
  components: FormComponent[];
}

export interface ComponentLibraryItem {
  title: string;
  icon: string;
  isGroup?: boolean;  // 标识是否为组模板
  defaultComponents?: Partial<FormComponent>[]; // 组模板的默认组件
}

export interface ComponentGroup {
  title: string;
  expand: boolean;
  components: ComponentLibraryItem[];
}

export interface ComponentConfig {
  label: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  width: number;
  options: FormOption[];
}