<template>
  <el-dialog
    :title="'资产策略'"
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
          <el-form-item label="策略名称(id)" prop="id">
            <el-input
              v-model="form.id"
              clearable
              class="!w-[100%]"
              placeholder="请输入策略名称"
            />
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="访问许可" prop="permission">
            <el-select
              v-model="form.permission"
              clearable
              class="!w-[100%]"
              placeholder="请选择会员策略"
            >
              <el-option
                :key="'require-membership'"
                :label="'需要会员凭证'"
                :value="'require-membership'"
              />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="访问禁止" prop="prohibition">
            <el-select
              v-model="form.prohibition"
              clearable
              class="!w-[100%]"
              placeholder="请选择权限策略"
            >
              <el-option
                :key="'require-dataprocessor'"
                :label="'通用级别'"
                :value="'require-dataprocessor'"
              />
              <el-option
                :key="'require-sensitive'"
                :label="'敏感级别'"
                :value="'require-sensitive'"
              />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="访问义务" prop="obligation">
            <el-select
              v-model="form.obligation"
              clearable
              class="!w-[100%]"
              placeholder="请选择义务"
            >
              <el-option
                :key="'asset-1'"
                :label="'测试'"
                :value="'processing'"
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
import { PolicyData } from "@/api/mvd/policy";

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
const form = reactive<PolicyData>({
  id: "",
  permission: "",
  prohibition: "",
  obligation: ""
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
  id: [{ required: true, message: "请填写合约名称", trigger: "blur" }],
  // permission: [
  //   { required: true, message: "会员策略是必选项", trigger: "blur" }
  // ],
  // prohibition: [
  //   { required: true, message: "权限策略是必选项", trigger: "blur" }
  // ],
  // obligation: [{ required: true, message: "义务策略是必选项", trigger: "blur" }]
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
