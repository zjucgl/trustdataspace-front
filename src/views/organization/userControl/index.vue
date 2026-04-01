<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="main">
      <tree class="w-[17%] float-left" ref="treeRef" @filterDept="getDept" />
      <div class="float-right w-[82%] border-l-2 border-[#dcdfe6]">
        <div class="p-8">
          <div class="flex justify-between">
            <el-form :inline="true" :model="searchForm.jsonParam" ref="formRef">
              <el-form-item label="角色名称：" prop="userName">
                <el-input
                  v-model="searchForm.jsonParam.userName"
                  placeholder="请输入用户名称"
                  clearable
                  class="!w-[200px]"
                />
              </el-form-item>
              <el-form-item label="手机号码：" prop="userPhone">
                <el-input
                  v-model="searchForm.jsonParam.userPhone"
                  placeholder="请输入手机号码"
                  clearable
                  class="!w-[180px]"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(Search)"
                  @click="search"
                >
                  搜索
                </el-button>
                <el-button
                  :icon="useRenderIcon(Refresh)"
                  @click="resetSearch(formRef)"
                >
                  重置
                </el-button>
              </el-form-item>
            </el-form>
            <div>
              <el-button type="warning" @click="editPwdUpdate">
                密码强制更新
              </el-button>
              <!-- <el-button
              type="primary"
              :disabled="selection.length === 0"
              @click="remove(selection)"
            >
              批量删除
            </el-button>
            <el-button @click="toggleSelection">重置选择</el-button> -->
              <el-button type="primary" @click="add">新增</el-button>
            </div>
          </div>

          <div style="height: calc(100vh - 260px)">
            <el-table
              ref="tableRef"
              v-loading="loading"
              :data="tableData.data"
              class="w-full"
              :header-cell-style="{
                backgroundColor: '#F5F7FA',
                color: '#606266',
                fontWeight: 400
              }"
              @selection-change="handleSelectionChange"
              height="100%"
            >
              <!-- <el-table-column type="selection" width="40" /> -->
              <el-table-column
                type="index"
                width="60"
                label="序号"
                align="center "
              />
              <el-table-column prop="loginCode" label="用户账号" />
              <el-table-column prop="userName" label="用户名称" />
              <el-table-column prop="deptName" label="部门" />
              <el-table-column prop="userPhone" label="手机号码" />
              <el-table-column
                prop="participantId"
                label="参与者ID"
                show-overflow-tooltip
              />
              <el-table-column
                prop="userDeposits"
                show-overflow-tooltip
                label="余额"
              />
              <el-table-column
                prop="userInfo"
                show-overflow-tooltip
                label="备注信息"
              />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button link type="primary" @click="edit(scope.row)">
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确认删除该账号?"
                    :width="180"
                    @confirm="remove([scope.row.userId])"
                  >
                    <template #reference>
                      <el-button link type="primary"> 删除 </el-button>
                    </template>
                  </el-popconfirm>
                  <el-dropdown>
                    <el-button
                      class="ml-3 mt-[2px]"
                      link
                      type="primary"
                      :icon="useRenderIcon(More)"
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>
                          <el-button
                            :class="buttonClass"
                            link
                            type="primary"
                            :icon="useRenderIcon(Password)"
                            @click="editPassword(scope.row)"
                          >
                            重置密码
                          </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-button
                            :class="buttonClass"
                            link
                            type="primary"
                            :icon="useRenderIcon(Role)"
                            @click="editRole(scope.row)"
                          >
                            分配角色
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="absolute bottom-8 right-8 w-full">
            <div class="flex-bc">
              <div />
              <el-pagination
                v-if="tableData.totalCount > 0"
                background
                v-model:current-page="searchForm.pageNo"
                v-model:page-size="searchForm.pageSize"
                :page-sizes="[10, 20, 30]"
                layout="prev, pager, next, jumper, sizes"
                :total="tableData.totalCount"
                @size-change="search"
                @current-change="setTableData"
              />
            </div>
          </div>

          <user-form
            :data="formData"
            v-model:visible="formVisible"
            @save="save"
            :deptOptions="deptOptionData"
            :roleOptions="roleOptionData"
            :participantOptions="participantOptionData"
          />
          <role-form
            :data="roleFormData"
            @save="saveRole"
            v-model:visible="roleFormVisible"
            :roleOptions="roleOptionData"
          />
          <password-form
            :data="passwordFormData"
            @save="savePassword"
            v-model:visible="passwordFormVisible"
          />
          <pwd-update v-model:visible="pwdUpdateVisible" />
        </div>
      </div>
    </div>
  </el-watermark>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  type UserParam,
  type UserData,
  type RoleData,
  type PasswordData,
  getUserPageByRoot,
  getRoleOption,
  getParticipantOption,
  saveUser,
  saveUserRoleCode,
  removeUser
} from "@/api/orga/user";
import { getDeptPage } from "@/api/orga/dept";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable, ElMessageBox } from "element-plus";
import userForm from "./form.vue";
import roleForm from "./form-role.vue";
import passwordForm from "./form-password.vue";
import pwdUpdate from "./function-pwd-update.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import md5 from "md5";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Tree from "./tree.vue";
import { getWatermark } from "@/utils/role";
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
defineOptions({
  name: "userPage"
});
const loading = ref(true);
const formRef = ref<FormInstance>();
const treeRef = ref();
const searchForm: QueryParam<UserParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    userName: null,
    userPhone: null,
    deptIds: []
  }
});

