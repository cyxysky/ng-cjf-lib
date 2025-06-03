/** 级联选择器选项 */
export interface CascaderOption {
    /** 值 */
    value: any;
    /** 标签 */
    label: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 子选项 */
    children?: CascaderOption[];
    /** 是否叶子节点 */
    isLeaf?: boolean;
    /** 是否禁用勾选 */
    disableCheckbox?: boolean;
    /** 其他属性 */
    [key: string]: any;
    /** 路径 */
    path?: any[];
    /** 是否加载中 */
    loading?: boolean;
    /** 是否选中 */
    checked?: boolean;
    /** 是否半选 */
    halfChecked?: boolean;
}

/** 级联选择器展开触发类型 */
export type CascaderExpandTrigger = 'click' | 'hover';

/** 级联选择器触发类型 */
export type CascaderTriggerType = 'click' | 'hover';

/** 级联选择器大小 */
export type CascaderSize = 'large' | 'default' | 'small';