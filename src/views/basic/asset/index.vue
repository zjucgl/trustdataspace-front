<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form ref="formRef" :inline="true" :model="searchForm.jsonParam">
          <el-form-item prop="assetId" label="资产名称">
            <el-input
              v-model="searchForm.jsonParam.assetId"
              placeholder="请输入"
              class="w-40"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button @click="resetSearch(formRef)">重置</el-button>
            <el-button type="primary" @click="addAsset">新增</el-button>
            <!-- <el-button type="primary" @click="updateAllAsset">
              批量定义
            </el-button>
            <el-button
              type="success"
              :loading="importLoading"
              @click="openImport"
              >批量导入</el-button
            > -->
            <!-- <el-button
              type="danger"
              :loading="updateLoading"
              @click="updateWorkFile"
              >批量更新</el-button
            > -->
          </el-form-item>
        </el-form>
        <div>
          <!-- <el-button type="primary">新增</el-button> -->
        </div>
      </div>

      <div style="height: calc(100vh - 260px)">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="pageData"
          class="w-full"
          :header-cell-style="{
            backgroundColor: '#F5F7FA',
            color: '#606266',
            fontWeight: 400
          }"
          height="100%"
          max-height="100%"
        >
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="@id"
            label="资产名称(id)"
            header-align="center"
          />
          <el-table-column
            prop="dataAddress.baseUrl"
            label="链接地址"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="userName"
            label="上传者"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="assetPrice"
            label="金额"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="assetQuantity"
            label="数量"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="properties.description"
            label="备注信息"
            align="center"
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-popconfirm
                v-if="
                  row.properties.contractdefinition !== null &&
                  row.properties.contractdefinition !== undefined
                "
                title="确认解除该合约?"
                :width="180"
                @confirm="removeDefinition(row)"
              >
                <template #reference>
                  <el-button link type="warning"> 解除合约 </el-button>
                </template>
              </el-popconfirm>
              <el-button
                v-else
                link
                type="success"
                @click="editDefinition(row)"
              >
                定义合约
              </el-button>
              <el-button link type="primary" @click="editAsset(row)">
                编辑
              </el-button>
              <el-popconfirm
                title="确认删除该资产?"
                :width="180"
                @confirm="remove(row)"
              >
                <template #reference>
                  <el-button link type="primary"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="absolute bottom-8 right-8 w-full">
        <div class="flex-bc">
          <div />
          <el-pagination
            v-if="pageTotal > 0"
            v-model:current-page="searchForm.pageNo"
            v-model:page-size="searchForm.pageSize"
            background
            :page-sizes="[10, 20, 30]"
            layout="prev, pager, next, jumper, sizes"
            :total="pageTotal"
            @size-change="search"
            @current-change="setTableData"
          />
        </div>
      </div>

      <asset-form
        v-model:visible="formVisible"
        :data="formData"
        :deviceOptions="[]"
        @save="save"
      />
      <definition-form
        v-model:visible="definitionFormVisible"
        :data="definitionFormData"
        @save="saveDefinition"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  type AssetData,
  type DefinitionData,
  getAssetList,
  creatAsset,
  updateAsset,
  removeAsset,
  creatContractdefinitions
} from "@/api/mvd/asset";
import {
  getSystemAssetList,
  createSystemAsset,
  deleteSystemAsset,
  queryAssetByUserId,
  updateHasPolicy
} from "@/api/system/asset";
import { getWorkFileList } from "@/api/utils/workfile";
import {
  showErrorMessage,
  showSuccessMessage,
  showWaringMessage
} from "@/utils/message";
import { getContractList, deleteContract } from "@/api/mvd/contractdefinition";
import { type FormInstance, type ElTable } from "element-plus";
import axios from "axios";
import AssetForm from "./form.vue";
import DefinitionForm from "./form-definition.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDark } from "@pureadmin/utils";
import { getWatermark } from "@/utils/role";
import { getPolicyList } from "@/api/mvd/policy";
import { getParticipantType } from "@/utils/mvd";
import { isArray } from "@pureadmin/utils";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const webType = getParticipantType();
console.log("webType=", webType);
const { isDark } = useDark();
watch(
  isDark,
  () => {
    font.color = isDark.value
      ? "rgba(255, 255, 255, .15)"
      : "rgba(0, 0, 0, .15)";
  },
  {
    immediate: true
  }
);
const loading = ref(false);
const importLoading = ref(false);
const updateLoading = ref(false);
const formRef = ref<FormInstance>();
const searchForm: QueryParam<any> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    assetId: ""
  }
});
const tableData = ref<any>([]);
const assetDataList = ref<Array<any>>([]);
const pageTotal = ref(0);
const pageData = ref<Array<any>>([]);

