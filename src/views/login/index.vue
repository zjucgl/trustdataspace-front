<script setup lang="ts">
import Motion from "./utils/motion";
import { useRoute, useRouter } from "vue-router";
import { message, showErrorMessage } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import {
  initRouter,
  getTopMenu,
  addPathMatch,
  gotoCatalogAsset
} from "@/router/utils";
import {
  bg,
  bgFrame,
  bgFrameShort,
  avatar,
  illustration
} from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import md5 from "md5";
import passwordForm from "./utils/form-password.vue";
import { type UserData, type PasswordData, saveUser } from "@/api/orga/user";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import { setToken } from "@/utils/auth";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "Login"
});
const imgCode = ref("");
const imgUuid = ref("");
// 获取route对象
const route = useRoute();
// 获取router对象
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const loadingForm = ref(false);

const passwordFormData = ref<PasswordData>();
const passwordFormVisible = ref(false);

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  //loginCode: "浙大宁理",
  loginCode: "", //13454788583
  loginPwd: "", //lab309@nbt
  verifyCode: ""
});
// 获取验证码
const getKaptcha = async () => {
  useUserStoreHook()
    .getKaptchaCode()
    .then(({ result }) => {
      imgCode.value = result.imgCode;
      imgUuid.value = result.imgUuid;
    })
    .catch(showErrorMessage);
};
// const onLogin = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   await formEl.validate(valid => {
//     if (valid) {
//       loading.value = true;
//       setToken({
//         // roles: ["admin"],
//         // username: "浙大宁理",
//         username: ruleForm.loginCode,
//         //roles: ["consumer"],
//         roles: ["admin"],
//         accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
//       } as any);
//       // 全部采取静态路由模式
//       usePermissionStoreHook().handleWholeMenus([]);
//       addPathMatch();
//       router.push(getTopMenu(true).path);
//       message("登录成功", { type: "success" });
//       loading.value = false;
//     }
//   });
// };

const onLogin = async (formEl: FormInstance | undefined) => {
  // 从URL中获取查询参数
  const imgIdParams = route.query.id;
  if (!formEl) return;
  const loginForm = {
    loginCode: ruleForm.loginCode,
    loginPwd: md5(ruleForm.loginPwd),
    imgUuid: imgUuid.value,
    verifyCode: ruleForm.verifyCode
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername(loginForm)
        .then(res => {
          if (res.success) {
            const userId = res.result.roles[0].userId;
            if (imgIdParams !== undefined) {
              // 获取后端路由
              return initRouter().then(() => {
                router
                  .push({
                    path: gotoCatalogAsset().path,
                    query: { id: imgIdParams }
                  })
                  .then(() => {
                    message("登录成功", { type: "success" });
                  });
              });
            }
            // 获取后端路由
            return initRouter().then(() => {
              router.push(getTopMenu(true).path).then(() => {
                message("登录成功", { type: "success" });
              });
            });
          } else {
            if (res.result.pwdExpire) {
              passwordFormVisible.value = true;
              passwordFormData.value = { userId: res.result.userId };
            }
          }

          // else {
          //   message("登录失败", { type: "error" });
          // }
        })
        .finally(() => (loading.value = false));
    } else {
      return fields;
    }
  });
};
const savePassword = (data: UserData) => {
  data.loginPwd = md5(data.newPwd);
  const saveData = {
    userId: data.userId,
    loginPwd: data.loginPwd
  };
  saveUser(saveData)
    .then(res => {
      if (res.success) {
        message("密码重置成功", { type: "success" });
      } else {
        showErrorMessage(res.message);
      }
      passwordFormVisible.value = false;
      ruleForm.loginPwd = "";
      ruleForm.verifyCode = "";
      // getKaptcha();
    })
    .catch(showErrorMessage);
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
  getKaptcha();
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
// if (location.href.indexOf("#reloaded") == -1) {
//   location.href = location.href + "#reloaded";
//   location.reload();
// }
</script>

<template>
  <div class="select-none background-color">
    <!-- <img :src="bg" class="wave" /> -->
    <!-- <div style="background-color: #e0ffff; width: 100%; height: 100%" /> -->
    <div class="login-container-new">
      <el-row class="h-full w-full" justify="center">
        <el-col :span="14" style="background-color: #f0ffff">
          <!-- <div class="img">
          <component :is="toRaw(illustration)" />
        </div> -->
          <div class="w-full h-full flex" style="text-align: center">
            <div
              style="
                align-items: center;
                justify-items: center;
                place-self: center;
                width: 100%;
              "
            >
              <div
                style="
                  font-size: 50px;
                  align-items: center;
                  justify-items: center;
                  font-family: 华文中宋;
                "
                class="pt-16 outline-none"
              >
                可信文化数据空间
              </div>
              <img :src="bgFrameShort" />
            </div>
          </div>
        </el-col>
        <el-col v-if="loadingForm" :span="10">
          <div style="place-self: center; height: 100%">
            <div class="login-box-new">
              <div class="login-form">
                <Motion>
                  <h2 class="outline-none" style="color: #000">{{ "登录" }}</h2>
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
                    <el-form-item prop="verifyCode">
                      <el-input
                        v-model="ruleForm.verifyCode"
                        clearable
                        placeholder="验证码"
                        :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                      >
                        <template v-slot:append>
                          <img
                            class="getCaptcha"
                            :src="imgCode"
                            @click="getKaptcha()"
                          />
                        </template>
                      </el-input>
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
                      登录
                    </el-button>
                  </Motion>
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <password-form
      v-model:visible="passwordFormVisible"
      :data="passwordFormData"
      @save="savePassword"
    />
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
