import { http } from "@/utils/http";

export type DeptParam = {
  deptName: string;
  deptStatus: string;
};
export type DeptData = {
  higherDeptOptions?: any;
  deptId: number;
  deptName?: string;
  deptStatus?: number;
  deptInfo?: string;
  deptSort?: number;
  deptFather?: number;
  children?: DeptData[];
  leaf?: boolean;
  label?: string; // 添加 label 属性
  value?: number; // 添加 value 属性
};

export const getDeptPage = () => {
  return http.request<OperateResult<DeptData[]>>("post", "/dept/tree");
};

export const saveDept = (data?: DeptData) => {
  return http.request<OperateResult<any>>("post", `/dept/${data.deptId ? "modify" : "add"}`, {
    data
  });
};

export const removeDept = (data?: { ids: number[] }) => {
  return http.request<OperateResult<any>>("post", "/dept/remove", { data });
};

export const queryParticipantCount = (data?: any) => {
  return http.request<OperateResult<number>>("post", "/dept/participantCount", { data });
};