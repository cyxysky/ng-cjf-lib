import { TemplateRef } from "@angular/core";

/** 标签页项 */
export interface TabItem {
    /** 唯一标识 */
    key: string;
    /** 标题 */
    title: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 内容 */
    content: TemplateRef<any>;
    /** 自定义标题 */
    customTitle?: TemplateRef<any>;
}

/** 标签页配置 */
export interface TabConfig extends Omit<TabItem, 'key'> {
    /** 唯一标识 */
    key?: string;
}

/** 标签页方向 */
export type tabsDirection = 'top' | 'bottom';

/** 标签页大小 */
export type tabsSize = 'default' | 'small' | 'large';

/** 标签页类型 */
export type tabsType = 'line' | 'card';

/** 标签页对齐方式 */
export type tabsAlign = 'left' | 'center' | 'right';

