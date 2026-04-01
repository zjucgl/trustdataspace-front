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
          <el-form-item label="合约名称(id)" prop="id">
            <el-input
              v-model="form.id"
              clearable
              class="!w-[100%]"
              placeholder="请输入合约名称"
            />
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="会员策略" prop="contractPolicyId">
            <el-select
              v-model="form.accessPolicyId"
              clearable
              class="!w-[100%]"
              placeholder="请选择会员策略"
            >
              <!-- 动态渲染选项 -->
              <el-option
                v-for="policy in form.policyList.slice(0, 1)"
                :key="policy.id"
                :label="definitoinMap.get(policy.id)"
                :value="policy.id"
              />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="权限策略" prop="contractPolicyId">
            <el-select
              v-model="form.contractPolicyId"
              clearable
              class="!w-[100%]"
              placeholder="请选择权限策略"
            >
              <!-- 动态渲染选项 -->
              <el-option
                v-for="policy in form.policyList.slice(1, 4)"
                :key="policy.id"
                :label="definitoinMap.get(policy.id)"
                :value="policy.id"
              />
            </el-select>
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
import { showErrorMessage } from "@/utils/message";
import { type DefinitionData } from "@/api/mvd/asset";
import { definitoinMap } from "@/utils/mvd";

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
const form = reactive<DefinitionData>({
  id: null,
  accessPolicyId: null,
  contractPolicyId: null,
  assetId: null,
  policyList: null
});
//正则
watch(
  () => props.visible,
  visible => {
    if (visible) {
      buttonLoading.value = false;
      console.log(props.data);
      Object.assign(form, props.data);
      form.policyList = props.data.policyList.map((item: any) => {
        return {
          id: item.id
        };
      });
      console.log(form.policyList);
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
  id: [{ required: true, message: "请填写合约名称", trigger: "blur" }],
  accessPolicyId: [
    { required: true, message: "会员策略是必选项", trigger: "blur" }
  ],
  contractPolicyId: [
    { required: true, message: "权限策略是必选项", trigger: "blur" }
  ]
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
@/api/mvd/asset
