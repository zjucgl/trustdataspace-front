import { http } from "@/utils/http";

export type DeviceParam = {
  deviceSn?: string;
};

export type DeviceData = {
  deviceId?: number;
  deviceSn?: string;
  deviceInfo?: string;
};
export const getDeviceList = (data?:any) => {
  return http.request<OperateResult<TableData<DeviceData>>>("post", "/device/list", {data});
};
export const saveDevice = (data?: DeviceData) => {
  return http.request<OperateResult<any>>("post", `/device/${data.deviceId ? "modify" : "add"}`, {
    data
  });
};
export const removeDevice = (data?: { ids: number[] }) => {
  return http.request<OperateResult<any>>("post", "/device/remove", { data });
};
