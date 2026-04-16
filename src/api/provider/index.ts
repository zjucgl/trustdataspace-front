import { http } from "@/utils/http";

export type ProviderConfigData = {
  id?: number;
  deptId?: number;
  providerName?: string;
  providerLabel?: string;
  participantId?: string;
  controlplaneMgmtPort?: number;
  controlplaneProtocolPort?: number;
  controlplanePublicPort?: number;
  dataplanePublicPort?: number;
  identityHubPort?: number;
  stsPort?: number;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbReadonlyUser?: string;
  dbReadonlyPwd?: string;
  deployHost?: string;
  status?: string;
  remark?: string;
  deptName?: string;
};

export const getProviderList = () => {
  return http.request<OperateResult<ProviderConfigData[]>>(
    "post",
    "/provider/list"
  );
};

export const addProvider = (data: ProviderConfigData) => {
  return http.request<OperateResult<number>>("post", "/provider/add", {
    data
  });
};

export const getProviderDetail = (id: number) => {
  return http.request<OperateResult<ProviderConfigData>>(
    "get",
    `/provider/detail/${id}`
  );
};

export const updateProvider = (data: ProviderConfigData) => {
  return http.request<OperateResult<null>>("post", "/provider/update", {
    data
  });
};

export const removeProvider = (id: number) => {
  return http.request<OperateResult<null>>("post", `/provider/remove/${id}`);
};

export const downloadDeployScript = (id: number) => {
  window.open(`/api/provider/deploy-script/${id}`, "_blank");
};