const tableData = ref<TableData<UserData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});
const deptOptionData = ref([]);
const roleOptionData = ref([]);
const participantOptionData = ref([]);

//用户查询
const setTableData = () => {
  loading.value = true;
  getUserPageByRoot(searchForm)
    .then(({ result }) => {
      tableData.value = result;
      // console.log("res=", res);
    })
    .finally(() => {
      loading.value = false;
    });
  getDeptPage()
    .then(({ result }) => {
      deptOptionData.value = result;
    })
    .finally(() => {
      loading.value = false;
    });
};
//角色选项查询
const setRoleOptions = () => {
  getRoleOption().then(({ result }) => {
    roleOptionData.value = result;
  });
};
//角色选项查询
const setParticipantOptions = () => {
  getParticipantOption().then(({ result }) => {
    participantOptionData.value = result;
  });
};

//左侧树查询
const getDept = (val: []) => {
  if (val !== null) {
    searchForm.jsonParam.deptIds = val;
    search();
  } else {
    searchForm.jsonParam.deptIds = null;
    search();
  }
};

setTableData();
setRoleOptions();
setParticipantOptions();

const search = () => {
  searchForm.pageNo = 1;
  setTableData();
};

const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  search();
};

const formData = ref<UserData>();
const formVisible = ref(false);
const roleFormData = ref<RoleData>();
const roleFormVisible = ref(false);
const passwordFormData = ref<PasswordData>();
const passwordFormVisible = ref(false);

const pwdUpdateVisible = ref(false);

const add = () => {
  formData.value = {
    userName: "",
    loginCode: "",
    loginPwd: "",
    userId: null,
    deptId: null,
    userInfo: "",
    userPhone: "",
    roleIdList: []
  };
  formVisible.value = true;
};

const edit = (data: UserData) => {
  formVisible.value = true;
  formData.value = data;
};

const editPassword = (data: UserData) => {
  passwordFormVisible.value = true;
  passwordFormData.value = data;
};
const editRole = (data: RoleData) => {
  roleFormVisible.value = true;
  roleFormData.value = data;
};
const editPwdUpdate = () => {
  pwdUpdateVisible.value = true;
};
const save = (data: UserData) => {
  if (data.userId === null) {
    data.loginPwd = md5(data.loginPwd);
  }
  saveUser(data)
    .then(res => {
      if (res.success) {
        showSuccessMessage("保存成功");
      } else {
        showErrorMessage(res.message);
      }
      formVisible.value = false;
      if (data.userId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage);
  // console.log("data=", data);
};

const saveRole = (data: UserData) => {
  saveUserRoleCode(data)
    .then(res => {
      if (res.success) {
        showSuccessMessage("保存成功");
      } else {
        showErrorMessage(res.message);
      }
      roleFormVisible.value = false;
      if (data.userId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage);
  // console.log("data=", data);
};

const savePassword = (data: UserData) => {
  data.loginPwd = md5(data.newPwd);
  const saveData = {
    userId: data.userId,
    loginPwd: data.loginPwd,
    userName: data.userName,
    loginCode: data.loginCode,
    deptId: data.deptId,
    userInfo: data.userInfo,
    userPhone: data.userPhone
  };
  saveUser(saveData)
    .then(res => {
      if (res.success) {
        showSuccessMessage("保存成功");
      } else {
        showErrorMessage(res.message);
      }
      passwordFormVisible.value = false;
      if (data.userId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage);
};

//批量删除
const tableRef = ref<InstanceType<typeof ElTable>>();
const selection = ref<number[]>([]);
const remove = async (ids: number[]) => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "删除提示", { type: "warning" });
    loading.value = true;
    console.log("ids=", ids);
    await removeUser({ ids });
    showSuccessMessage("删除成功");
    search();
  } catch (err) {
    if (err !== "cancel") {
      showErrorMessage(err);
    }
  } finally {
    loading.value = false;
  }
};
//重置选择
const toggleSelection = () => {
  tableRef.value!.clearSelection();
};
const handleSelectionChange = (val: UserData[]) => {
  selection.value = val.map(item => item.userId);
};
//按钮样式
const buttonClass = computed(() => {
  return [
    "!h-[20px]",
    "reset-margin",
    "!text-gray-500",
    "dark:!text-white",
    "dark:hover:!text-primary"
  ];
});
</script>
