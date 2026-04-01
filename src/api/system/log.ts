import { http } from "@/utils/http";

export type LogParam = {
  logStatus?: string;
  logContent?: string;
  userId?: number;
};
export type LogData = {
  logId: number;
  logType?: string;
  userId?: number;
  userName?: string;
  logContent?: string;
  logStatus?: string;
  logSource?: string;
  gmtCreate?: any;
};

export const getLogPage = (data?: any) => {
  return http.request<OperateResult<TableData<LogData>>>("post", "/log/list", {
    data
  });
};
