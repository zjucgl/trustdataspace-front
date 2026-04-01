<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="roleName" label="合约名称">
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
          <el-table-column prop="@id" label="合约名称" align="center" />
          <el-table-column prop="accessPolicyId" label="访问策略" align="center"
            ><template #default="{ row }">
              <div>{{ definitoinMap.get(row.accessPolicyId) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="contractPolicyId"
            label="合同策略"
            align="center"
          >
            <template #default="{ row }">
              <div>{{ definitoinMap.get(row.contractPolicyId) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="assetsSelector.operandRight"
            label="绑定资产"
            align="center"
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="edit(row)">
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="remove([row['@id']])"
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
      <contract-form
        v-model:visible="formVisible"
        :data="formData"
        @save="saveDefinition"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import contractForm from "./contract-definition.vue";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable, ElMessageBox } from "element-plus";
import { getWatermark } from "@/utils/role";
import {
  ContractData,
  createContract,
  deleteContract,
  getContractById,
  getContractList
} from "@/api/mvd/contractdefinition";
import { queryAssetByUserId } from "@/api/system/asset";
import { definitoinMap } from "@/utils/mvd";
import { isArray } from "@pureadmin/utils";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();

const loading = ref(false);
const formRef = ref<FormInstance>();

const searchForm: any = reactive({
  pageNo: 1,
  pageSize: 10,
  pageCount: 0,
  jsonParam: {
    roleName: ""
  }
});

const tableData = ref({
  data: [],
  totalCount: 1
});
// get contract list
const systemAssetMap = new Map<string, any>();
const setTableData = () => {
  loading.value = true;
  queryAssetByUserId()
    .then(res => {
      const data = res.result;
      if (isArray(data)) {
        data.forEach(item => {
          systemAssetMap.set(item.assetId, item);
        });
      }
    })
    .finally(() => {
      filterTableData();
    });
};
const filterTableData = () => {
  getContractList()
    .then(res => {
      console.log("res=", res);
      const list = [];
      res.forEach(item => {
        if (systemAssetMap.has(item.assetsSelector.operandRight)) {
          list.push(item);
        }
      });
      tableData.value.data = list;
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();
// get contract by id
const setTableDataById = () => {
  loading.value = true;
  console.log(searchForm.jsonParam.roleName);
  getContractById(searchForm.jsonParam.roleName)
    .then(res => {
      tableData.value.data = [];
      console.log("res=", res);
      tableData.value.data.push(res);
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

const saveDefinition = async (data: ContractData) => {
  console.log("save data=", data);
  const params = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@id": data.Id,
    "@type": "ContractDefinition",
    accessPolicyId: data.accessPolicyId,
    contractPolicyId: data.contractPolicyId,
    assetsSelector: {
      "@type": "Criterion",
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "=",
      operandRight: data.assetId
    }
  };
  try {
    await createContract(params);
    loading.value = true;
    showSuccessMessage("保存成功");
    formVisible.value = false;
    setTableData();
  } catch (err) {
    showErrorMessage(err);
  } finally {
    loading.value = false;
  }
};
// reset search
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  search();
};

const formData = ref<ContractData>();
const formVisible = ref(false);

const edit = (data: any) => {
  formVisible.value = true;
  formData.value = data;
  formData.value.assetId = data.assetsSelector.operandRight;
  formData.value.Id = data["@id"];
};
//批量删除
const tableRef = ref<InstanceType<typeof ElTable>>();
const selection = ref<number[]>([]);
const remove = async (ids: number[]) => {
  try {
    await ElMessageBox.confirm("确定删除吗?", "删除提示", { type: "warning" });
    loading.value = true;
    console.log(ids);
    for (const id of ids) {
      console.log(id);
      await deleteContract(id);
    }
    showSuccessMessage("删除成功");
    setTableData();
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
const handleSelectionChange = (val: ContractData[]) => {
  selection.value = val.map(item => item["@id"]);
};
</script>
