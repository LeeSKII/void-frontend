/**
 * API 服务
 * @module modules/bidding/services/api
 */

import type {
  IBiddingFormData,
  ISubmitResponse,
  IUploadResponse,
} from '@/modules/bidding/types';

/**
 * 提交招标表单到后端
 * @param formData 表单数据
 * @returns 提交结果
 */
export const submitBiddingForm = async (
  formData: IBiddingFormData,
): Promise<ISubmitResponse> => {
  try {
    // TODO: 替换为实际的 API 地址
    const apiUrl = "/napi/bidding/submit";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ISubmitResponse = await response.json();
    return result;
  } catch (error) {
    console.error("提交表单失败:", error);
    throw error;
  }
};

/**
 * 上传文件到服务器
 * @param file 文件对象
 * @returns 上传结果，包含文件URL
 */
export const uploadFile = async (file: File): Promise<IUploadResponse> => {
  try {
    // TODO: 替换为实际的 API 地址
    const apiUrl = "/napi/bidding/upload";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: IUploadResponse = await response.json();
    return result;
  } catch (error) {
    console.error("上传文件失败:", error);
    throw error;
  }
};