const systemAssetMap = new Map<string, any>();
const assetMap = new Map<string, any>();
const setTableData = () => {
  loading.value = true;
  // getSystemAssetList().then(res => {
  //   const data = res.result;
  //   data.forEach(item => {
  //     systemAssetMap.set(item.assetId, item);
  //   });
  //   setAssetList();
  // });
  queryAssetByUserId().then(res => {
    const data = res.result;
    if (isArray(data)) {
      data.forEach(item => {
        systemAssetMap.set(item.assetId, item);
      });
    }
    setAssetList();
  });
};
const setAssetList = () => {
  const searchJson = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec",
    limit: 50000,
    offset: 0,
    sortOrder: "DESC",
    sortField: "createdAt",
    filterExpression: [
      {
        operandLeft: "id",
        operator: "LIKE",
        operandRight: "%" + searchForm.jsonParam.assetId + "%"
      }
    ]
  };
  getAssetList(searchJson)
    .then(res => {
      //tableData.value = res;
      assetDataList.value = res;
      convertDataToPage(res);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      getPageTotal();
      loading.value = false;
    });
};
const convertDataToPage = (data: Array<any>) => {
  const list = [];
  data.forEach(item => {
    assetMap.set(item["@id"], JSON.parse(JSON.stringify(item)));
    if (systemAssetMap.has(item["@id"])) {
      const systemAsset = systemAssetMap.get(item["@id"]);
      item.assetPrice = systemAsset?.assetPrice || 0;
      item.assetQuantity = systemAsset?.assetQuantity || 0;
      item.userName = systemAsset?.userName || "";
      list.push(item);
    }
  });
  tableData.value = list;
};
const getPageTotal = () => {
  const pageNo = searchForm.pageNo;
  const pageSize = searchForm.pageSize;
  const pagelist = [];
  let searchlist = [];
  if (searchForm.jsonParam.assetId === "") {
    searchlist = tableData.value;
  } else {
    searchlist = tableData.value.filter(item =>
      item["@id"].includes(searchForm.jsonParam.assetId)
    );
  }
  pageTotal.value = searchlist.length;
  for (let i = (pageNo - 1) * pageSize; i < pageNo * pageSize; i++) {
    if (i < pageTotal.value) {
      pagelist.push(searchlist[i]);
    } else {
      break;
    }
  }
  pageData.value = pagelist;
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

const formData = ref<any>();
const formVisible = ref(false);

const definitionFormData = ref<any>();
const definitionFormVisible = ref(false);

const addAsset = (data: any) => {
  data = {
    id: null,
    baseUrl: "",
    description: "",
    assetPrice: 0,
    assetQuantity: 1,
    type: "add"
  };
  formVisible.value = true;
  formData.value = data;
};
const editAsset = (row: any) => {
  const data = {
    id: row["@id"],
    baseUrl: row.dataAddress.baseUrl,
    description: row.properties.description,
    contractdefinition: row.properties.contractdefinition,
    assetPrice: row.assetPrice,
    assetQuantity: row.assetQuantity,
    type: "update"
  };
  formVisible.value = true;
  formData.value = data;
};
const editDefinition = async (data: any) => {
  await getPolicy();
  const editData = {
    id: null,
    accessPolicyId: null,
    contractPolicyId: null,
    assetId: data["@id"],
    policyList: policyList.value
  };
  definitionFormData.value = editData;
  definitionFormVisible.value = true;
};
const remove = (row: any) => {
  const data = row["@id"];
  console.log("delete data=", data);
  removeAsset(data)
    .then(() => {
      // showSuccessMessage("删除成功");
      //setTableData();
      removeSystemAsset(data);
    })
    .catch(res => {
      console.log("res=", res);
      const message = res?.response?.data?.[0]?.message;
      if (message) {
        if (
          message ===
          "Asset " +
            data +
            " cannot be deleted as it is referenced by at least one contract agreement"
        ) {
          showErrorMessage("该资产已被至少一个合约使用，无法删除");
        } else {
          showErrorMessage(message);
        }
      } else {
        showErrorMessage(res.message);
      }
    });
};
const removeSystemAsset = (assetId: any) => {
  deleteSystemAsset({ assetId: assetId })
    .then(res => {
      showSuccessMessage("删除成功");
      setTableData();
    })
    .catch(showErrorMessage);
};
const removeDefinition = (row: any) => {
  deleteContract(row.properties.contractdefinition)
    .then(() => {
      const item = JSON.parse(JSON.stringify(row));
      item.properties.contractdefinition = null;
      updateAsset(item);
      updateHasPolicy({ assetId: row["@id"], hasPolicy: 0 }).then(() => {
        showSuccessMessage("解除合约成功");
        setTableData();
      });
    })
    .catch(showErrorMessage);
};
const save = (data: any) => {
  const assetData = transferToAssetData(data);
  if (data.type === "add") {
    creatAsset(assetData)
      .then(() => {
        //showSuccessMessage("创建成功");
        // formVisible.value = false;
        addSystemAsset(data);
        // setTableData();
      })
      .catch(res => {
        console.log("res=", res);
        const message = res?.response?.data?.[0]?.message;
        if (message) {
          if (message === "Asset with ID " + data.id + " already exists") {
            showErrorMessage("已存在相同名称的资产，请重新输入");
          } else {
            showErrorMessage(message);
          }
        } else {
          showErrorMessage(res.message);
        }
      });
  } else {
    updateAsset(assetData).then(() => {
      showSuccessMessage("更新成功");
      formVisible.value = false;
      setTableData();
    });
  }
};
const addSystemAsset = (data: any) => {
  const systemAssetData = {
    assetId: data.id,
    assetQuantity: data.assetQuantity,
    assetPrice: data.assetPrice,
    assetDescription: data.description,
    path: data.path
  };
  createSystemAsset(systemAssetData)
    .then(() => {
      showSuccessMessage("创建成功");
      formVisible.value = false;
      setTableData();
    })
    .catch(showErrorMessage);
};

const saveDefinition = (data: DefinitionData) => {
  console.log("save data=", data);
  console.log("asset=", assetMap.get(data.assetId));
  const definitionData = transferToDefinitionData(data);
  creatContractdefinitions(definitionData)
    .then(() => {
      alert("创建成功,可在联邦目录中查看合约资产");
      showSuccessMessage("创建成功");
      definitionFormVisible.value = false;
      const item = assetMap.get(data.assetId);
      item.properties.contractdefinition = data.id;
      updateHasPolicy({ assetId: data.assetId, hasPolicy: 1 }).then(() => {
        updateAsset(item).then(() => {
          setTableData();
        });
      });
    })
    .catch(res => {
      console.log("res=", res);
      const message = res?.response?.data?.[0]?.message;
      if (message) {
        if (
          message ===
          "Contract Definition with ID " +
            definitionData["@id"] +
            " already exists"
        ) {
          showErrorMessage("该合约名称已存在，请重新输入");
        } else {
          showErrorMessage(message);
        }
      } else {
        showErrorMessage(res.message);
      }
    });
};
const updateAllAsset = async () => {
  console.log("assetDataList.value", assetDataList.value);
  const json = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
    },
    "@type": "QuerySpec",
    filterExpression: [
      {
        operandLeft: "assetsSelector.operandRight",
        operator: "=",
        operandRight: ""
      }
    ]
  };
  // for (let i = 0; i < 2; i++) {
  //   const item = assetDataList.value[i];
  //   json.filterExpression[0].operandRight = item["@id"];
  //   const res = await getContractList(json);
  //   if (res && res.length > 0) {
  //     const contractId = res[0]["@id"];
  //     item.properties.contractdefinition = contractId;
  //     console.log("item=", item);
  //     await updateAsset(item);
  //   } else {
  //     console.error("No contract found for asset with ID:", item["@id"]);
  //   }
  // }
  for (const item of assetDataList.value) {
    json.filterExpression[0].operandRight = item["@id"];
    const res = await getContractList(json);
    if (res && res.length > 0) {
      const contractId = res[0]["@id"];
      item.properties.contractdefinition = contractId;
      console.log("item=", item);
      await updateAsset(item);
    } else {
      console.error("No contract found for asset with ID:", item["@id"]);
    }
  }
};
const transferToAssetData = (data: AssetData) => {
  const res = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@id": data.id,
    "@type": "Asset",
    properties: {
      contractdefinition: data.contractdefinition
        ? data.contractdefinition
        : null,
      description: data.description
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: data.baseUrl,
      proxyPath: "true",
      proxyQueryParams: "true"
    }
  };
  return res;
};
const transferToDefinitionData = (data: DefinitionData) => {
  const res = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@id": data.id,
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
  return res;
};

