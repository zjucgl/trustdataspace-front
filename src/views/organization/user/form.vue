<template>
  <el-dialog
    :title="form.userId ? '编辑用户' : '新增用户'"
    center
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <el-row :gutter="30">
        <re-col>
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="form.userName"
              clearable
              class="!w-[100%]"
              placeholder="请输入用户名称"
            />
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="登录账号" prop="loginCode">
            <el-input
              v-model="form.loginCode"
              clearable
              class="!w-[100%]"
              placeholder="请输入登录账号"
            />
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item
            label="账号密码"
            prop="loginPwd"
            v-if="form.userId ? false : true"
          >
            <el-input
              v-model="form.loginPwd"
              clearable
              class="!w-[100%]"
              placeholder="请输入账号密码"
              type="password"
              show-password
            />
          </el-form-item>
        </re-col>
        <re-col v-if="form.loginPwd && form.loginPwd.length > 0">
          <el-form-item>
            <el-progress
              :percentage="pwdCheck.percentage"
              :color="pwdCheck.color"
              class="w-[50%]"
            >
              <span>{{ pwdCheck.format }}</span>
            </el-progress>
          </el-form-item>
        </re-col>
        <re-col>
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader
              class="w-full"
              v-model="form.deptId"
              :options="deptOptions"
              :props="{
                emitPath: false,
                checkStrictly: true //导致每一级都可选
              }"
              clearable
              filterable
              placeholder="请选择所属部门"
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="角色分配" prop="roleIdList" v-if="!form.userId">
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

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="手机号码" prop="userPhone">
            <el-input
              v-model="form.userPhone"
              clearable
              class="!w-[100%]"
              placeholder="请输入手机号"
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="备注信息" prop="userInfo">
            <el-input
              v-model="form.userInfo"
              placeholder="请输入备注信息"
              type="textarea"
              class="!w-[100%]"
              :row="3"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save" :loading="buttonLoading">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import ReCol from "@/components/ReCol";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { showErrorMessage } from "@/utils/message";
import { type UserData, codeIsExist } from "@/api/orga/user";
import { type DeptData } from "@/api/orga/dept";
import { type RoleData } from "@/api/orga/user";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<UserData>
  },
  visible: {
    type: Boolean,
    default: false
  },
  deptOptions: {
    type: Array as PropType<DeptData[]>,
    default: () => []
  },
  roleOptions: {
    type: Array as PropType<RoleData[]>,
    default: () => []
  }
});
const formRef = ref<FormInstance>();
const fileList = ref([]);
const buttonLoading = ref(false);
const form = reactive<UserData>({
  userName: "",
  loginCode: "",
  deptId: 0,
  userId: 0,
  userInfo: "",
  userPhone: "",
  participantKeyId: null,
  roleIdList: []
});
const pwdCheck = ref<any>({
  percentage: 0,
  color: "#f56c6c",
  format: ""
});
//正则
/** 密码正则（密码格式应为8-18位包含数字、字母、符号的任意两种组合） */
const REGEXP_MID_PWD = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,18}$/;
/** 密码正则（密码格式应为8-18位包含数字、字母、符号的组合） */
const REGEXP_HIGH_PWD =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,18}$/;
watch(
  () => props.visible,
  visible => {
    if (visible) {
      buttonLoading.value = false;
      Object.assign(form, props.data);
      handleOptions(props.deptOptions);
    }
  }
);
watch(
  () => form.loginPwd,
  loginPwd => {
    if (loginPwd.length > 8) {
      if (REGEXP_MID_PWD.test(loginPwd)) {
        if (REGEXP_HIGH_PWD.test(loginPwd)) {
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
      if (loginPwd.length > 0) {
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
  buttonLoading.value = false;
  //重置表单
  formRef.value.resetFields();
  //重置表单校验
  formRef.value.clearValidate();
  emit("update:visible", false);
};

//表单验证规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门是必选项", trigger: "blur" }],
  loginCode: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("账号不能为空"));
        } else {
          callback();
        }
      },
      trigger: "blur",
      required: true
    }
  ],
  loginPwd: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_HIGH_PWD.test(value)) {
          callback(new Error("密码格式应为8-18位包含数字、字母、符号的组合"));
        } else {
          callback();
        }
      },
      trigger: "blur",
      required: true
    }
  ]
});

const save = () => {
  console.log("form", form);
  codeJudge();
};
const codeJudge = () => {
  codeIsExist(form).then(({ result }) => {
    if (result === false) {
      formRef.value
        .validate()
        .then(() => {
          buttonLoading.value = true;
          emit("save", form);
        })
        .catch(() => null);
    } else {
      showErrorMessage("该登录账号已存在，请重新填写登录账号");
      buttonLoading.value = false;
    }
  });
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
