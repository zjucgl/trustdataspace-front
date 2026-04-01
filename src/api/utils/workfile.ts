import { http } from "@/utils/http";

/** 获取文件列表 */
export const getWorkFileList = () => {
  return http.request<OperateResult<Array<any>>>("post", "utils/fileList");
};
/** 获取文件 */
export const getWorkFileByName = (data: any) => {
  return http.request<OperateResult<any>>("post", "utils/fileByName", { data });
};
/** 获取文件列表 */
export const getWorkFileByNameList = (data: any) => {
  return http.request<OperateResult<any>>("post", "utils/fileByNameList", {
    data
  });
};