const openImport = () => {
  ElMessageBox.confirm(
    "批量导入时将同时对导入的文件进行合约定义，合约默认定义为需要会员凭证，访问等级为通用级别。",
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      showSuccessMessage("开始导入");
      setWorkFile();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消导入"
      });
    });
};
const setWorkFile = async () => {
  importLoading.value = true;
  try {
    const res = await getWorkFileList();
    console.log("fileList=", res.result);
    //const fileList = res.result.slice(0, 3);
    const fileList = res.result;
    const creatList = [];
    let defId = 1;
    if (fileList.length > 0) {
      // 使用for...of来逐个处理异步请求
      for (const file of fileList) {
        await delay(100); // 等待0.1秒
        file.baseUrl = "http://211.91.61.25:29000" + file.baseUrl;
        const item = transferToAssetData(file);
        try {
          await creatAsset(item); // 等待当前请求完成
          // const defaultDef = {
          //   id: "file-def-" + defId,
          //   accessPolicyId: "require-dataprocessor",
          //   contractPolicyId: "require-sensitive",
          //   assetId: file.id
          // };
          // const itemDef = transferToDefinitionData(defaultDef);
          // await creatContractdefinitions(itemDef);
          // defId += 1;

          // const data = {
          //   id: item["@id"],
          //   description: item.properties.description,
          //   assetPrice: 1000,
          //   assetQuantity: 100
          // };
          // addSystemAsset(data);
          creatList.push(file);
        } catch (error) {
          console.log("error=", error);
          if (error.message === "Request failed with status code 409") {
            showWaringMessage("存在重复文件，已忽略");
          } else {
            showErrorMessage(error);
          }
        }
      }
      console.log("creatList=", creatList);
      for (const defItem of creatList) {
        await delay(300); // 等待0.3秒
        try {
          const defaultDef = {
            id: "file-def-" + defId,
            accessPolicyId: "require-membership",
            contractPolicyId: "require-dataprocessor",
            assetId: defItem.id
          };
          const itemDef = transferToDefinitionData(defaultDef);
          await creatContractdefinitions(itemDef);
          //await delay(1000); // 等待1秒
          defId += 1;
        } catch (error) {
          showErrorMessage(error);
        }
      }
      // await creatAsset(item);

      console.log("creatList=", creatList);
    }
  } catch (error) {
    console.log("error=", error);
    if (error.message === "Request failed with status code 409") {
      showWaringMessage("存在重复文件，已忽略");
    } else {
      showErrorMessage(error);
    }
    // if (
    //   typeof error.response.data[0].message !== undefined &&
    //   error.response.data[0].message !== null
    // ) {
    //   showWaringMessage(error.response.data[0].message);
    // } else {
    //   showErrorMessage(error);
    // }
  } finally {
    importLoading.value = false;
  }
};

