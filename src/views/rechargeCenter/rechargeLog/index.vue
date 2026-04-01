<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="userName" label="充值用户">
            <el-input
              v-model="searchForm.jsonParam.userName"
              placeholder="请输入"
              class="w-40"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetSearch(formRef)">重置</el-button>
          </el-form-item>
        </el-form>
        <div />
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
            fontWeight: 400,
            'text-align': 'center'
          }"
          height="100%"
        >
          <el-table-column
            type="index"
            width="200"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="充值用户"
            show-overflow-tooltip
            width="200"
            min-width="40"
            align="center"
          />
          <el-table-column
            prop="amount"
            label="充值金额"
            width="200"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="rechargeTime"
            label="充值时间"
            show-overflow-tooltip
            min-width="40"
            align="center"
          />
          <el-table-column
            prop="status"
            label="审核状态"
            show-overflow-tooltip
            min-width="40"
            align="center"
            :filters="[
              { text: '待审核', value: '0' },
              { text: '已通过', value: '1' },
              { text: '未通过', value: '2' }
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="{ row }">
              <div v-if="row.status === 0">
                <el-button type="success" size="default" @click="approve(row)"
                  >通过</el-button
                >
                <el-button type="danger" size="default" @click="reject(row)"
                  >不通过</el-button
                >
              </div>
              <div v-else>
                {{ row.status === 1 ? "已通过" : "未通过" }}
              </div>
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
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { type LogData, type LogParam } from "@/api/system/rechargeLog";
import {
  getRechargeLogPage,
  updateRechargeLog
} from "@/api/system/rechargeLog";
import { type FormInstance } from "element-plus";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { getWatermark } from "@/utils/role";

// 水印字体
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();

const loading = ref(false);
const formRef = ref<FormInstance>();
const filterTag = (value: string, row: any) => {
  if (value === "0") {
    return row.status === 0;
  } else if (value === "1") {
    return row.status === 1;
  } else if (value === "2") {
    return row.status === 2;
  }
};
const searchForm: QueryParam<LogParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    userId: null,
    userName: null
  }
});

const tableData = ref<TableData<LogData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});

// 拉取表格数据
const setTableData = () => {
  loading.value = true;
  getRechargeLogPage(searchForm)
    .then(res => {
      console.log("获取充值日志成功:", res);
      tableData.value = res;
    })
    .catch(err => {
      console.error("请求失败:", err.response || err.message);
      showErrorMessage("获取充值日志失败，请稍后再试！");
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();

// 搜索和重置
const search = () => {
  searchForm.pageNo = 1;
  setTableData();
};

const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  search();
};

// 审核操作 - 修改后包含userId
const approve = async (row: LogData) => {
  try {
    await updateRechargeLog({
      logId: row.id,
      userId: row.userId, // 传递userId
      status: 1,
      amount: row.amount // 传递金额
    });
    showSuccessMessage("审核通过");
    setTableData();
  } catch (error) {
    showErrorMessage("审核失败，请稍后再试");
  }
};

const reject = async (row: LogData) => {
  try {
    await updateRechargeLog({
      logId: row.id,
      userId: row.userId, // 传递userId
      status: 2,
      amount: row.amount // 传递金额
    });
    showSuccessMessage("操作成功");
    setTableData();
  } catch (error) {
    console.error("操作失败:", error);
    showErrorMessage("操作失败，请稍后再试");
  }
};
</script>
