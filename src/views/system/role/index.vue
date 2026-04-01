<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="roleName" label="角色名称">
            <el-input
              v-model="searchForm.jsonParam.roleName"
              placeholder="请输入"
              class="w-40"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetSearch(formRef)">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button
            type="primary"
            :disabled="selection.length === 0"
            @click="remove(selection)"
          >
            批量删除
          </el-button>
          <el-button @click="toggleSelection">重置选择</el-button>
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
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column prop="roleName" label="角色名称" align="center" />
          <el-table-column prop="roleCode" label="角色标识" align="center" />
          <el-table-column prop="roleInfo" label="备注信息" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="edit(row)">
                编辑
              </el-button>
              <el-button link type="primary" @click="editMenu(row)">
                授权
              </el-button>
              <el-button link type="primary" @click="remove([row.roleId])"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="absolute bottom-8 right-8 w-full">
        <div class="flex-bc">
          <div />
          <el-pagination
            v-if="tableData.totalCount > 0"
            v-model:current-page="searchForm.pageNo"
            v-model:page-size="searchForm.pageSize"
            background
            :page-sizes="[10, 20, 30]"
            layout="prev, pager, next, jumper, sizes"
            :total="tableData.totalCount"
            @size-change="search"
            @current-change="setTableData"
          />
        </div>
      </div>

      <role-form v-model:visible="formVisible" :data="formData" @save="save" />
      <menu-form
        v-model:visible="menuVisible"
        :data="menuData"
        @save="savePermission"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  type RoleData,
  type RoleParam,
  type MenuTree,
  getRolePage,
  saveRole,
  saveRolePermission,
  removeRole
} from "@/api/system/role";
import { useUserStoreHook } from "@/store/modules/user";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable, ElMessageBox } from "element-plus";
import roleForm from "./form.vue";
import menuForm from "./menuTree.vue";
import { getWatermark } from "@/utils/role";
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();

const loading = ref(false);
const formRef = ref<FormInstance>();
const currentRoles = useUserStoreHook()?.roles;

const searchForm: QueryParam<RoleParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    roleName: ""
  }
});

const tableData = ref<TableData<RoleData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});

const setTableData = () => {
  loading.value = true;
  getRolePage(searchForm)
    .then(res => {
      tableData.value = res.result;
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();

const search = () => {
  searchForm.pageNo = 1;
  setTableData();
};

const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  search();
};

const formData = ref<RoleData>();
const formVisible = ref(false);
const menuData = ref<RoleData>();
const menuVisible = ref(false);

const add = () => {
  formData.value = {
    roleId: null,
    roleName: "",
    roleCode: "",
    roleInfo: ""
  };
  formVisible.value = true;
};

const edit = (data: RoleData) => {
  formVisible.value = true;
  formData.value = data;
};
const save = (data: RoleData) => {
  saveRole(data)
    .then(() => {
      showSuccessMessage("保存成功");
      formVisible.value = false;
      if (data.roleId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage);
};
const editMenu = (data: RoleData) => {
  menuVisible.value = true;
  menuData.value = data;
};
const savePermission = (data: RoleData) => {
  saveRolePermission(data)
    .then(() => {
      showSuccessMessage("保存成功");
      menuVisible.value = false;
      if (data.roleId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage)
    .finally(() => {
      // console.log("currentRoles=", currentRoles);
      if (data.roleCode === currentRoles[0]) {
        location.reload();
      }
    });
};

//批量删除
const tableRef = ref<InstanceType<typeof ElTable>>();
const selection = ref<number[]>([]);
const remove = async (ids: number[]) => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "删除提示", { type: "warning" });
    loading.value = true;
    console.log("ids=", ids);
    await removeRole({ ids });
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
const handleSelectionChange = (val: RoleData[]) => {
  selection.value = val.map(item => item.roleId);
};
</script>
