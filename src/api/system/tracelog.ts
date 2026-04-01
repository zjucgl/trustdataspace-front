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

export type traceTableData<T> = {
  data: Array<T>;
  pageNo: number;
  pageSize: number;
  totalCount?: number;
  totalPage?: number;
};
export const getTraceLogPage = (data?: any) => {
  return http.request<TableData<LogData>>("post", "/traceLog/listById", {
    data
  });
};
