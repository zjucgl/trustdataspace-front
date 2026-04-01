import { http } from "@/utils/http";

export type PersonalAssetParam = {
  assetId?: string;
};
export type PersonalAssetData = {
  assetId: string;
  participantId?: string;
  endpointURL?: string;
  userId?: number;
  userName?: string;
  authorization?: string;
  gmtCreate?: any;
  imgUrl?: string;
  fileType?: string;
  ownerAssetHistory?: Array<string>;
};

/** 获取个人资产列表 */
export const getPersonalAssetPage = (data?: object) => {
  return http.request<OperateResult<TableData<PersonalAssetData>>>(
    "post",
    "personalAsset/list",
    { data }
  );
};
/** 判断资产是否存在 */
export const personalAssetIsExist = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>("post", `/personalAsset/isExist`, {
    data
  });
};
/** 判断资产是否为自己的 */
export const personalAssetIsProvider = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>("post", `/personalAsset/isProvider`, {
    data
  });
};
/** 新增个人资产 */
export const addPersonalAsset = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>("post", `/personalAsset/add`, {
    data
  });
};
/** 获取热门资产排行 */
export const getHotAsset = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>("post", `/personalAsset/hotAsset`, {
    data
  });
};
/** 获取资产图表 */
export const getAssetChart = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>("post", `/personalAsset/assetChart`, {
    data
  });
};
/** 获取交易资产 */
export const getAssetListCount = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>(
    "post",
    `/personalAsset/assetListCount`,
    {
      data
    }
  );
};
/** 获取我消费的资产 */
export const getAssetListByUser = (data?: PersonalAssetData) => {
  return http.request<OperateResult<any>>(
    "post",
    `/personalAsset/assetListByUser`,
    {
      data
    }
  );
};
/** 获取资产流转记录 */
export const getAssetHistory = (data?: string) => {
  return http.request<any>("get", `/trace/getAssetHistory${data}`);
};
