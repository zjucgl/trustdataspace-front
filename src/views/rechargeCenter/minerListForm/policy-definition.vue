<template>
  <el-dialog
    :title="'资产合约'"
    center
    width="40%"
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-row :gutter="30">
        <re-col>
          <el-form-item label="节点地址" prop="enode">
            <el-input
              v-model="form.enode"
              clearable
              class="!w-[100%]"
              placeholder="请输入区块链节点地址"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="buttonLoading" @click="save">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import ReCol from "@/components/ReCol";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<any>
  },
  visible: {
    type: Boolean,
    default: false
  }
});
const formRef = ref<FormInstance>();
const buttonLoading = ref(false);
const form = reactive<any>({
  enode: ""
});
//正则
watch(
  () => props.visible,
  visible => {
    if (visible) {
      buttonLoading.value = false;
      Object.assign(form, props.data);
    }
  }
);

const close = () => {
  buttonLoading.value = false;
  //重置表单
  formRef.value.resetFields();
  //重置表单校验
  formRef.value.clearValidate();
  emit("update:visible", false);
};

//表单验证规则
const rules = reactive<FormRules>({
  enode: [{ required: true, message: "请填写节点地址", trigger: "blur" }]
});

const save = () => {
  formRef.value
    .validate()
    .then(() => {
      emit("save", form);
    })
    .catch(() => null);
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
.el-form-item__label {
  font-weight: bold;
}
.el-progress-bar {
  width: 100%;
}
</style>
