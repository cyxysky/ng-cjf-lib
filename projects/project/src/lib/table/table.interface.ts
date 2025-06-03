/** 表格列筛选类型 */
export type TableColumnFilterType = 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'select-multiple'
  | 'cascader'
  | 'cascader-multiple'
  | 'tree-select'
  | 'tree-select-multiple'
  | 'tree-select-checkable'
  | 'date-range'
  | 'radio'
  | 'checkbox';

/** 表格列筛选项 */
export interface TableColumnFilter {
  /** 标题 */
  title?: string;
  /** 类型 */
  type: TableColumnFilterType;
  /** 默认值 */
  defaultValue?: any | { start: any, end: any };
  /** 选项 */
  options?: any[];
  /** 条件 */
  condition?: TableColumnFilterCondition[];
}

/** 表格列 */
export interface TableColumn {
  /** 列标题 */
  title: string;
  /** 列头模板 */
  headTemplate?: string;
  /** 字段名，对应数据对象的属性，对于父级表头列可选 */
  field: string;
  /** 内部使用的唯一ID */
  __id?: string;
  /** 列类型，operation表示操作列 */
  type?: 'operation' | string;
  /** 列宽度 */
  width?: string | number;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列是否可排序 */
  sortable?: boolean;
  /** 当前排序方向 */
  sortOrder?: 'ascend' | 'descend' | null;
  /** 列是否可筛选 */
  filterable?: boolean;
  /** 筛选项 */
  filters?: TableColumnFilter;
  /** 自定义筛选模板 */
  filterTemplate?: string;
  /** 表头合并 */
  colspan?: number;
  /** 表头行合并 */
  rowspan?: number;
  /** 子表头 */
  children?: TableColumn[];
  /** 表身模板 */
  template?: string;
  /** 是否固定列 (true/'left' 表示左固定，'right' 表示右固定) */
  fixed?: boolean | 'left' | 'right';
  /** 按钮配置 */
  buttons?: Array<{
    text: string;
    icon?: string;
    disabled?: boolean;
    show?: (data: any, rowIndex: number) => boolean;
    click: (data: any, rowIndex: number) => void;
  }>;
  /** 最大按钮数，超出以下拉显示 */
  maxButtons?: number;
  /** 是否为树形展开td */
  treeExpand?: boolean;
  /** td样式 */
  tdStyle?: (data: any, rowIndex: number, column: TableColumn) => { [key: string]: string };
  /** th样式 */
  thStyle?: (column: TableColumn) => { [key: string]: string };
  /** 是否是最后一个左侧固定列（用于显示阴影） */
  isLastLeftFixed?: boolean;
  /** 是否是第一个右侧固定列（用于显示阴影） */
  isFirstRightFixed?: boolean;
}

/** 表格大小 */
export type TableSize = 'default' | 'middle' | 'small';

/** 表格列筛选条件 */
export interface TableColumnFilterCondition {
  value: TableFiltterCondition;
  label: string;
}

/** 表格列筛选条件 */
export enum TableFiltterCondition {
  /** 等于 */
  EQUAL = 'equal',
  /** 不等于 */
  NOT_EQUAL = 'notEqual',
  /** 大于 */
  GREATER_THAN = 'greaterThan',
  /** 小于 */
  LESS_THAN = 'lessThan',
  /** 大于等于 */
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  /** 小于等于 */
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  /** 在 */
  IN = 'in',
  /** 不在 */
  NOT_IN = 'notIn',
  /** 在之间 */
  BETWEEN = 'between',
  /** 不在之间 */
  NOT_BETWEEN = 'notBetween',
  /** 为空 */
  IS_NULL = 'isNull',
  /** 不为空 */
  IS_NOT_NULL = 'isNotNull',
}

/** 默认表格筛选条件 */
export const defaultTableFilterConditions = [
  {
    value: TableFiltterCondition.EQUAL,
    label: '等于',
  },
  {
    value: TableFiltterCondition.NOT_EQUAL,
    label: '不等于',
  },
  {
    value: TableFiltterCondition.IS_NULL,
    label: '为空',
  },
  {
    value: TableFiltterCondition.IS_NOT_NULL,
    label: '不为空',
  },
  {
    value: TableFiltterCondition.GREATER_THAN,
    label: '大于',
  },
  {
    value: TableFiltterCondition.LESS_THAN,
    label: '小于',
  },
  {
    value: TableFiltterCondition.GREATER_THAN_OR_EQUAL,
    label: '大于等于',
  },
  {
    value: TableFiltterCondition.LESS_THAN_OR_EQUAL,
    label: '小于等于',
  },
  {
    value: TableFiltterCondition.IN,
    label: '在',
  },
  {
    value: TableFiltterCondition.NOT_IN,
    label: '不在',
  },
  {
    value: TableFiltterCondition.BETWEEN,
    label: '介于',
  },
  {
    value: TableFiltterCondition.NOT_BETWEEN,
    label: '不介于',
  },
]

/** 自定义选择项 */
export interface TableCheckedSelections {
  title: string;
  onSelect: (data: any) => void;
}

/** 表格刷新事件 */
export interface TableRefreshEvent {
  /** 分页 */
  pagination: {
    /** 页码 */
    pageIndex: number;
    /** 每页条数 */
    pageSize: number;
    /** 总条数 */
    total: number;
  };
  /** 排序 */
  sort: {
    /** 字段 */
    field: string;
    /** 排序方向 */
    order: 'ascend' | 'descend' | null;
  } | null;
  /** 筛选 */
  filters: { [key: string]: any };
  /** 虚拟滚动 */
  virtualScroll?: {
    /** 是否启用 */
    enabled: boolean;
    /** 高度 */
    height: number;
    /** 每行高度 */
    itemSize: number;
  } | null;
}

/** 表格虚拟滚动配置 */
export interface TableVirtualScrollConfig {
  /** 虚拟滚动视口高度 */
  height: number;
  /** 每一行的高度 */
  itemSize: number;
  /** 缓冲区最小像素值 */
  minBufferPx?: number;
  /** 缓冲区最大像素值 */
  maxBufferPx?: number;
}

/** 表格数据 */
export interface TableData {
  [key: string]: any;
  /** 子数据 */
  children?: TableData[];
}

