import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
// const webType = getParticipantType();
const webType = "providerQA";
export type PolicyData = {
  id?: string;
  permission?: string;
  prohibition?: string;
  obligation?: any;
};
export const getPolicyList = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/policydefinitions/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};

export const getPolicyById = (data?: any) => {
  return http.request<any>(
    "get",
    webType + `/management/v3/policydefinitions/${data}`,
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};

export const createPolicy = (data?: any) => {
  return http.request<any>(
    "post",
    webType + "/management/v3/policydefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};

export const updatePolicy = (data?: any) => {
  return http.request<any>(
    "put",
    webType + "/management/v3/policydefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};

export const deletePolicy = (data?: any) => {
  return http.request<any>(
    "delete",
    webType + `/management/v3/policydefinitions/${data}`,
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
