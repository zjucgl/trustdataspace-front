<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form :inline="true" :model="searchForm.jsonParam" ref="formRef">
          <el-form-item prop="logContent" label="日志内容">
            <el-input
              v-model="searchForm.jsonParam.logContent"
              placeholder="请输入"
              class="w-40"
            />
          </el-form-item>
          <el-form-item label="状态" prop="logStatus">
            <el-select
              v-model="searchForm.jsonParam.logStatus"
              filterable
              clearable
              class="!w-40"
              placeholder="请选择日志状态"
            >
              <el-option :label="'交易完成'" :value="'交易完成'" />
              <el-option :label="'交易失败'" :value="'交易失败'" />
            </el-select>
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
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="logType"
            label="操作类型"
            show-overflow-tooltip
            min-width="40"
            align="center"
          />
          <el-table-column
            prop="logContent"
            label="详细内容"
            show-overflow-tooltip
          />
          <el-table-column
            prop="totalAmount"
            label="交易总金额"
            show-overflow-tooltip
            align="center"
            min-width="20"
          />
          <el-table-column
            prop="userName"
            label="用户姓名"
            show-overflow-tooltip
            min-width="20"
            align="center"
          />
          <el-table-column
            prop="logStatus"
            label="记录状态"
            show-overflow-tooltip
            min-width="20"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="statusTag(row.logStatus)">{{
                row.logStatus
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="记录时间"
            show-overflow-tooltip
            min-width="40"
            align="center"
          />
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

      <!-- <notice-form
      :data="formData"
      v-model:visible="formVisible"
      @save="save"
      :deviceOptions="deviceOptionData"
    /> -->
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { type LogData, type LogParam, getLogPage } from "@/api/system/log";
import { showErrorMessage } from "@/utils/message";
import { type FormInstance, type ElTable } from "element-plus";
import { getWatermark } from "@/utils/role";
import { getTraceLogPage } from "@/api/system/tracelog";
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();

const loading = ref(false);
const formRef = ref<FormInstance>();

const searchForm: QueryParam<LogParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    logStatus: "",
    logContent: "",
    userId: null
  }
});

const tableData = ref<TableData<LogData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});

const setTableData = () => {
  loading.value = true;
  getTraceLogPage(searchForm)
    .then(res => {
      tableData.value = res;
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

const formData = ref<LogData>();
const formVisible = ref(false);

const edit = (data: LogData) => {
  formVisible.value = true;
  formData.value = data;
};

const statusTag = (status: string) => {
  let tag: any = "";
  switch (status) {
    case "交易完成":
      tag = "success";
      break;
    case "执行异常":
      tag = "danger";
      break;
    default:
      tag = "";
      break;
  }
  return tag;
};
</script>
