/** 消息 */
export interface Message {
  /** 唯一标识 */
  id: string;
  /** 内容 */
  content: string;
  /** 类型 */
  type: 'success' | 'error' | 'warning' | 'info';
}


