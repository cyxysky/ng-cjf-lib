import { TemplateRef } from "@angular/core";

/** 抽屉配置 */
export interface DrawerOptions {
    /** 抽屉标题 */
    title?: string | TemplateRef<{ $implicit: any }>;
    /** 抽屉内容 */
    content?: string | TemplateRef<{ $implicit: any }>;
    /** 自定义数据，传递给内容模板 */
    data?: any;
    /** 抽屉宽度 */
    width?: string;
    /** 抽屉高度 */
    height?: string;
    /** 抽屉位置，从哪个方向滑出 */
    placement?: 'left' | 'right' | 'top' | 'bottom';
    /** 是否显示遮罩 */
    mask?: boolean;
    /** 点击遮罩是否允许关闭 */
    maskClosable?: boolean;
    /** 是否显示关闭按钮 */
    closable?: boolean;
    /** 抽屉层级 */
    zIndex?: number;
    /** 关闭抽屉时的回调函数 */
    onClose?: () => void;
    /** 抽屉打开后的回调函数 */
    afterOpen?: () => void;
    /** 抽屉关闭后的回调函数 */
    afterClose?: () => void;
}
