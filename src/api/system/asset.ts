import { http } from "@/utils/http";

export type SystemAssetData = {
  id?: number;
  assetId?: string;
  assetQuantity?: number;
  assetPrice?: number;
  assetDescription?: string;
  userId?: number;
};

/** 获取系统资产列表 */
export const getSystemAssetList = (data?: object) => {
  return http.request<OperateResult<Array<SystemAssetData>>>(
    "get",
    "asset/queryAsset",
    { data }
  );
};
/** 联邦目录获取系统资产列表 */
export const getAssetByCatalog = (data?: object) => {
  return http.request<OperateResult<Array<SystemAssetData>>>(
    "get",
    "asset/queryAssetByCatalog",
    { data }
  );
};
/** 更新系统资产合约状态 */
export const updateHasPolicy = (data?: object) => {
  return http.request<OperateResult<any>>("post", "asset/updateHasPolicy", {
    data
  });
};
/** 创建系统资产 */
export const createSystemAsset = (data?: object) => {
  return http.request<OperateResult<any>>("post", "asset/createAsset", {
    data
  });
};
/** 删除系统资产 */
export const deleteSystemAsset = (data?: object) => {
  return http.request<OperateResult<any>>("post", "asset/deleteAsset", {
    data
  });
};
/** 获取资产通过用户id */
export const queryAssetByUserId = (data?: object) => {
  return http.request<OperateResult<any>>("post", "asset/queryAssetByUserId", {
    data
  });
};
/** 数据概览获取资产 */
export const queryAssetByBoard = (data?: object) => {
  return http.request<OperateResult<any>>("post", "asset/queryAssetByBoard", {
    data
  });
};
