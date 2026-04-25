import { useUserStoreHook } from "@/store/modules/user";
import { computed } from "vue";

// 添加 definitoinMap
export const definitoinMap = new Map([
  ["require-membership", "需要会员身份"],
  ["require-dataprocessor", "需要通用权限"],
  ["require-sensitive", "需要敏感权限"]
]);

export const participantId = computed(() => useUserStoreHook()?.participantId);

export function getParticipantWebIp(): any {
  const did = useUserStoreHook()?.participantId;
  const ipPattern = /(?<=did:web:)[^%]+/; // 正则表达式匹配did:web:后的IP地址部分
  const ip = did.match(ipPattern)[0];
  return ip;
}
export function getParticipantType(): any {
  const store = useUserStoreHook();
  // 优先使用 store 中的 providerName（由后端 provider_config 提供）
  const providerName = store?.providerName;
  if (providerName) {
    return providerName;
  }
  // 回退：根据 DID 判断
  const did = store?.participantId;
  if (!did) {
    console.log("participantId is not available");
    return "consumer";
  }
  const ipPattern = /(?<=did:web:)[^%]+/;
  const matchResult = did.match(ipPattern);
  if (!matchResult) {
    console.log("No match found for IP pattern in participantId");
    return "consumer";
  }
  const ip = matchResult[0];
  if (ip === "192.168.14.3") {
    return "consumer";
  } else {
    return "providerQA";
  }
}
