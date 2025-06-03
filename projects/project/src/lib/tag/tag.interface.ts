/** 颜色类型 */
export interface ColorType {
  color: string;
  background: string;
  borderColor: string;
}

/** 预设颜色 */
export const presetColors: Record<string, { default: ColorType, inverse: ColorType }> = {
  default: {
    default: { background: '#1890ff', color: '#fff', borderColor: '#1890ff' },
    inverse: { background: '#fff', color: '#000', borderColor: '#d9d9d9' }
  },
  pink: {
    default: { color: '#c41d7f', background: '#fff0f6', borderColor: '#ffadd2' },
    inverse: { color: '#fff', background: '#eb2f96', borderColor: '#eb2f96' }
  },
  magenta: {
    default: { color: '#c41d7f', background: '#fff0f6', borderColor: '#ffadd2' },
    inverse: { color: '#fff', background: '#eb2f96', borderColor: '#eb2f96' }
  },
  red: {
    default: { color: '#cf1322', background: '#fff1f0', borderColor: '#ffa39e' },
    inverse: { color: '#fff', background: '#f5222d', borderColor: '#f5222d' }
  },
  volcano: {
    default: { color: '#d4380d', background: '#fff2e8', borderColor: '#ffbb96' },
    inverse: { color: '#fff', background: '#fa541c', borderColor: '#fa541c' }
  },
  orange: {
    default: { color: '#d46b08', background: '#fff7e6', borderColor: '#ffd591' },
    inverse: { color: '#fff', background: '#fa8c16', borderColor: '#fa8c16' }
  },
  yellow: {
    default: { color: '#d4b106', background: '#feffe6', borderColor: '#fffb8f' },
    inverse: { color: '#fff', background: '#fadb14', borderColor: '#fadb14' }
  },
  gold: {
    default: { color: '#d48806', background: '#fffbe6', borderColor: '#ffe58f' },
    inverse: { color: '#fff', background: '#faad14', borderColor: '#faad14' }
  },
  cyan: {
    default: { color: '#08979c', background: '#e6fffb', borderColor: '#87e8de' },
    inverse: { color: '#fff', background: '#13c2c2', borderColor: '#13c2c2' }
  },
  lime: {
    default: { color: '#7cb305', background: '#fcffe6', borderColor: '#eaff8f' },
    inverse: { color: '#fff', background: '#a0d911', borderColor: '#a0d911' }
  },
  green: {
    default: { color: '#389e0d', background: '#f6ffed', borderColor: '#b7eb8f' },
    inverse: { color: '#fff', background: '#52c41a', borderColor: '#52c41a' }
  },
  blue: {
    default: { color: '#096dd9', background: '#e6f7ff', borderColor: '#91d5ff' },
    inverse: { color: '#fff', background: '#1890ff', borderColor: '#1890ff' }
  },
  geekblue: {
    default: { color: '#1d39c4', background: '#f0f5ff', borderColor: '#adc6ff' },
    inverse: { color: '#fff', background: '#2f54eb', borderColor: '#2f54eb' }
  },
  purple: {
    default: { color: '#531dab', background: '#f9f0ff', borderColor: '#d3adf7' },
    inverse: { color: '#fff', background: '#722ed1', borderColor: '#722ed1' }
  }
}

/** 标签颜色 */
export type TagColor = 'primary' | 'success' | 'warning' | 'danger' | 'pink' | 'magenta' | 'red' | 'volcano' | 'orange' | 'yellow' | 'gold' | 'cyan' | 'lime' | 'green' | 'blue' | 'geekblue' | 'purple' | string | ColorType;
