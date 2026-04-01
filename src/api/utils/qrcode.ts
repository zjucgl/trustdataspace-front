import { http } from "@/utils/http";

/** 获取pdf证书下载 */
export const getQrcode = (data?: any) => {
  return http.request<OperateResult<any>>("get", `/qrcode/1233${data}`);
};
