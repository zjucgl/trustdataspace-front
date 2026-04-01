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
  const did = useUserStoreHook()?.participantId;
  if (!did) {
    // 如果did是null或undefined，返回一个默认值或者抛出一个错误
    console.log("participantId is not available");
    return "consumer";
  }
  const ipPattern = /(?<=did:web:)[^%]+/; // 正则表达式匹配did:web:后的IP地址部分
  const matchResult = did.match(ipPattern);
  if (!matchResult) {
    console.log("No match found for IP pattern in participantId");
    return "consumer";
  }
  const ip = matchResult[0];
  //console.log("IP address of participant is:", ip);
  if (ip === "192.168.14.3") {
    return "consumer";
  } else {
    return "providerQA";
  }
}
