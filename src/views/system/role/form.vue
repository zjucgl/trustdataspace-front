<template>
  <el-dialog
    :title="form.roleId ? '编辑角色' : '新增角色'"
    center
    width="60%"
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色标识" prop="roleCode">
        <el-input v-model="form.roleCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注信息" prop="roleInfo">
        <el-input v-model="form.roleInfo" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { type RoleData } from "@/api/system/role";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<RoleData>
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const formRef = ref<FormInstance>();

const form = reactive<RoleData>({
  roleId: null,
  roleName: "",
  roleCode: "",
  roleInfo: ""
});

watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(form, props.data);
    }
  }
);

const close = () => {
  //重置表单
  formRef.value.resetFields();
  //重置表单校验
  formRef.value.clearValidate();
  emit("update:visible", false);
};

const rules = reactive<FormRules>({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleCode: [{ required: true, message: "请输入角色标识", trigger: "blur" }]
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

<style scpoed></style>
