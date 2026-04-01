import { http } from "@/utils/http";

export type RoleParam = {
  roleName?: string;
};
export type RoleData = {
  roleId: number;
  roleName?: string;
  roleCode?: string;
  roleInfo?: string;
  menuList?: Array<any>;
};
export type MenuTree = {
  menuId: number;
  menuName?: string;
  children?: MenuTree[];
};

export const getRolePage = (data?: any) => {
  return http.request<OperateResult<TableData<RoleData>>>(
    "post",
    "/role/list",
    { data }
  );
};
export const getMenuTree = () => {
  return http.request<OperateResult<Array<MenuTree>>>("post", "/role/menuTree");
};
export const getRoleMap = () => {
  return http.request<OperateResult<any>>("post", "/role/roleMap");
};
export const saveRole = (data?: RoleData) => {
  return http.request<OperateResult<any>>(
    "post",
    `/role/${data.roleId ? "modify" : "add"}`,
    {
      data
    }
  );
};
export const saveRolePermission = (data?: RoleData) => {
  return http.request<OperateResult<any>>("post", "/role/modifyPermission", {
    data
  });
};
export const removeRole = (data?: { ids: number[] }) => {
  return http.request<OperateResult<any>>("post", "/role/remove", { data });
};
