import { http } from "@/utils/http";

export type nodeInfo = {
  id: number;
  name: string;
  amount: number;
  encode: string;
}[];

export const minerList = (data?: any) => {
  return http.request<OperateResult<nodeInfo>>("post", "/eth/get/MinerList", {
    data
  });
};

export const nodeList = (data?: any) => {
  return http.request<OperateResult<nodeInfo>>(
    "post",
    `/eth/get/NodeList?nodeName=${data}`
  );
};

export const addNode = (data?: any) => {
  return http.request<OperateResult<nodeInfo>>("post", "/eth/add/nodeInfo", {
    data
  });
};

export const getUserDeposits = () => {
  return http.request<OperateResult<number>>("get", "/user/getUserDeposits");
};
