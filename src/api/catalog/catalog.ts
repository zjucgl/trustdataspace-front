import { http } from "@/utils/http";
//const webType = getParticipantType();
const webType = "consumer";
export type LogParam = {
  logStatus?: string;
  logContent?: string;
  userId?: number;
};
export type CatalogData = {
  id?: string;
  endpointURL?: string;
  participantId?: string;
  policyAssetId?: string;
  step?: number;
};

export const getCachedCatalogList = (data?: any) => {
  return http.request<any>("post", webType + "/catalog/v1alpha/catalog/query", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};

export const initiateNegotiation = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/contractnegotiations",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const getContractNegotiation = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/contractnegotiations/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const initiateTransfer = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/transferprocesses",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const getTransferProcess = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/transferprocesses/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const getCacheEDRs = (data?: any) => {
  return http.request<any>("post", webType + "/management/v3/edrs/request", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};
export const getEDRDataAddressForTransferId = (data?: any) => {
  return http.request<any>(
    "get",
    webType + "/management/v3/edrs/" + data?.transferProcessId + "/dataaddress",
    {
      headers: {
        "X-Api-Key": "password"
      }
    }
  );
};
export const downloadDataFromPublic = (data?: any) => {
  return http.request<any>("get", webType + "/public", {
    headers: {
      "X-Api-Key": "password",
      authorization: data.authorization
    },
    responseType: "blob"
  });
};

export const checkBalance = (data?: any) => {
  return http.request<any>("post", `/eth/check/balance?assetId=${data}`);
};
// export const getPolicyDefinitionList = (data?:any) => {
//   return http.request<any>("post", "consumer/catalog/v1alpha/catalog/query", {
//     headers: {
//       "X-Api-Key": "password"
//     },
//     data: data
//   });
// };
