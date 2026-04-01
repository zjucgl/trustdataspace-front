<template>
  <el-dialog
    :title="'分配角色'"
    center
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    width="500"
  >
    <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
      <el-row :gutter="30">
        <re-col>
          <el-form-item label="角色分配" prop="roleIdList">
            <el-select
              v-model="form.roleIdList"
              filterable
              clearable
              multiple
              class="!w-[100%]"
              placeholder="请选择你要分配的角色"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import ReCol from "@/components/ReCol";
import type { FormInstance, FormRules } from "element-plus";
import { type RoleData } from "@/api/orga/user";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<RoleData>
  },
  visible: {
    type: Boolean,
    default: false
  },
  roleOptions: {
    type: Array as PropType<RoleData[]>,
    default: () => []
  }
});

const formRef = ref<FormInstance>();

const form = reactive<RoleData>({
  roleOptions: [],
  userId: 0,
  roleIdList: [],
  roleName: ""
});

watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(form, props.data);
      // console.log("roleOptions=", props.roleOptions);
      // handleOptions(props.roleOptions);
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

//表单验证规则
const rules = reactive<FormRules>({});

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
