import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
const webType = getParticipantType();
export type ContractData = {
  Id: string;
  roleName?: string;
  accessPolicyId?: string;
  contractPolicyId?: string;
  assetId?: string;
  assetsSelector?: Array<any>;
};
export const getContractList = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/contractdefinitions/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
// get contract by id
export const getContractById = (data?: any) => {
  return http.request<any>(
    "get",
    webType+ `/management/v3/contractdefinitions/${data}`,
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
// create contract
export const createContract = (data?: any) => {
  return http.request<any>(
    "post",
    webType+ "/management/v3/contractdefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
// update contract
export const updateContract = (data?: any) => {
  return http.request<any>(
    "put",
    webType+ "/management/v3/contractdefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
// delete contract
export const deleteContract = (data?: any) => {
  return http.request<any>(
    "delete",
    webType+ `/management/v3/contractdefinitions/${data}`,
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
