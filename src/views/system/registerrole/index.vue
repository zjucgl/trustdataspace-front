<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "@/utils/message";
import { TableColumnCtx, TableInstance } from "element-plus";
import { http } from "@/utils/http";

const insertroles = (data?: object) => {
  return http.request<boolean>("post", "/register/insertregister", { data });
};
const tableData = ref([]);
const dialogFormVisible = ref();
const form = ref({
  info: "",
  orgauser: null,
  enable: true,
  roles: null
});
const getregister = () => {
  axios
    .get("/api/register/getroles")
    .then(res => {
      console.log(res);
      tableData.value = res.data;
    })
    .catch(error => {
      console.log(error);
    });
};
const getuserroles = () => {
  axios
    .get("/api/register/getttroles")
    .then(res => {
      console.log(res);
      options.value = res.data;
    })
    .catch(error => {
      console.log(error);
    });
};
onMounted(() => {
  getregister();
  getuserroles();
});
const options = ref([]);

interface User {
  id: number;
  accountname: string;
  password: string;
  state: string;
  status: number;
  logincode: string;
}

//按用户名搜索功能
const search = ref("");
const filterTableData = computed(() => {
  // 如果 search.value 或 search2.value 任意一个不为空，则进行过滤
  if (search.value || search2.value) {
    return tableData.value.filter(data => {
      // 检查 accountname 是否包含 search.value 或 search2.value（不区分大小写）
      return (
        (!search.value ||
          data.accountname
            .toLowerCase()
            .includes(search.value.toLowerCase())) &&
        (!search2.value ||
          data.logincode.toLowerCase().includes(search2.value.toLowerCase()))
      );
    });
  } else {
    // 如果两者都为空，则返回整个数组
    return tableData.value;
  }
});
//按电话号码搜索
const search2 = ref("");
const tagger = date => {
  if (date == "1") return "待审核";
  else if (date == "2") return "通过";
  else return "未通过";
};
let user = {
  phone: "",
  id: null,
  state: null,
  name: null,
  orgauser: null,
  roles: null,
  info: null
};
//审核提交
const submitsuccess = async (index: number, row: User) => {
  console.log(index, row);
  user = {
    phone: row.logincode,
    id: row.id,
    name: row.accountname,
    state: row.state,
    orgauser: null,
    roles: null,
    info: null
  };
  if (user.state === "2" || user.state === "3") {
    message("信息已经录入", {
      type: "error"
    });
  } else {
    dialogFormVisible.value = true;
  }
};
const confirmroles = async () => {
  user.orgauser = form.value.orgauser;
  user.roles = form.value.roles;
  user.info = form.value.info;
  if (form.value.enable) {
    user.state = "2";
  } else {
    user.state = "3";
  }
  console.log(user.roles.length);
  if (!user.roles.length) {
    message("角色不能为空", { type: "error" });
  } else {
    await insertroles(user)
      .then(res => {
        if (res) {
          message("审核通过", {
            type: "success"
          });
        } else
          message("请求失败", {
            type: "error"
          });
      })
      .catch(error => {
        console.log(error);
      });
    getregister();
    dialogFormVisible.value = false;
  }
};

//筛选表格
const tableRef = ref<TableInstance>();

const clearFilter = () => {
  tableRef.value!.clearFilter();
};
const filterTag = (value: string, row: User) => {
  return row.state === value;
};
</script>

<template>
  <div style="padding: 2rem">
    <el-button @click="clearFilter">重置筛选</el-button>
    <span style="margin-left: 1rem; font-size: 1rem">搜索账户名：</span>
    <el-input
      v-model="search"
      placeholder="Name to search"
      size="small"
      style="width: 20vh"
    />
    <span style="margin-left: 1rem; font-size: 1rem">搜索账号：</span>
    <el-input
      v-model="search2"
      placeholder="Logincode to search"
      size="small"
      style="width: 20vh"
    />
    <el-table
      ref="tableRef"
      :data="filterTableData"
      row-key="date"
      style="width: 100%"
    >
      <el-table-column label="No" type="index" width="80" />
      <el-table-column label="Date" prop="createtime" sortable width="250" />
      <el-table-column label="Name" prop="accountname" width="180" />
      <el-table-column label="Logincode" prop="logincode" />
      <el-table-column
        :filter-method="filterTag"
        :filters="[
          { text: '待审核', value: '1' },
          { text: '审核通过', value: '2' },
          { text: '审核未通过', value: '3' }
        ]"
        filter-placement="bottom-end"
        label="Tag"
        prop="state"
        width="100"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.state === '1' ? '' : 'success'"
            disable-transitions
            >{{ tagger(scope.row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="dispose">
        <template #default="scope">
          <el-button
            size="small"
            @click="submitsuccess(scope.$index, scope.row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" title="审核" width="500">
      <el-form :model="form">
        <el-switch
          v-model="form.enable"
          active-text="通过"
          class="ml-2"
          inactive-text="拒绝"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
        <el-form-item label="备注" label-width="80px">
          <el-input
            v-model="form.info"
            :disabled="!form.enable"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="用户绑定" label-width="80px">
          <el-select
            v-model="form.orgauser"
            :disabled="!form.enable"
            placeholder="请选择用户"
          >
            <el-option
              v-for="option in options"
              :key="option.userId"
              :label="option.userName"
              :value="option.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="角色分配"
          label-width="80px"
          :rules="[
            {
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <el-select
            v-model="form.roles"
            :disabled="!form.enable"
            multiple
            placeholder="请选择角色"
          >
            <el-option label="管理员" value="1" />
            <el-option label="用户" value="2" />
            <el-option label="测试用户" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmroles()"> 确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
