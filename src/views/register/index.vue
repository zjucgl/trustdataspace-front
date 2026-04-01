<script setup lang="ts">
import Motion from "./utils/motion";
import { useRoute, useRouter } from "vue-router";
import { message, showSuccessMessage, showErrorMessage } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu, gotoCatalogAsset } from "@/router/utils";
import { bg, bgFrame, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import md5 from "md5";
import { saveUser, codeIsExist } from "@/api/orga/user";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Phone from "@iconify-icons/ri/smartphone-fill";

defineOptions({
  name: "Login"
});
// 获取route对象
const route = useRoute();
// 获取router对象
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const loadingForm = ref(false);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  //loginCode: "浙大宁理",
  loginCode: "", //13454788583
  loginPwd: "", //lab309@nbt
  userPhone: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  // 从URL中获取查询参数
  const imgIdParams = route.query.id;
  if (!formEl) return;
  const loginForm = {
    userId: null,
    loginCode: ruleForm.loginCode,
    loginPwd: md5(ruleForm.loginPwd),
    userName: ruleForm.loginCode,
    userPhone: ruleForm.userPhone,
    deptId: 10
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      codeIsExist(loginForm).then(({ result }) => {
        if (result === false) {
          saveUser(loginForm)
            .then(res => {
              if (res.success) {
                showSuccessMessage("账号申请成功，请等待管理员审核！");
              } else {
                showErrorMessage(res.message);
              }
            })
            .catch(showErrorMessage)
            .finally(() => {
              loading.value = false;
            });
        } else {
          showErrorMessage("该账号已申请，请等待审核");
          loading.value = false;
        }
      });
    } else {
      return fields;
    }
  });
};
/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter" || code === "NumpadEnter") {
    onLogin(ruleFormRef.value);
  }
}
onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
  loadingForm.value = true;
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none background-color">
    <div class="login-container-new">
      <el-row class="h-full w-full" justify="center">
        <el-col :span="14" style="background-color: #f0ffff">
          <div class="w-full" style="text-align: center">
            <div
              style="
                font-size: 30px;
                align-items: center;
                justify-items: center;
              "
              class="pt-16"
            >
              可信文化数据空间
            </div>
            <div style="align-items: center; justify-items: center">
              <img :src="bgFrame" />
            </div>
          </div>
        </el-col>
        <el-col :span="10" v-if="loadingForm">
          <div style="place-self: center; height: 100%">
            <div class="login-box-new">
              <div class="login-form">
                <Motion>
                  <h2 class="outline-none" style="color: #000">{{ "注册" }}</h2>
                </Motion>

                <el-form
                  ref="ruleFormRef"
                  :model="ruleForm"
                  :rules="loginRules"
                  size="large"
                >
                  <Motion :delay="100">
                    <el-form-item
                      :rules="[
                        {
                          required: true,
                          message: '请输入账号',
                          trigger: 'blur'
                        }
                      ]"
                      prop="loginCode"
                    >
                      <el-input
                        v-model="ruleForm.loginCode"
                        clearable
                        placeholder="账号"
                        :prefix-icon="useRenderIcon(User)"
                      />
                    </el-form-item>
                  </Motion>
                  <Motion :delay="150">
                    <el-form-item prop="loginPwd">
                      <el-input
                        v-model="ruleForm.loginPwd"
                        clearable
                        show-password
                        placeholder="密码"
                        :prefix-icon="useRenderIcon(Lock)"
                      />
                    </el-form-item>
                  </Motion>
                  <Motion :delay="200">
                    <el-form-item prop="userPhone">
                      <el-input
                        v-model="ruleForm.userPhone"
                        clearable
                        placeholder="手机号"
                        :prefix-icon="useRenderIcon(Phone)"
                      />
                    </el-form-item>
                  </Motion>
                  <Motion :delay="250">
                    <el-button
                      class="w-full mt-4"
                      size="default"
                      type="primary"
                      :loading="loading"
                      @click="onLogin(ruleFormRef)"
                    >
                      注册
                    </el-button>
                  </Motion>
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
.background-color {
  background-color: #fff;
}
/* 全局设置 */
.left-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列 */
  height: 100vh; /* 设置容器高度为视口高度 */
}

/* 垂直分列 */
.vertical-column {
  display: grid;
  grid-template-rows: 1fr 1fr; /* 定义两行，实现垂直方向的分列 */
  height: 100%; /* 确保每个分列都占据容器的一部分高度 */
}

/* 分列内的元素 */
.item {
  border: 1px solid #000; /* 添加边框以便区分 */
}
</style>
