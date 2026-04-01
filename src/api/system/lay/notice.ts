import { http } from "@/utils/http";
import { type ListItem } from "@/layout/components/lay-notice/data";


/** 判断上次密码修改时间是否超过三个月 */
export const pwdCheck = (data?: object) => {
  return http.request<OperateResult<ListItem>>("post", "lay/notice/pwdCheck", { data });
};


