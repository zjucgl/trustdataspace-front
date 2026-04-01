import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
const webType = getParticipantType();
export type ParticipantData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getParticipantList = (data?: any) => {
  return http.request<any>("get", webType + "/identity/v1alpha/participants", {
    headers: {
      "X-Api-Key": "c3VwZXItdXNlcg==.c3VwZXItc2VjcmV0LWtleQo="
    },
  });
};
export const creatParticipant = (data?: any) => {
  return http.request<any>("post", webType + "/identity/v1alpha/participants/", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};