const updateWorkFile = async () => {
  updateLoading.value = true;
  try {
    const res = await getWorkFileList();
    console.log("fileList=", res.result);
    //const fileList = res.result.slice(0, 3);
    const fileList = res.result;
    const creatList = [];
    if (fileList.length > 0) {
      // 使用for...of来逐个处理异步请求
      for (const file of fileList) {
        await delay(100); // 等待0.1秒
        const item = transferToAssetData(file);
        item.dataAddress.baseUrl = "http://211.91.61.25:29000" + file.baseUrl;
        console.log("item=", item);
        try {
          await updateAsset(item); // 等待当前请求完成
          creatList.push(file);
        } catch (error) {
          console.log("error=", error);
          if (error.message === "Request failed with status code 409") {
            showWaringMessage("存在重复文件，已忽略");
          } else {
            showErrorMessage(error);
          }
        }
      }
      console.log("creatList=", creatList);
    }
  } catch (error) {
    console.log("error=", error);
    if (error.message === "Request failed with status code 409") {
      showWaringMessage("存在重复文件，已忽略");
    } else {
      showErrorMessage(error);
    }
  } finally {
    updateLoading.value = false;
  }
};
// 定义一个延迟函数
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const deleteLoading = ref(false);
const openDelete = () => {
  ElMessageBox.confirm("确认后删除批量导入文件对应的合约定义。", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      showSuccessMessage("开始删除");
      deleteContractdefinitions();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};
const deleteContractdefinitions = async () => {
  deleteLoading.value = true;
  for (let i = 1; i < 181; i++) {
    await deleteContract("file-def-" + i);
    await delay(100); // 等待0.1秒
  }
  deleteLoading.value = false;
};

// 获取策略信息
const policyList = ref([]);
const getPolicy = async () => {
  try {
    const res = await getPolicyList();
    policyList.value = extractedData(res);
  } catch (error) {
    console.log("error=", error);
    showErrorMessage(error);
  }
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
