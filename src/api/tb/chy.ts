import { http } from "@/utils/http";

export type ChyParam = {
  chyId?: number;
  chySerialNumber: string;
};
export type ChyData = {
  chyId: number;
  chySerialNumber?: string;
  payloadSlot?: number;
  payloadNum?: number;
  payloadValue?: number;
  uploadTime?: any;
  createTime?: any;
};
export type ChyDataCard = {
  chySerialNumber?: string;
  uploadTime?: any;
  dataList?: Array<ChyData>;
};
export type DeviceData = {
  deviceId?: number;
  deviceSn?: string;
  deviceInfo?: string;
};

export const getChyPage = (data?:any) => {
  return http.request<OperateResult<Array<ChyDataCard>>>("post", "/chy/list", {data});
};
export const getDeviceList = (data?:any) => {
  return http.request<OperateResult<Array<DeviceData>>>("post", "/chy/deviceList", {data});
};
//导出
export const exportExcel = (data: { chySerialNumber: string }) => {
  return http.request<any>(
    "get",
    "/chy/export",
    {
      data
    },
    { responseType: "blob" }
  );
};