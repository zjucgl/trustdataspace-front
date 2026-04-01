<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <!-- 充值区域 -->
      <div class="mb-8 bg-white p-6 rounded-2xl shadow">
        <h2 class="text-xl font-semibold mb-4">账户充值</h2>

        <div class="flex items-center justify-between">
          <!-- 左边：充值表单 -->
          <div class="flex gap-4 items-center">
            <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
              <el-input
                v-model="rechargeForm.amount"
                :min="0"
                placeholder="请输入充值金额"
                style="width: 200px"
                type="number"
              />
            </el-form>

            <el-button
              type="primary"
              :loading="loading"
              :disabled="!rechargeForm.amount"
              @click="handleRecharge"
            >
              充值
            </el-button>
          </div>

          <!-- 中间留白 -->
          <div class="flex-1" />

          <!-- 右侧：余额展示 -->
          <div class="mr-20">
            <div
              class="flex items-center gap-2 bg-gray-100 px-5 py-3 rounded-xl shadow-inner text-xl text-gray-800 font-semibold"
            >
              <!-- 钱包图标（SVG） -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-2a2 2 0 00-2-2h-4a2 2 0 000 4h4a2 2 0 002-2z"
                />
              </svg>
              当前余额：<span class="text-blue-600">{{ userMoney }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full">
        <!-- 表格区域 -->
        <el-table
          v-loading="loading"
          :data="tableData.data"
          height="calc(100vh - 400px)"
          class="w-full"
          :header-cell-style="{
            backgroundColor: '#F5F7FA',
            color: '#606266',
            fontWeight: 400,
            'text-align': 'center'
          }"
        >
          <el-table-column
            min-width="20px"
            type="index"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="充值用户"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="amount" label="充值金额" align="center" />
          <el-table-column
            prop="rechargeTime"
            label="充值时间"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="auditStatus"
            label="审核状态"
            align="center"
            :formatter="formatAuditStatus"
            :filters="[
              { text: '待审核', value: '0' },
              { text: '已通过', value: '1' },
              { text: '未通过', value: '2' }
            ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          />
        </el-table>

        <!-- 分页区域 -->
        <div class="flex justify-end mt-4">
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getRechargeLogPage,
  LogData,
  addRechargeLog,
  LogParam
} from "@/api/system/rechargeLog";
import { getWatermark } from "@/utils/role";
import { getUserDeposits } from "@/api/system/minerList";

// 水印配置
const font = reactive({ color: "rgba(0, 0, 0, .15)" });
const watermark = getWatermark();

// 表单与充值逻辑
const amount = ref<number | null>(null);
const loading = ref(false);

const rechargeForm = ref<LogParam>({
  amount: null,
  userId: null // 也可以不传
});
const filterTag = (value: string, row: any) => {
  if (value === "0") {
    return row.status === 0;
  } else if (value === "1") {
    return row.status === 1;
  } else if (value === "2") {
    return row.status === 2;
  }
};
// const handleRecharge = () => {
//   //提交申请
//   //这个用户就多了一条充值记录
//   try {
//     addRechargeLog(searchForm).then((res) => {
//       console.log("充值申请成功:", res);
//       ElMessage.success("充值申请成功");
//     });
//     ElMessage.success("添加成功");
//     setTableData(); // 刷新表格数据
//   } catch (error) {
//     ElMessage.error("添加失败");
//   }
// }
const handleRecharge = async () => {
  loading.value = true;
  try {
    await addRechargeLog(rechargeForm.value);
    rechargeForm.value.amount = null;
    ElMessage.success("充值申请成功");
    setTableData();
  } catch (e) {
    ElMessage.error("充值失败");
  } finally {
    loading.value = false;
  }
};

// 日志查询逻辑
// const formRef = ref<FormInstance>();
const searchForm: QueryParam<LogParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    userId: null,
    amount: null
  }
});

const tableData = ref<TableData<LogData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});

const formatAuditStatus = (row: LogData) => {
  switch (row.status) {
    case 0:
      return "审核中";
    case 1:
      return "已通过";
    case 2:
      return "未通过";
  }
};

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
      ElMessage.error("获取充值日志失败，请稍后再试！");
    })
    .finally(() => {
      loading.value = false;
    });
};

const search = () => {
  searchForm.pageNo = 1;
  setTableData();
};
const userMoney = ref(0);
const getUserDes = () => {
  getUserDeposits()
    .then(res => {
      userMoney.value = res.result;
    })
    .catch(err => {
      console.error(err);
    });
};
// 初始化
onMounted(() => {
  setTableData();
  getUserDes();
});
</script>

<style scoped>
.text-red-500 {
  color: #f56c6c;
}

.text-green-500 {
  color: #67c23a;
}
</style>
