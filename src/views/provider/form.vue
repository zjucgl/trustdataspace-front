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
      <el-divider content-position="left">部署配置</el-divider>
      <el-form-item label="部署服务器IP">
        <el-input
          v-model="formData.deployHost"
          placeholder="EDC 部署目标服务器 IP"
        />
      </el-form-item>
      <el-form-item label="启用扩展" prop="enabledExtensions">
        <el-checkbox-group v-model="formData.enabledExtensions">
          <el-checkbox
            v-for="ext in extensionOptions"
            :key="ext.value"
            :label="ext.value"
            :disabled="ext.value === 'http'"
          >
            {{ ext.label }}
          </el-checkbox>
        </el-checkbox-group>
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
import {
  ALL_DATAPLANE_EXTENSIONS,
  type DataplaneExtension,
  type ProviderConfigData
} from "@/api/provider/index";
import type { DeptData } from "@/api/orga/dept";

type FormState = {
  id: number | undefined;
  providerName: string;
  providerLabel: string;
  deptId: number | undefined;
  deployHost: string;
  enabledExtensions: DataplaneExtension[];
  remark: string;
};

const props = defineProps<{
  visible: boolean;
  data: ProviderConfigData | null;
  deptOptions: DeptData[];
}>();

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "save", data: ProviderConfigData): void;
}>();

const extensionLabels: Record<DataplaneExtension, string> = {
  http: "HTTP（默认）",
  s3: "对象存储 S3 / OSS",
  jdbc: "关系数据库 JDBC",
  sftp: "SFTP 文件系统"
};

const extensionOptions = ALL_DATAPLANE_EXTENSIONS.map(value => ({
  value,
  label: extensionLabels[value]
}));

const formRef = ref<FormInstance>();

const getDefaultFormData = (): FormState => ({
  id: undefined,
  providerName: "",
  providerLabel: "",
  deptId: undefined,
  deployHost: "",
  enabledExtensions: ["http"],
  remark: ""
});

const formData = reactive<FormState>(getDefaultFormData());

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

function parseExtensions(raw: string | undefined): DataplaneExtension[] {
  if (!raw) return ["http"];
  const set = new Set<DataplaneExtension>(["http"]);
  raw.split(",").forEach(token => {
    const trimmed = token.trim();
    if (
      trimmed &&
      ALL_DATAPLANE_EXTENSIONS.includes(trimmed as DataplaneExtension)
    ) {
      set.add(trimmed as DataplaneExtension);
    }
  });
  return Array.from(set);
}

watch(
  () => props.data,
  val => {
    if (val) {
      const next = getDefaultFormData();
      next.id = val.id;
      next.providerName = val.providerName ?? "";
      next.providerLabel = val.providerLabel ?? "";
      next.deptId = val.deptId;
      next.deployHost = val.deployHost ?? "";
      next.enabledExtensions = parseExtensions(val.enabledDataplaneExtensions);
      next.remark = val.remark ?? "";
      Object.assign(formData, next);
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
      const payload: ProviderConfigData = {
        id: formData.id,
        providerName: formData.providerName,
        providerLabel: formData.providerLabel,
        deptId: formData.deptId,
        deployHost: formData.deployHost,
        enabledDataplaneExtensions: formData.enabledExtensions.join(","),
        remark: formData.remark
      };
      emit("save", payload);
      close();
    }
  });
}
</script>
