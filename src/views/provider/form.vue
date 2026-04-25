<template>
  <el-dialog
    :title="data?.id ? '编辑数据提供方' : '新增数据提供方'"
    :model-value="visible"
    width="600px"
    @close="close"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="Provider标识" prop="providerName">
        <el-input
          v-model="formData.providerName"
          placeholder="如 providerA（英文，唯一）"
          :disabled="!!data?.id"
        />
      </el-form-item>
      <el-form-item label="显示名称" prop="providerLabel">
        <el-input
          v-model="formData.providerLabel"
          placeholder="如 某某数据提供方"
        />
      </el-form-item>
      <el-form-item label="关联部门" prop="deptId">
        <el-tree-select
          v-model="formData.deptId"
          :data="deptOptions"
          :props="{ label: 'deptName', value: 'deptId', children: 'children' }"
          placeholder="选择部门"
          check-strictly
        />
      </el-form-item>
      <el-divider content-position="left">数据源配置（可选）</el-divider>
      <el-form-item label="数据库地址">
        <el-input
          v-model="formData.dbHost"
          placeholder="如 rm-xxx.mysql.rds.aliyuncs.com"
        />
      </el-form-item>
      <el-form-item label="数据库端口">
        <el-input-number v-model="formData.dbPort" :min="1" :max="65535" />
      </el-form-item>
      <el-form-item label="数据库名">
        <el-input
          v-model="formData.dbName"
          placeholder="数据库 schema 名称"
        />
      </el-form-item>
      <el-form-item label="只读用户名">
        <el-input
          v-model="formData.dbReadonlyUser"
          placeholder="只读账号"
        />
      </el-form-item>
      <el-form-item label="只读密码">
        <el-input
          v-model="formData.dbReadonlyPwd"
          type="password"
          show-password
          placeholder="只读密码"
        />
      </el-form-item>
      <el-divider content-position="left">部署配置</el-divider>
      <el-form-item label="部署服务器IP">
        <el-input
          v-model="formData.deployHost"
          placeholder="EDC 部署目标服务器 IP"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { ProviderConfigData } from "@/api/provider/index";
import type { DeptData } from "@/api/orga/dept";

const props = defineProps<{
  visible: boolean;
  data: ProviderConfigData | null;
  deptOptions: DeptData[];
}>();

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "save", data: ProviderConfigData): void;
}>();

const formRef = ref<FormInstance>();

const getDefaultFormData = () => ({
  id: undefined as number | undefined,
  providerName: "",
  providerLabel: "",
  deptId: undefined as number | undefined,
  dbHost: "",
  dbPort: 3306,
  dbName: "",
  dbReadonlyUser: "",
  dbReadonlyPwd: "",
  deployHost: "",
  remark: ""
});

const formData = reactive(getDefaultFormData());

const rules = reactive<FormRules>({
  providerName: [
    { required: true, message: "请输入Provider标识", trigger: "blur" },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "仅支持英文字母开头",
      trigger: "blur"
    }
  ],
  providerLabel: [
    { required: true, message: "请输入显示名称", trigger: "blur" }
  ]
});

watch(
  () => props.data,
  val => {
    if (val) {
      Object.assign(formData, val);
    } else {
      Object.assign(formData, getDefaultFormData());
    }
  },
  { immediate: true }
);

function close() {
  emit("update:visible", false);
}

function submit() {
  formRef.value?.validate(valid => {
    if (valid) {
      emit("save", { ...formData });
      close();
    }
  });
}
</script>
