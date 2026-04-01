import { http } from "@/utils/http";
// import { getParticipantType } from "@/utils/mvd";
// const webType = getParticipantType();
const providerType = "providerQA";
export type AssetData = {
  id?: string;
  baseUrl?: string;
  description?: string;
  contractdefinition?: string;
};
export type DefinitionData = {
  id?: string;
  accessPolicyId?: string;
  contractPolicyId?: string;
  assetId?: string;
  policyList?: Array<any>;
};
export const getAssetList = (data?: any) => {
  return http.request<any>(
    "post",
    providerType + "/management/v3/assets/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const creatAsset = (data?: any) => {
  return http.request<any>("post", providerType + "/management/v3/assets", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};
export const updateAsset = (data?: any) => {
  return http.request<any>("put", providerType + "/management/v3/assets", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};
export const removeAsset = (data?: any) => {
  return http.request<any>(
    "delete",
    providerType + "/management/v3/assets/" + data,
    {
      headers: {
        "X-Api-Key": "password"
      }
    }
  );
};
export const creatContractdefinitions = (data?: any) => {
  return http.request<any>(
    "post",
    providerType + "/management/v3/contractdefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
