import { http } from "@/utils/http";

export type CatalogData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getCatalogList = (data?: any) => {
  return http.request<any>("post", "consumer/management/v3/catalog/request", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};

export const getCachedCatalogList = (data?: any) => {
  return http.request<any>("post", "consumer/catalog/v1alpha/catalog/query", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};
