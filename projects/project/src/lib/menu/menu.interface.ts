/** 菜单项 */
export interface MenuItem {
    /** 唯一标识 */
    key: string;
    /** 标题 */
    title: string;
    /** 图标 */
    icon?: string;
    /** 是否展开 */
    isOpen?: boolean;
    /** 是否选中 */
    selected?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 子菜单 */
    children?: MenuItem[];
    /** 链接 */
    link?: string;
}