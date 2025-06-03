/** 日期时间选择器模式 */
export type DateTimerMode = 'year' | 'month' | 'quarter' | 'week' | 'date' | 'time';

/** 日期时间选择器大小 */
export type DateTimerSize = 'large' | 'default' | 'small';

/** 日期时间选择器状态 */
export type DateTimerStatus = 'error' | 'warning' | '' | string;

/** 日期时间选择器选择类型 */
export type DateTimerSelectType = 'single' | 'range';

/** 日期时间选择器范围值 */
export interface RangeValue<T> {
  start: T | null;
  end: T | null;
}