<template>
  <el-dialog
    :title="'重置密码'"
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
          <el-form-item label="新密码" prop="newPwd">
            <el-input
              v-model="form.newPwd"
              show-password
              clearable
              class="!w-[100%]"
              placeholder="请输入新密码"
            />
          </el-form-item>
        </re-col>
        <re-col v-if="form.newPwd.length > 0">
          <el-form-item>
            <el-progress
              :percentage="pwdCheck.percentage"
              :color="pwdCheck.color"
            >
              <span>{{ pwdCheck.format }}</span>
            </el-progress>
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="再次确认" prop="newPwdCheck">
            <el-input
              v-model="form.newPwdCheck"
              show-password
              clearable
              class="!w-[100%]"
              placeholder="再次输入新密码"
            />
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
import { type PasswordData } from "@/api/orga/user";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<PasswordData>
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const formRef = ref<FormInstance>();

const form = reactive<PasswordData>({
  userId: 0,
  newPwd: "",
  newPwdCheck: "",
  loginPwd: ""
});
const pwdCheck = ref<any>({
  percentage: 0,
  color: "#f56c6c",
  format: ""
});
//正则
const REGEXP_MID_PWD = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,18}$/;
const REGEXP_HIGH_PWD =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,18}$/;
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
watch(
  () => form.newPwd,
  newPwd => {
    if (newPwd.length > 8) {
      if (REGEXP_MID_PWD.test(newPwd)) {
        if (REGEXP_HIGH_PWD.test(newPwd)) {
          pwdCheck.value.percentage = 100;
          pwdCheck.value.color = "#67c23a";
          pwdCheck.value.format = "强";
        } else {
          pwdCheck.value.percentage = 67;
          pwdCheck.value.color = "#e6a23c";
          pwdCheck.value.format = "中";
        }
      } else {
        pwdCheck.value.percentage = 33;
        pwdCheck.value.color = "#f56c6c";
        pwdCheck.value.format = "弱";
      }
    } else {
      if (newPwd.length > 0) {
        pwdCheck.value.percentage = 33;
        pwdCheck.value.color = "#f56c6c";
        pwdCheck.value.format = "弱";
      } else {
        pwdCheck.value.percentage = 0;
        pwdCheck.value.format = "";
      }
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

//校验
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!REGEXP_HIGH_PWD.test(value)) {
    callback(new Error("密码格式应为8-18位包含数字、字母、符号的组合"));
  } else {
    if (form.newPwdCheck !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("newPwdCheck", () => null);
    }
    callback();
  }
};
const validatePassCheck = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value !== form.newPwd) {
    callback(new Error("两次输入的密码不同!"));
  } else {
    callback();
  }
};
//表单验证规则
const rules = reactive<FormRules>({
  newPwd: [{ validator: validatePass, trigger: "blur", required: true }],
  newPwdCheck: [
    { validator: validatePassCheck, trigger: "blur", required: true }
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

<style scpoed>
.el-progress-bar {
  width: 370px;
}
</style>
