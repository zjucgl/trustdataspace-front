<script setup lang="ts">
import { useUserStoreHook } from "@/store/modules/user";
import { reactive, watch } from "vue";
import { useDark } from "@pureadmin/utils";
import { getWatermark, getRole } from "@/utils/role";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const role = getRole();
const { isDark } = useDark();
watch(
  isDark,
  () => {
    font.color = isDark.value
      ? "rgba(255, 255, 255, .15)"
      : "rgba(0, 0, 0, .15)";
  },
  {
    immediate: true
  }
);
console.log("role=", useUserStoreHook()?.roles);
defineOptions({
  name: "Welcome"
});
const goto = () => {
  window.open(
    "https://pure-admin.github.io/pure-admin-doc/pages/introduction/#%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88"
  );
};
</script>

<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="w-full">
      <div class="showContent">
        <span v-if="role === 'consumer'">
          <div class="text pt-24">可信文化数据空间（消费者端）</div>
        </span>
        <span v-else>
          <div class="text pt-24">可信文化数据空间（提供者端）</div>
        </span>
      </div>
    </div>
  </el-watermark>
</template>
<style scoped lang="scss">
.showContent {
  text-align: center; /* 水平居中 */
  .text {
    line-height: 100px; /* 设置为与容器高度相同，垂直居中 */
    height: 100px; /* 容器高度 */
    font-size: 30px;
  }
}
</style>
