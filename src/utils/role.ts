import { useUserStoreHook } from "@/store/modules/user";
import { computed } from "vue";
import { isString } from "@pureadmin/utils";
import type { Role } from "@/api/system/login";
import { storageSession } from "@pureadmin/utils";

export const roles = computed(() => useUserStoreHook()?.roles);
export const roleList = computed(() => useUserStoreHook()?.roleList);

export function hasRole(value: string | Array<string>): boolean {
  if (!value) return false;
  // 由当前用户信息中roleCode判断是否有对应权限
  const userRole = useUserStoreHook()?.roles[0];
  if (!userRole) return false;
  const isRoles = isString(value)
    ? userRole === value
    : value.includes(userRole);
  return isRoles ? true : false;
}

export const roleSessionKey = "user-roles";
export function setRoleList(roleList: Role[]) {
  useUserStoreHook().SET_ROLELIST(roleList);
  storageSession().setItem(roleSessionKey, roleList);
}

export function getWatermark(): any {
  const username = useUserStoreHook()?.username;
  const userRole = useUserStoreHook()?.roles[0];
  const deptName = useUserStoreHook()?.deptName;
  // let result = "可信文化数据空间-" + deptName;
  let result = deptName + "-" + username;
  return result;
}
export function getRole(): any {
  const userRole = useUserStoreHook()?.roles[0];
  return userRole;
}
export function getDeptId(): any {
  const deptId = useUserStoreHook()?.deptId;
  return deptId;
}
