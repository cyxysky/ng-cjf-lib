/** 下拉菜单配置 */
export interface DropMenu {
  /** 标题 */
  title: string;
  /** 图标 */
  icon?: string;
  /** 子菜单 */
  children?: DropMenu[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义数据 */
  data?: any;
}