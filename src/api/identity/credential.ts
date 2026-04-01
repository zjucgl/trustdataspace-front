import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";
const webType = getParticipantType();

export type CredentialData = {
  id?: string;
  baseUrl?: string;
  description?: string;
};
export const getCredentialList = (data?: any) => {
  return http.request<any>("get", webType + "/identity/v1alpha/credentials", {
    headers: {
      "X-Api-Key": "c3VwZXItdXNlcg==.c3VwZXItc2VjcmV0LWtleQo="
    }
  });
};
