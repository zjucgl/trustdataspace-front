<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between mb-2">
        <div />
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <div style="height: calc(100vh - 260px)">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData"
          class="w-full"
          :header-cell-style="{
            backgroundColor: '#F5F7FA',
            color: '#606266',
            fontWeight: 400
          }"
          row-key="deptId"
          default-expand-all
        >
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column prop="deptName" label="部门名称" align="center" />
          <el-table-column
            prop="participantId"
            label="参与者id"
            align="center"
          />
          <el-table-column prop="deptInfo" label="部门信息" align="center" />
          <el-table-column prop="gmtCreate" label="创建时间" align="center" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button link type="primary" @click="edit(row)">
                编辑
              </el-button>
              <el-button
                v-if="row.deptFather !== 0"
                link
                type="primary"
                @click="remove([row.deptId])"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <dept-form
        v-model:visible="formVisible"
        :data="formData"
        :deptOptions="tableData"
        @save="save"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  type DeptData,
  getDeptPage,
  saveDept,
  removeDept
} from "@/api/orga/dept";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type ElTable, ElMessageBox } from "element-plus";
import deptForm from "./form.vue";
import { getWatermark } from "@/utils/role";
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();

const loading = ref(true);

const tableData = ref([]);

const setTableData = () => {
  loading.value = true;
  getDeptPage()
    .then(res => {
      tableData.value = res.result;
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();

const formData = ref<DeptData>();
const formVisible = ref(false);

const add = () => {
  formData.value = {
    deptName: "",
    deptId: null,
    deptInfo: "",
    deptFather: 0,
    leaf: false
  };
  formVisible.value = true;
};

const edit = (data: DeptData) => {
  formVisible.value = true;
  formData.value = data;
};

const save = (data: DeptData) => {
  saveDept(data)
    .then(() => {
      showSuccessMessage("保存成功");
      formVisible.value = false;
      setTableData();
    })
    .catch(showErrorMessage);
};

const selection = ref<DeptData[]>([]);
const remove = async ids => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "删除提示", { type: "warning" });
    loading.value = true;
    const deptIds = ids ?? selection.value.map(el => el.deptId);
    console.log("ids=", deptIds);
    await removeDept({ ids: deptIds });
    showSuccessMessage("删除成功");
    // search();
    setTableData();
  } catch (err) {
    if (err !== "cancel") {
      showErrorMessage(err);
    }
  } finally {
    loading.value = false;
  }
};
</script>
