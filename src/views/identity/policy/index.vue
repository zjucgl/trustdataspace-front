<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="roleName" label="政策名称">
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
          <el-table-column prop="id" label="政策名称" align="center">
            <template #default="{ row }">
              <div>{{ definitoinMap.get(row.id) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="permission" label="访问许可" align="center" />
          <el-table-column prop="prohibition" label="访问禁止" align="center" />
          <el-table-column prop="obligation" label="访问义务" align="center" />
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
      <policy-form
        v-model:visible="formVisible"
        :data="formData"
        @save="saveDefinition"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable, ElMessageBox } from "element-plus";
import { getWatermark } from "@/utils/role";
import PolicyForm from "./policy-definition.vue";
import {
  ContractData,
  createContract,
  deleteContract
} from "@/api/mvd/contractdefinition";
import { getPolicyById, getPolicyList, PolicyData } from "@/api/mvd/policy";
import { definitoinMap } from "@/utils/mvd";

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

const tableData = ref({
  data: []
});
// get contract list
const setTableData = () => {
  loading.value = true;
  getPolicyList()
    .then(res => {
      console.log("res=", res);
      tableData.value.data = extractedData(res);
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
  getPolicyById(searchForm.jsonParam.roleName)
    .then(res => {
      tableData.value.data = [];
      console.log("res=", res);
      res = [res];
      tableData.value.data = extractedData(res);
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

const formData = ref<PolicyData>();
const formVisible = ref(false);

const add = () => {
  formData.value = {
    id: "",
    permission: "",
    prohibition: "",
    obligation: ""
  };
  formVisible.value = true;
};

const edit = (data: any) => {
  formVisible.value = true;
  formData.value = data;
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

// 提取并格式化数据
const extractedData = (data: any) => {
  return data.map(policy => {
    const { "@id": id, policy: policyData } = policy;

    // 提取权限
    const permission =
      policyData["odrl:permission"]?.["odrl:action"]?.["@id"] || "无";

    // 提取禁止项
    const prohibition =
      policyData["odrl:prohibition"]?.length > 0
        ? policyData["odrl:prohibition"]
        : "无";

    // 提取义务并进行格式化
    const obligation = policyData["odrl:obligation"]?.["odrl:constraint"]
      ? policyData["odrl:obligation"]["odrl:constraint"]
      : "无";

    // 格式化义务为 dataAccess: processing
    let formattedObligation = "无";
    if (obligation !== "null") {
      const leftOperand = obligation["odrl:leftOperand"];
      const rightOperand = obligation["odrl:rightOperand"];
      const operator = obligation["odrl:operator"];

      if (
        leftOperand?.["@id"] === "DataAccess.level" &&
        operator?.["@id"] === "odrl:eq"
      ) {
        formattedObligation = `dataAccess:${rightOperand}`;
      }
    }

    return {
      id,
      permission,
      prohibition,
      obligation: formattedObligation
    };
  });
};
</script>
