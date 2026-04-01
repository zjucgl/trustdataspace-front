import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { storageSession } from "@pureadmin/utils";
import {
  type UserResult,
  type RefreshTokenResult,
  type Role,
  getLogin,
  getKaptcha,
  refreshTokenApi
} from "@/api/system/login";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import { message } from "@/utils/message";
import { setRoleList, roleSessionKey } from "@/utils/role";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<any>>(userKey)?.roles ?? [],
    // 角色数组
    roleList: storageSession().getItem<Role[]>(roleSessionKey) ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
    // 部门id
    deptId: storageLocal().getItem<DataInfo<number>>(userKey)?.deptId ?? null,
    // 部门名称
    deptName: storageLocal().getItem<DataInfo<string>>(userKey)?.deptName ?? "",
    // 参与者Id
    participantId:
      storageLocal().getItem<DataInfo<string>>(userKey)?.participantId ?? ""
  }),
  actions: {
    /** 获取验证码 */
    async getKaptchaCode() {
      return new Promise<any>((resolve, reject) => {
        getKaptcha()
          .then(data => {
            if (data) {
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<any>) {
      this.roles = roles;
    },
    /** 存储角色数组 */
    SET_ROLELIST(roleList: Array<Role>) {
      this.roleList = roleList;
    },
    /** 存储部门id */
    SET_DEPTID(deptId: number) {
      this.deptId = deptId;
    },
    /** 存储部门名称 */
    SET_DEPTNAME(deptName: string) {
      this.deptName = deptName;
    },
    /** 存储参与者Id */
    SET_PARTICIPANTID(participantId: string) {
      this.participantId = participantId;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        // const data: any = {
        //   success: true,
        //   result: {
        //       username: "管理员",
        //       pwdExpire: false,
        //       userId: null,
        //       roles: [
        //         {
        //           roles: ["admin"],
        //           roleName: "管理员",
        //           deptId: 1,
        //           deptName: "浙大宁波理工学院",
        //           userId: 1,
        //           username: "管理员",
        //           nickname: "管理员",
        //           avatar: "https://avatars.githubusercontent.com/u/44761321",
        //           accessToken:
        //             "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZWVkIjoie1wicm9sZUNvZGVzXCI6W1wiYWRtaW5cIl0sXCJyb2xlc1wiOltcIkFkbWluXCJdLFwidXNlcklkXCI6MX0iLCJleHAiOjE3MzYwNzczMzQsImlhdCI6MTczNjA2MjkzNH0.YCIr8mANlmd-vE9-NCwp2j0Yo0CcG7kP2cBorSsicrA",
        //           refreshToken:
        //             "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZWVkIjoie1wicm9sZUNvZGVzXCI6W1wiYWRtaW5cIl0sXCJyb2xlc1wiOltcIkFkbWluXCJdLFwidXNlcklkXCI6MX0iLCJleHAiOjE3MzYwOTE3MzQsImlhdCI6MTczNjA2MjkzNH0.yqvHnrvhSsQotLY_vttNZUQcUt-xIMoQKtND-8HJH_Y",

        //         },
        //         {
        //           roles: ["user"],
        //           roleName: "用户",
        //           deptId: 1,
        //           deptName: "浙大宁波理工学院",
        //           userId: 1,
        //           username: "管理员",
        //           nickname: "管理员",
        //           avatar: "https://avatars.githubusercontent.com/u/44761321",
        //           accessToken:
        //             "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZWVkIjoie1wicm9sZUNvZGVzXCI6W1widXNlclwiXSxcInJvbGVzXCI6W1wiVXNlclwiXSxcInVzZXJJZFwiOjF9IiwiZXhwIjoxNzM2MDc3MzM0LCJpYXQiOjE3MzYwNjI5MzR9.LflAZSjkF7tGZBciUr5Bbl1FK2jHK735tFxLUT3yCEA",
        //           refreshToken:
        //             "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZWVkIjoie1wicm9sZUNvZGVzXCI6W1widXNlclwiXSxcInJvbGVzXCI6W1wiVXNlclwiXSxcInVzZXJJZFwiOjF9IiwiZXhwIjoxNzM2MDkxNzM0LCJpYXQiOjE3MzYwNjI5MzR9.uhTUwG8ePd6xaXUWNYM3BNj7QBbpFP6e_5ClR50euRI",
        //           expires: "2025-01-05 19:42:14"
        //         }
        //       ]
        //   },
        //   message: "登录成功"
        // }

        // setRoleList(data.result.roles);
        // const role = data.result.roles[0];
        // setToken(role);
        // resolve(data);
        getLogin(data)
          .then(data => {
            // console.log("Data=", data);
            if (data?.success) {
              console.log("data.result.roles=", data.result.roles);
              setRoleList(data.result.roles);
              const role = data.result.roles[0];
              console.log("role=", role);
              setToken(role);
            } else {
              message(data.message, { type: "error" });
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      //router.push("/login");
      router.push("/index");
    },
    /** 前端登出（不调用接口） */
    logOutToLogin() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.result);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setRoles(role) {
      return new Promise<any>((resolve, reject) => {
        try {
          setToken(role);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
