import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
const webType = getParticipantType();
export type DidData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getDidList = (data?: any) => {
  return http.request<any>("post", webType + "/identity/v1alpha/participants/BPN0000001/dids/query", {
    headers: {
      "X-Api-Key": "c3VwZXItdXNlcg==.c3VwZXItc2VjcmV0LWtleQo="
    },
    data:data
  });
};
