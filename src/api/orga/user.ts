import { http } from "@/utils/http";

export type UserParam = {
  userName: string;
  userPhone: string;
  userStatus?: number;
  deptIds?: any;
};
export type UserData = {
  /** 用户Id */
  userId: number;
  /** 用户账号 */
  loginCode?: string;
  /** 用户密码 */
  loginPwd?: string;
  newPwd?: string;
  newPwdCheck?: string;
  /** 用户名称 */
  userName?: string;
  /** 用户电话 */
  userPhone?: string | number;
  /** 用户备注 */
  userInfo?: string;
  /** 部门Id */
  deptId?: number;
  /** 部门名称 */
  deptName?: string;
  /** 参与者标识符 */
  participantId?: string;
  /** 参与者ID */
  participantKeyId?: number;
  /** 角色id数组 */
  roleIdList?: Array<string>;
  /** 审核状态 */
  verifyStatus?: number;
};
export type UserInformationData = {
  userId: number;
  loginCode?: string;
  loginPwd?: string;
  newPwd?: string;
  newPwdCheck?: string;
  userName?: string;
  userPhone?: string | number;
  userInfo?: string;
  deptName?: string;
  testNameList?: Array<string>;
  roleNameList?: Array<string>;
};
export type RoleData = {
  userId: number;
  roleOptions: RoleOptions[];
  roleIdList: Array<number>;
  roleName?: string;
};

export type PasswordData = {
  userId?: number;
  newPwd?: string;
  newPwdCheck?: string;
  loginPwd?: string;
};

export type RoleOptions = {
  roleName: string;
  roleCode: string;
};

export type UserOptionData = {
  userId: number;
  userName: string;
};

/** 获取用户管理列表 */
export const getUserPage = (data?: object) => {
  return http.request<OperateResult<TableData<UserData>>>("post", "user/list", {
    data
  });
};
/** 获取用户管理列表 */
export const getUserPageByRoot = (data?: object) => {
  return http.request<OperateResult<TableData<UserData>>>(
    "post",
    "user/listByRoot",
    { data }
  );
};
/** 获取角色列表 */
export const getRoleOption = () => {
  return http.request<OperateResult<Array<RoleOptions>>>(
    "post",
    "user/roleOption"
  );
};
/** 获取用户选项 */
export const getUserOption = (data?: object) => {
  return http.request<OperateResult<UserOptionData[]>>(
    "post",
    "user/userOption",
    {
      data
    }
  );
};
/** 获取参与者选项 */
export const getParticipantOption = (data?: object) => {
  return http.request<OperateResult<UserOptionData[]>>(
    "post",
    "user/participantOption",
    {
      data
    }
  );
};
/** 通过角色代码获取拥有对应角色的用户选项 */
export const getUserOptionByCode = (data?: string) => {
  return http.request<OperateResult<UserOptionData[]>>(
    "post",
    "user/userOptionByCode",
    {
      data
    }
  );
};
/** 修改/新增用户 */
export const saveUser = (data?: UserData) => {
  return http.request<OperateResult<any>>(
    "post",
    `/user/${data.userId ? "modify" : "add"}`,
    {
      data
    }
  );
};
/** 修改密码 */
export const saveUserPassword = (data?: UserInformationData) => {
  return http.request<OperateResult<any>>("post", "/user/modifyPassword", {
    data
  });
};
/** 修改角色标识 */
export const saveUserRoleCode = (data?: UserData) => {
  return http.request<OperateResult<any>>("post", "/user/modifyRoleCode", {
    data
  });
};
/** 账号是否存在 */
export const codeIsExist = (data?: UserData) => {
  return http.request<OperateResult<boolean>>("post", "/user/codeIsExist", {
    data
  });
};
/** 删除用户 */
export const removeUser = (data?: { ids: number[] }) => {
  return http.request<OperateResult<any>>("post", "/user/remove", { data });
};

/** 获取强制密码更新功能状态 */
export const getPwdFunction = () => {
  return http.request<OperateResult<any>>("post", "user/getPwdFunction");
};
/** 修改强制密码更新功能状态 */
export const changePwdUpdate = () => {
  return http.request<OperateResult<any>>("post", "user/updatePwdFunction");
};
