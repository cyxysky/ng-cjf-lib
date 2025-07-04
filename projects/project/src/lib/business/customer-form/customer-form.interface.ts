export type ElementType = 'input' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'cascader' | 'treeSelect';

/**
 * 表单定义
 */
export interface Form {
  /** 表单id */
  id: number | string;
  /** 表单名称 */
  name: string;
  /** 表单描述 */
  description: string;
  /** 是否启用 */
  isActive: boolean;
  /** 表单卡片 */
  cards: FormCard[];
  /** 表单按钮 */
  buttons: FormButton[];
}

/**
 * 表单按钮
 */
export interface FormButton {
  /** 按钮id */
  id: number | string;
  /** 按钮名称 */
  name: string;
  /** 按钮类型 */
  type: string;
  /** 按钮点击操作 */
  clickOperate: string;
  /** 按钮显示条件 */
  showCondition: string;
  /** 按钮排序 */
  sortOrder: number;
}

/**
 * 表单选项
 */
export interface FormOption {
  /** 选项标签 */
  label: string;
  /** 选项值 */
  value: any;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 表单组件
 */
export interface FormComponent {
  /** 组件id */
  id: number | string;
  /** 组件标题 */
  title: string;
  /** 组件类型 */
  type: ElementType;
  /** 组件名称 */
  name: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否显示 */
  show?: boolean;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 组件宽度 */
  width: number;
  /** 组件位置x */
  locationX: number;
  /** 组件位置y */
  locationY: number;
  /** 组件实际位置x */
  realLocationX?: number;
  /** 组件实际位置y */
  realLocationY?: number;
  /** 组件选项 */
  options?: FormOption[];
  /** 组件默认值 */
  defaultValue?: any;
  /** 组件模板 */
  template?: string;
  [key: string]: any;
}

/**
 * 表单卡片
 */
export interface FormCard {
  /** 卡片id */
  id: number | string;
  /** 卡片标题 */
  title: string;
  /** 卡片组件 */
  components: FormComponent[];
}

/**
 * 组件库项
 */
export interface ComponentLibraryItem {
  /** 组件库项标题 */
  title: string;
  /** 组件库项图标 */
  icon: string;
  /** 是否为组模板 */
  isGroup?: boolean;
  /** 组模板的默认组件 */
  defaultComponents?: Partial<FormComponent>[];
}
