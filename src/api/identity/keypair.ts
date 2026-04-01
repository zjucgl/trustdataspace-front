import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
const webType = getParticipantType();
export type KeyPairData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getKeyPairsList = (data?: any) => {
  return http.request<any>("get", webType + "/identity/v1alpha/keypairs", {
    headers: {
      "X-Api-Key": "c3VwZXItdXNlcg==.c3VwZXItc2VjcmV0LWtleQo="
    },
  });
};
export const addKeyPair = (data?: any) => {
  return http.request<any>("put", webType + "/identity/v1alpha/participants/" + data.participantId + "/keypairs", {
    headers: {
      "X-Api-Key": "password"
    },
    data: data
  });
};