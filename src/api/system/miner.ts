import { http } from "@/utils/http";

export type LogParam = {
  //前端传给后端的参数
  userId?: number;
  userName?: number;
  status?: number;
  amount?: number;
};
export type LogData = {
  id: number; // 注意这里是id不是logId
  fromId?: number | null;
  userId: number;
  userName: string;
  amount: number;
  txHash?: string | null;
  rechargeTime: string; // 保持为字符串，由前端格式化
  status: number; // 0-待审核 1-通过 2-不通过
};

export const startMining = (data?: any) => {
  return http.request<boolean>("post", "/eth/start", {
    data
  });
};

export const stopMining = (data?: any) => {
  return http.request<boolean>("post", "/eth/stop", {
    data
  });
};

export const getBalance = (data?: any) => {
  return http.request<number>("post", "/eth/balance", {
    data
  });
};
export const getBlockNumber = (data?: any) => {
  return http.request<number>("post", "/eth/get/BlockNumber", {
    data
  });
};
