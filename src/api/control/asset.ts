import { http } from "@/utils/http";

export type AssetData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getAssetList = (data?: any) => {
  return http.request<any>("post", "consumer/management/v3/assets/request", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};
export const creatAsset = (data?: any) => {
  return http.request<any>("post", "consumer/management/v3/assets", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};