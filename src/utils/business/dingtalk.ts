/**
 * 钉钉集成业务工具函数
 * @module utils/business/dingtalk
 */

import * as dd from "dingtalk-jsapi"; // 此方式为整体加载，也可按需进行加载
import axios from "axios";

/**
 * 检测是否在钉钉环境中运行
 * @returns 是否在钉钉环境
 */
export const isDingTalkEnvironment = () => {
  if (dd.env.platform === "notInDingTalk") {
    // 这不是钉钉环境
    return false;
  }
  // 这是钉钉环境
  return true;
};

/**
 * 通过钉钉获取访问令牌
 * @returns 访问令牌，非钉钉环境返回空字符串
 */
export const getYusTokenByDD = async () => {
  if (!isDingTalkEnvironment()) {
    return "";
  }
  const corpId = import.meta.env.VITE_CORP_ID;
  let res = await dd.runtime.permission.requestAuthCode({
    corpId,
  });
  const code = res.code;
  let userInfo: any = {};
  userInfo = await axios.get(
    `https://yus.cie-cn.com:7080/api/login/mobile/ajax?code=${code}&client_id=api&scope=read&corpId=${corpId}`
  );
  const token = userInfo.data.access_token;
  return token;
};
