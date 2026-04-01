<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div
      class="grid grid-cols-3 gap-8"
      style="margin-top: 3vh; margin-left: 3vh"
    >
      <transition name="fade">
        <numCard class="col-span-1" :data="cardData[0]" />
      </transition>
      <numCard class="col-span-1" :data="cardData[1]" />
      <numCard class="col-span-1" :data="cardData[2]" />
    </div>
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="roleName" label="节点名称">
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
        >
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="nodeName"
            label="节点名称"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">{{ scope.row.nodeName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="nodeId"
            label="节点ID"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">{{ scope.row.nodeId }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="enCode"
            label="节点端口"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">{{ scope.row.enCode }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="blockNumber"
            label="区块链当前高度"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">{{ scope.row.blockNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="headId"
            label="节点地址"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">{{ scope.row.headId }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="mainNode"
            label="节点类型"
            show-overflow-tooltip
            align="center"
          >
            <template v-slot="scope">
              <div @click="ff(scope.row)">
                {{ scope.row.mainNode === 1 ? "主节点" : "子节点" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                v-show="scope.row.mainNode === 1"
                link
                :type="scope.row.minerStatus === 1 ? 'danger' : 'success'"
                size="default"
                @click="edit(scope.row, scope.$index)"
              >
                {{ scope.row.minerStatus === 1 ? "停止挖矿" : "开启挖矿" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <policy-form
        v-model:visible="formVisible"
        :data="formData"
        @save="saveDefinition"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import numCard from "../../dashboard/components/num-card.vue";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import {
  ElMessage,
  ElMessageBox,
  type ElTable,
  type FormInstance
} from "element-plus";
import { getWatermark } from "@/utils/role";
import PolicyForm from "./policy-definition.vue";
import {
  ContractData,
  createContract,
  deleteContract
} from "@/api/mvd/contractdefinition";
import { PolicyData } from "@/api/mvd/policy";
import { addNode, minerList, nodeList } from "@/api/system/minerList";
import { getBalance, startMining, stopMining } from "@/api/system/miner";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const loading = ref(false);
const formRef = ref<FormInstance>();

const searchForm: any = reactive({
  jsonParam: {
    roleName: ""
  }
});
const cardData = ref([
  { name: "矿工资产", value: null },
  { name: "区块链当前高度", value: null },
  { name: "节点地址", value: null }
]);
const tableData = ref({
  data: []
});
// get contract list
const setTableData = () => {
  loading.value = true;
  nodeList("")
    .then(async res => {
      console.log("res=", res);
      res.result.forEach((item: any) => {
        item.minerStatus = 0;
      });
      tableData.value.data = res.result;
      await ff(tableData.value.data[0]);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  // get contract list
  setTableData();
});

// get contract by id
const setTableDataById = () => {
  loading.value = true;
  console.log(searchForm.jsonParam.roleName);
  nodeList(searchForm.jsonParam.roleName)
    .then(res => {
      tableData.value.data = [];
      console.log("res=", res);
      res.result.forEach((item: any) => {
        item.minerStatus = 0;
      });
      // res = [res];
      tableData.value.data = res.result;
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
// search
const search = () => {
  setTableDataById();
};

const saveDefinition = async (data: any) => {
  console.log("save data=", data);
  try {
    await addNode(data);
  } catch (error) {
    showErrorMessage("保存失败");
  }
};
// reset search
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  minerList()
    .then(res => {
      console.log("res=", res);
      res.result.forEach((item: any) => {
        item.minerStatus = 0;
      });
      tableData.value.data = res.result;
      ff(tableData.value.data[0]);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

const formData = ref<any>();
const formVisible = ref(false);

const add = () => {
  formData.value = {
    enode: ""
  };
  formVisible.value = true;
};

const edit = async (data: any, index: number) => {
  // formVisible.value = true;
  // formData.value = data;
  // 启动挖矿
  if (tableData.value.data[index].minerStatus === 1) {
    try {
      await fetchBalance();
      await stopMining()
        .then(res => {
          if (res) {
            ElMessage.success("已停止挖矿");
            tableData.value.data[index].minerStatus = 0;
          } else {
            ElMessage.error("停止挖矿失败");
          }
        })
        .catch(error => {
          ElMessage.error(error);
        });
    } catch (error) {
      ElMessage.error("停止挖矿失败");
    }
  } else {
    try {
      await fetchBalance();
      await startMining()
        .then(res => {
          if (res) {
            ElMessage.success("已启动挖矿");
            tableData.value.data[index].minerStatus = 1;
          } else {
            ElMessage.error("启动挖矿失败");
          }
        })
        .catch(error => {
          ElMessage.error(error);
        });
    } catch (error) {
      ElMessage.error("启动挖矿失败");
    }
  }
  await ff(data);
};
//批量删除
const tableRef = ref<InstanceType<typeof ElTable>>();
const selection = ref<number[]>([]);

//重置选择
const toggleSelection = () => {
  tableRef.value!.clearSelection();
};
const handleSelectionChange = (val: ContractData[]) => {
  selection.value = val.map(item => item["@id"]);
};
const ff = async data => {
  cardData.value[1].value = data.blockNumber;
  cardData.value[0].value = (await fetchBalance()) + " ETH";
  // cardData.value[0].value = data.;
  cardData.value[2].value = data.headId;
};

// 获取余额
const fetchBalance = async () => {
  try {
    cardData.value[0].value = await getBalance();
    return cardData.value[0].value;
  } catch (error) {
    ElMessage.error("获取 ETH 值失败");
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
