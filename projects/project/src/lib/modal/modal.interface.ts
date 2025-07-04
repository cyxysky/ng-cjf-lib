import { TemplateRef, Component, ComponentRef } from "@angular/core";
import { ModalComponent } from "./modal.component";
import { OverlayRef } from "@angular/cdk/overlay";

/** 模态框配置 */
export interface ModalOptions {
    /** 模态框宽度 */
    width?: string | number;
    /** 模态框高度 */
    height?: string | number;
    /** 是否显示关闭按钮 */
    closable?: boolean;
    /** 是否居中显示 */
    centered?: boolean;
    /** 点击蒙层是否允许关闭 */
    maskClosable?: boolean;
    /** 传递给模态框内容的数据 */
    data?: any;
    /** 模态框关闭后的回调 */
    afterClose?: () => void;
    /** 模态框打开后的回调 */
    afterOpen?: () => void;
    /** 头部内容 */
    headerContent?: TemplateRef<any>;
    /** 底部内容 */
    footerContent?: TemplateRef<any>;
    /** 内容 */
    bodyContent?: TemplateRef<any> | Component | any;
    /** 模态框顶部位置 */
    top?: string;
    /** 组件参数 */
    componentInputs?: any;
    /** 组件输出 */
    componentOutputs?: any;
}

/** 模态框引用 */
export type ModalRefMap = Map<string, { overlayRef: OverlayRef, componentRef: ComponentRef<ModalComponent> }>