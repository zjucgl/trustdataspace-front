import { http } from "@/utils/http";
import { getParticipantType } from "@/utils/mvd";

export type AssetSourceType = "HttpData" | "AmazonS3" | "JdbcDataAddress";

export const ASSET_SOURCE_TYPES: ReadonlyArray<AssetSourceType> = [
  "HttpData",
  "AmazonS3",
  "JdbcDataAddress"
];

export type AssetData = {
  id?: string;
  description?: string;
  contractdefinition?: string;
  sourceType?: AssetSourceType;
  baseUrl?: string;
  s3Endpoint?: string;
  s3Bucket?: string;
  s3ObjectName?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  jdbcUrl?: string;
  jdbcUser?: string;
  jdbcPassword?: string;
  jdbcTable?: string;
};
export type DefinitionData = {
  id?: string;
  accessPolicyId?: string;
  contractPolicyId?: string;
  assetId?: string;
  policyList?: Array<any>;
};
export const getAssetList = (data?: any) => {
  return http.request<any>(
    "post",
    getParticipantType() + "/management/v3/assets/request",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const creatAsset = (data?: any) => {
  return http.request<any>(
    "post",
    getParticipantType() + "/management/v3/assets",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const updateAsset = (data?: any) => {
  return http.request<any>(
    "put",
    getParticipantType() + "/management/v3/assets",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
export const removeAsset = (data?: any) => {
  return http.request<any>(
    "delete",
    getParticipantType() + "/management/v3/assets/" + data,
    {
      headers: {
        "X-Api-Key": "password"
      }
    }
  );
};
export const creatContractdefinitions = (data?: any) => {
  return http.request<any>(
    "post",
    getParticipantType() + "/management/v3/contractdefinitions",
    {
      headers: {
        "X-Api-Key": "password"
      },
      data: data
    }
  );
};
