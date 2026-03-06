/**
 * 招标采购通用类型定义
 * @module modules/bidding/types/common
 */

/**
 * 下拉选项接口
 */
export interface ISelectOption {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * API 响应接口
 */
export interface IApiResponse<T = any> {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data?: T;
}
