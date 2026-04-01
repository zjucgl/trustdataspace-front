import { http } from "@/utils/http";

/** 上传 */
export const uploadToMinio = (data?: any) => {
  return http.request<OperateResult<any>>("post", "utils/minio/upload", {
    data: data,
    headers: { "Content-Type": "multipart/form-data" }
  });
};
