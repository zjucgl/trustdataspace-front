<template>
  <el-dialog
    :title="form.deptId ? '编辑部门' : '新增部门'"
    center
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="上级部门" prop="deptFather">
        <el-cascader
          class="w-full"
          v-model="form.deptFather"
          :options="deptOptions"
          :props="{ checkStrictly: true }"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="form.deptName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门信息" prop="deptInfo">
        <el-input v-model="form.deptInfo" autocomplete="off" />
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
import { type DeptData } from "@/api/orga/dept";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<DeptData>
  },
  visible: {
    type: Boolean,
    default: false
  },
  deptOptions: {
    type: Array as PropType<DeptData[]>,
    default: () => []
  }
});

const formRef = ref<FormInstance>();

const form = reactive<DeptData>({
  deptName: "",
  deptInfo: "",
  deptFather: 0,
  deptId: 0
});

watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(form, props.data);
      handleOptions(props.deptOptions);
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
  deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  deptInfo: [{ required: true, message: "请输入部门信息", trigger: "blur" }]
});

const save = () => {
  formRef.value
    .validate()
    .then(() => {
      if (Array.isArray(form.deptFather)) {
        form.deptFather = form.deptFather.pop();
      }
      emit("save", form);
    })
    .catch(() => null);
};

const handleOptions = options => {
  options.forEach(element => {
    element.label = element.deptName;
    element.value = element.deptId;
    if (element.children.length > 0) {
      handleOptions(element.children);
    }
  });
};
</script>

<style scpoed></style>
