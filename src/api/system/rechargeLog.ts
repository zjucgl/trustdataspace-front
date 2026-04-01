import { http } from "@/utils/http";

export type LogParam = {//前端传给后端的参数
  userId?: number;
  userName?: number;
  status?: number;
  amount?: number;
};
export type LogData = {
  id: number;            // 注意这里是id不是logId
  fromId?: number | null;
  userId: number;
  userName: string;
  amount: number;
  txHash?: string | null;
  rechargeTime: string;  // 保持为字符串，由前端格式化
  status: number;        // 0-待审核 1-通过 2-不通过
};

export const getRechargeLogPage = (data?: any) => {
  return http.request<TableData<LogData>>("post", "/rechargeLog/listById", {
    data
  });
};

export const updateRechargeLog = (data?: any) => {
  return http.request<TableData<LogData>>("post", "/rechargeLog/update", {
    data
  });
};

export const addRechargeLog = (data?: any) => {
  return http.request<TableData<LogData>>("post", "/rechargeLog/add", {
    data
  });
};


