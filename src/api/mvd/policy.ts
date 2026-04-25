import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";

export type PolicyData = {
  id?: string;
  permission?: string;
  prohibition?: string;
  obligation?: any;
};
export const getPolicyList = (data?: any) => {
  return http.request<any>(
    "post",
    getParticipantType() + "/management/v3/policydefinitions/request",
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
    getParticipantType() + `/management/v3/policydefinitions/${data}`,
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
    getParticipantType() + "/management/v3/policydefinitions",
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
    getParticipantType() + "/management/v3/policydefinitions",
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
    getParticipantType() + `/management/v3/policydefinitions/${data}`,
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
