/** 树节点选项 */
export interface TreeNodeOptions {
  /** 唯一标识 */
  key: string;
  /** 标题 */
  title: string;
  /** 图标 */
  icon?: string;
  /** 是否叶子节点 */
  isLeaf?: boolean;
  /** 是否展开 */
  expanded?: boolean;
  /** 是否选中 */
  selected?: boolean;
  /** 是否选中 */
  checked?: boolean;
  /** 是否半选 */
  indeterminate?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否禁用勾选 */
  disableCheckbox?: boolean;
  /** 子节点 */
  children?: TreeNodeOptions[];
  /** 子节点改变 */
  changeChildren?: (children: TreeNodeOptions[]) => void;
  /** 是否异步加载 */
  asyncLoading?: boolean;
  [key: string]: any;
}