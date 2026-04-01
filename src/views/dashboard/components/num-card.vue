<template>
  <el-card
    style="
      width: 100%;
      justify-items: center;
      align-items: center;
      text-align: center;
    "
    body-style="padding: 10px"
  >
    <!-- <template #header>
      <div class="card-header">
        <span>{{ data.name }}</span>
      </div>
    </template> -->
    <div style="font-size: 16px">{{ data.name }}</div>
    <div :style="`font-size: ${props.fontSize}; color: #1e90ff`">
      {{ data.value }}
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
defineOptions({
  name: "numCard"
});
const emit = defineEmits(["update:visible"]);
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      name: "待载入",
      value: 0
    })
  },
  visible: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: String,
    default: "32px"
  }
});
// const data = reactive<any>({
//   name: "待载入",
//   value: 0
// });
// watch(
//   () => props.visible,
//   visible => {
//     if (visible) {
//       Object.assign(data, props.data);
//     }
//   }
// );
</script>

<style lang="scss" scoped></style>
