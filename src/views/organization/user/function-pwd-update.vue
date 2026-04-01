<template>
  <el-dialog
    :title="'操作密码强制更新'"
    center
    :model-value="visible"
    :show-close="false"
    :close-on-press-escape="false"
    @close="close"
    width="400"
  >
    <div class="mt-4 mb-4 w-full justify-center">
      <span style="font-size: 16px; margin-right: 16px; color: #303133"
        >功能状态：</span
      >
      <el-switch
        v-model="data.functionStatus"
        size="large"
        :loading="changeLoading"
        :active-value="1"
        :inactive-value="0"
        :before-change="change"
      />
    </div>

    <template #footer>
      <el-button type="primary" @click="close"> 关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getPwdFunction, changePwdUpdate } from "@/api/orga/user";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";

const emit = defineEmits(["update:visible"]);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
const loading = ref(false);
const changeLoading = ref(false);
const data = ref<any>({
  functionStatus: 0
});

// watch(
//   () => props.visible,
//   visible => {
//     if (visible) {
//       Object.assign(form, props.data);
//     }
//   }
// );
//查询
const setTableData = () => {
  loading.value = true;
  getPwdFunction()
    .then(({ result }) => {
      data.value = result;
      // console.log("res=", res);
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();
const close = () => {
  emit("update:visible", false);
};
const change = () => {
  changeLoading.value = true;
  changePwdUpdate()
    .then(res => {
      if (res.success) {
        showSuccessMessage("修改成功");
      } else {
        showErrorMessage(res.message);
      }
      setTableData();
      changeLoading.value = false;
      return res.success;
    })
    .catch(showErrorMessage);
  return false;
  // console.log("data=", data);
};
</script>

<style scpoed>
.el-progress-bar {
  width: 370px;
}
</style>
