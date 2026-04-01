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
            <!-- <el-button type="primary" @click="openAssetForm">新增</el-button> -->
            <el-button @click="resetSearch(formRef)">重置</el-button>
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
            prop="id"
            label="资产名称(id)"
            align="center"
            min-width="35"
          />
          <el-table-column
            prop="assetItem.deptName"
            label="提供者"
            align="center"
            min-width="20"
          />
          <el-table-column
            prop="assetItem.assetPrice"
            label="金额"
            align="center"
            min-width="10"
          />
          <el-table-column
            prop="assetItem.assetQuantity"
            label="数量"
            align="center"
            min-width="10"
          />
          <el-table-column label="操作" align="center" min-width="20">
            <template #default="{ row }">
              <el-button
                type="primary"
                :disabled="row.isNegotiation"
                @click="openNegotiationForm(row)"
              >
                查看
              </el-button>
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

      <negotiation-form
        v-model:visible="negotiationFormVisible"
        v-model:txtList="negotiationTxtList"
        v-model:buttonLoading="negotiationButtonLoading"
        v-model:isNext="negotiationIsNext"
        v-model:loadText="loadText"
        :data="negotiationFormData"
        @save="downloadSteps"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import {
  type CatalogData,
  getCachedCatalogList,
  initiateNegotiation,
  getContractNegotiation,
  initiateTransfer,
  getTransferProcess,
  getCacheEDRs,
  getEDRDataAddressForTransferId,
  downloadDataFromPublic,
  checkBalance
} from "@/api/catalog/catalog";
import {
  type PersonalAssetData,
  addPersonalAsset,
  personalAssetIsExist,
  personalAssetIsProvider
} from "@/api/basic/personalAsset";
import { type SystemAssetData, getAssetByCatalog } from "@/api/system/asset";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable } from "element-plus";
import axios from "axios";
import NegotiationForm from "./form-negotiation.vue";
import { downloadJsonFile, downloadFile } from "@/utils/download";
import { is, useDark } from "@pureadmin/utils";
import { getWatermark } from "@/utils/role";
import { getWorkFileByName } from "@/api/utils/workfile";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { gotoPersonalAsset } from "@/router/utils";
import { getParticipantType } from "@/utils/mvd";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const { isDark } = useDark();
const webType = getParticipantType();
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
// 获取route对象
const route = useRoute();
// 获取router对象
const router = useRouter();
const loading = ref(false);
const formRef = ref<FormInstance>();
const searchForm: QueryParam<any> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    assetId: ""
  }
});
const searchFormAssetId = ref("");

const tableData = ref<any>();
const catalogData = ref<any>();
const negotiationStatus = ref<number>(0);
const transferStatus = ref<number>(0);
const pageTotal = ref(0);
const pageData = ref<Array<any>>([]);
// const showP = ref({
//   url: "",
//   participantId: ""
// });
const systemAssetMap = new Map<string, any>();
const assetMap = new Map<string, any>();
const setTableData = () => {
  loading.value = true;
  getAssetByCatalog().then(res => {
    const data = res.result;
    data.forEach(item => {
      systemAssetMap.set(item.assetId, item);
    });
    tableData.value = res.result;
    setAssetList();
  });
};
const setTableDataById = (imgIdParams?: string) => {
  loading.value = true;
  getAssetByCatalog().then(res => {
    const data = res.result;
    data.forEach(item => {
      systemAssetMap.set(item.assetId, item);
    });
    tableData.value = res.result;
    setAssetList(imgIdParams);
  });
};
const setAssetList = (imgIdParams?: string) => {
  const searchJson = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec"
  };
  getCachedCatalogList(searchJson)
    .then(res => {
      catalogData.value = res;
      //convetData(res);
      convetDataK8s(res);
      // if (webType === "consumer") {
      //   convetDataK8s(res);
      // } else {
      //   convetConsumerData(res);
      // }
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      getPageTotal();
      loading.value = false;
      // if (imgIdParams !== undefined) {
      //   const data = tableData.value.find(item => item.id === imgIdParams);
      //   getFilePreview(data);
      // }
      if (imgIdParams !== undefined) {
        const data = tableData.value.find(item => item.assetId === imgIdParams);
        getFilePreview(data);
      }
    });
};
const initTable = () => {
  // 从URL中获取查询参数
  const imgIdParams = route.query?.id;
  if (imgIdParams !== undefined) {
    setTableDataById(imgIdParams.toString());
  } else {
    setTableData();
  }
};
const getPageTotal = () => {
  const pageNo = searchForm.pageNo;
  const pageSize = searchForm.pageSize;
  const pagelist = [];
  let searchlist = [];
  if (searchForm.jsonParam.assetId === "") {
    searchlist = tableData.value;
  } else {
    //mvd为主
    // searchlist = tableData.value.filter(item =>
    //   item.id.includes(searchForm.jsonParam.assetId)
    // );
    //本地数据库为主
    searchlist = tableData.value.filter(item =>
      item.assetId.includes(searchForm.jsonParam.assetId)
    );
  }
  pageTotal.value = searchlist.length;
  for (let i = (pageNo - 1) * pageSize; i < pageNo * pageSize; i++) {
    // if (i < pageTotal.value) {
    //   pagelist.push(searchlist[i]);
    // } else {
    //   break;
    // }
    if (i < searchlist.length) {
      if (assetMap.has(searchlist[i].assetId)) {
        pagelist.push(assetMap.get(searchlist[i].assetId));
      }
    }

    // else {
    //   const item = searchlist[i];
    //   const data = {
    //     id: item.assetId,
    //     policyAssetId: null,
    //     endpointURL: null,
    //     participantId: null,
    //     assetItem: item
    //   };
    //   pagelist.push(data);
    // }
  }
  pageData.value = pagelist;
  // if (searchForm.jsonParam.assetId === "") {
  //   pageTotal.value = tableData.value.length;
  //   for (let i = (pageNo - 1) * pageSize; i < pageNo * pageSize; i++) {
  //     if (i < pageTotal.value) {
  //       pagelist.push(tableData.value[i]);
  //     } else {
  //       break;
  //     }
  //   }
  // } else {
  //   const searchlist = tableData.value.filter(item =>
  //     item.id.includes(searchForm.jsonParam.assetId)
  //   );
  //   pageTotal.value = searchlist.length;
  //   for (let i = (pageNo - 1) * pageSize; i < pageNo * pageSize; i++) {
  //     if (i < pageTotal.value) {
  //       pagelist.push(searchlist[i]);
  //     } else {
  //       break;
  //     }
  //   }
  // }
  // pageData.value = pagelist;
};
//setTableData();
onMounted(() => {
  initTable();
});

const convetData = (data: any) => {
  const catalogList = data[0]["dcat:catalog"];
  const res = [];
  for (let i = 0; i < catalogList.length; i++) {
    const item = catalogList[i];
    let endpointURL = "";
    if (Array.isArray(item["dcat:service"])) {
      endpointURL = item["dcat:service"][0]["dcat:endpointURL"];
    } else {
      endpointURL = item["dcat:service"]["dcat:endpointURL"];
    }
    for (let j = 0; j < item["dcat:dataset"].length; j++) {
      const dataset = item["dcat:dataset"][j];
      let level = "processing";
      if (Array.isArray(dataset["odrl:hasPolicy"])) {
        level =
          dataset["odrl:hasPolicy"][0]["odrl:obligation"]["odrl:constraint"][
            "odrl:rightOperand"
          ];
      } else {
        level =
          dataset["odrl:hasPolicy"]["odrl:obligation"]["odrl:constraint"][
            "odrl:rightOperand"
          ];
      }

      if (level === "processing") {
        const data = {
          id: dataset["@id"],
          policyAssetId: dataset["odrl:hasPolicy"]["@id"],
          endpointURL: endpointURL,
          participantId: item["dspace:participantId"]
        };
        res.push(data);
      }
    }
  }
  tableData.value = res;
};
const convetDataK8s = (data: any) => {
  if (data.length > 0) {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const catalogList = data[i]["dcat:dataset"];
      for (let i = 1; i < catalogList.length; i++) {
        const item = catalogList[i];
        let endpointURL = "";
        //console.log("item=", item);
        if (Array.isArray(item["dcat:service"])) {
          endpointURL = item["dcat:service"][0]["dcat:endpointURL"];
        } else {
          endpointURL = item["dcat:service"]["dcat:endpointURL"];
        }
        for (let j = 0; j < item["dcat:dataset"].length; j++) {
          const dataset = item["dcat:dataset"][j];
          const level =
            dataset["odrl:hasPolicy"]["odrl:obligation"]["odrl:constraint"][
              "odrl:rightOperand"
            ];
          if (level === "processing") {
            const data = {
              id: dataset["@id"],
              policyAssetId: dataset["odrl:hasPolicy"]["@id"],
              endpointURL: endpointURL,
              participantId: item["dspace:participantId"],
              assetItem: systemAssetMap.get(dataset["@id"])
            };
            res.push(data);
            assetMap.set(dataset["@id"], data);
          }
        }
      }
    }

    //tableData.value = res;
  } else {
    //tableData.value = [];
  }
};
const convetConsumerData = (data: any) => {
  if (data.length > 0) {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const catalogList = data[i]["dcat:dataset"];
      const endpointURL = data[i]["originator"];
      const participantId = data[i]["dspace:participantId"];
      if (Array.isArray(catalogList)) {
        for (let i = 0; i < catalogList.length; i++) {
          const dataset = catalogList[i];
          const level =
            dataset["odrl:hasPolicy"]["odrl:obligation"]["odrl:constraint"][
              "odrl:rightOperand"
            ];
          if (level === "processing") {
            const data = {
              id: dataset["@id"],
              policyAssetId: dataset["odrl:hasPolicy"]["@id"],
              endpointURL: endpointURL,
              participantId: participantId,
              assetItem: systemAssetMap.get(dataset["@id"])
            };
            res.push(data);
          }
        }
      } else {
        const dataset = catalogList;
        const level =
          dataset["odrl:hasPolicy"]["odrl:obligation"]["odrl:constraint"][
            "odrl:rightOperand"
          ];
        if (level === "processing") {
          const data = {
            id: dataset["@id"],
            policyAssetId: dataset["odrl:hasPolicy"]["@id"],
            endpointURL: endpointURL,
            participantId: participantId,
            assetItem: systemAssetMap.get(dataset["@id"])
          };
          res.push(data);
        }
      }
    }
    tableData.value = res;
  } else {
    tableData.value = [];
  }
};
const search = () => {
  // searchForm.pageNo = 1;
  setTableData();
};

const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  search();
};

const negotiationFormData = ref<any>();
const negotiationFormVisible = ref(false);
const negotiationTxtList = ref<any>([]);
const negotiationButtonLoading = ref(false);
const negotiationIsNext = ref(false);
const negotiationFormId = ref(null);
const negotiationFormItem = ref(null);
const negotiationFormTransferId = ref(null);
const negotiationFormTransferItem = ref(null);
const addr = "http://211.91.61.25:29000";
const loadText = ref("");

const getFilePreview = (data: any) => {
  const json = {
    id: data.id
  };
  getWorkFileByName(json)
    .then(res => {
      negotiationFormData.value = data;
      negotiationFormData.value.imgUrl = addr + res.result.baseUrl;
      negotiationFormData.value.fileType = res.result.type;
      negotiationFormVisible.value = true;
    })
    .catch(err => {
      console.error(err);
    });
};

const openNegotiationForm = (data: CatalogData) => {
  // data = {
  //   id: null,
  //   endpointURL: "",
  //   participantId: ""
  // };
  getFilePreview(data);
};
const saveNegotiation = async (data: CatalogData) => {
  //console.log("saveNegotiation data=", data);
  let negotiationId = null;
  const saveData = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "ContractRequest",
    counterPartyAddress: data.endpointURL,
    counterPartyId: data.participantId,
    protocol: "dataspace-protocol-http",
    policy: {
      "@type": "Offer",
      "@id": data.policyAssetId,
      assigner: data.participantId,
      permission: [],
      prohibition: [],
      obligation: {
        action: "use",
        constraint: {
          leftOperand: "DataAccess.level",
          operator: "eq",
          rightOperand: "processing"
        }
      },
      target: data.id
    },
    callbackAddresses: []
  };
  try {
    loadText.value = "协商中...";
    const res = await initiateNegotiation(saveData);
    //console.log("协商res=", res);
    //showSuccessMessage("协商ID:" + res["@id"]);
    loadText.value = "协商ID:" + res["@id"];
    negotiationTxtList.value.push("协商ID:" + res["@id"]);
    //showSuccessMessage("发起协商成功");
    loadText.value = "发起协商成功";
    return res["@id"]; // 返回协商ID
  } catch (error) {
    showErrorMessage(error);
    return null; // 出现错误时返回null
  }
};
const getNegotiationList = async id => {
  const json = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec",
    sortOrder: "DESC",
    sortField: "createdAt"
    // filterExpression: [
    //   {
    //     operandLeft: "id",
    //     operator: "=",
    //     operandRight: id
    //   }
    // ]
  };
  try {
    const res = await getContractNegotiation(json);
    //console.log("协商状态res=", res);
    return res;
  } catch (error) {
    showErrorMessage(error);
    return null; // 出现错误时返回null
  }
  // getContractNegotiation(json)
  //   .then(res => {
  //     console.log("协商状态res=", res);
  //     return res;
  //   })
  //   .catch(showErrorMessage);
};
const getTransferList = async transferId => {
  let list = [];
  const json = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec",
    sortOrder: "DESC",
    sortField: "createdAt"
    // filterExpression: [
    //   {
    //     operandLeft: "id",
    //     operator: "=",
    //     operandRight: transferId
    //   }
    // ]
  };
  try {
    const res = await getTransferProcess(json);
    //console.log("数据传输状态res=", res);
    return res;
  } catch (error) {
    showErrorMessage(error);
    return null; // 出现错误时返回null
  }
  // getTransferProcess(json)
  //   .then(res => {
  //     console.log("数据传输状态res=", res);
  //     list = [...res];
  //   })
  //   .catch(showErrorMessage);
  // return list;
};
const initTransfer = async (data: CatalogData, agreeId: any) => {
  let transferId = null;
  const json = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    assetId: data.id,
    counterPartyAddress: data.endpointURL,
    connectorId: data.participantId,
    contractId: agreeId,
    dataDestination: {
      type: "HttpProxy"
    },
    protocol: "dataspace-protocol-http",
    transferType: "HttpData-PULL"
  };
  try {
    loadText.value = "请求数据传输中...";
    const res = await initiateTransfer(json);
    transferId = res["@id"];
    //showSuccessMessage("传输ID:" + transferId);
    loadText.value = "传输ID:" + transferId;
    negotiationTxtList.value.push("传输ID:" + transferId);
    //showSuccessMessage("请求数据传输成功");
    loadText.value = "请求数据传输成功";
  } catch (error) {
    showErrorMessage(error);
  }
  // initiateTransfer(json)
  //   .then(res => {
  //     transferId = res["@id"];
  //   })
  //   .catch(showErrorMessage);
  // if (transferId !== null) {
  //   showSuccessMessage("请求数据传输成功");
  // }
  return transferId;
};
const judgeNegotiationStatus = async (negotiationId: any) => {
  // let list: Array<any> = getNegotiationList();
  let list: Array<any> = await getNegotiationList(negotiationId);
  const item = list.find(item => item["@id"] === negotiationId);
  negotiationStatus.value = 0;
  if (item.state === "FINALIZED") {
    //showSuccessMessage("协商成功，进行下一步数据传输");
    loadText.value = "协商成功，进行下一步数据传输";
    negotiationStatus.value = 1;
    return item;
  } else {
    if (item.state === "TERMINATED") {
      //showErrorMessage("协商失败，请重新发起协商");
      loadText.value = "协商失败，请重新发起协商";
      negotiationStatus.value = -1;
    } else {
      //showSuccessMessage("协商中，等待响应");
      loadText.value = "协商中，等待响应";
      negotiationStatus.value = 0;
    }
  }
  return null;
};
const judgeTransferStatus = async (transferId: any) => {
  let list: Array<any> = await getTransferList(transferId);
  const item = list.find(item => item["@id"] === transferId);
  transferStatus.value = 0;
  if (item.state === "STARTED") {
    //showSuccessMessage("数据传输已就绪");
    loadText.value = "数据传输已就绪";
    transferStatus.value = 1;
    return item;
  } else {
    if (item.state === "TERMINATED") {
      //showErrorMessage("数据传输失败，请重新发起数据传输");
      loadText.value = "数据传输失败，请重新发起数据传输";
      transferStatus.value = -1;
    } else {
      //showSuccessMessage("数据传输准备中，等待响应");
      loadText.value = "数据传输准备中，等待响应";
      transferStatus.value = 0;
    }
  }
  return null;
};
const getEDR = async transferId => {
  let data = {};
  const json = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec",
    filterExpression: [
      {
        operandLeft: "transferProcessId",
        operator: "=",
        operandRight: transferId
      }
    ]
  };
  try {
    const res = await getCacheEDRs(json); // 等待异步请求完成
    return res; // 返回获取到的数据
  } catch (error) {
    showErrorMessage(error); // 可选：处理错误
    return {}; // 在出错时返回一个默认值
  }
};

const getEDRAddress = async (edr: any) => {
  try {
    const res = await getEDRDataAddressForTransferId(edr); // 等待异步操作完成

    return res; // 返回实际的数据
  } catch (error) {
    showErrorMessage(error); // 可选：处理错误
  }
};
const downloadData = async (data: any, name: string) => {
  try {
    showSuccessMessage("授权:" + data.authorization);
    negotiationTxtList.value.push("授权令牌:" + data.authorization);
    const res = await downloadDataFromPublic(data);
    // console.log("下载成功", res);

    // 下载文件
    downloadFile(res, name); // 设置你希望的文件名
  } catch (error) {
    showErrorMessage(error);
  } finally {
    negotiationButtonLoading.value = false;
  }
};
const authorization_1 = ref("");
const download = async (data: CatalogData) => {
  negotiationButtonLoading.value = true;
  const res = await personalAssetIsExist({ assetId: data.id });
  if (res.success) {
    showErrorMessage("该资产已购买，请前往[我的资产]->[资产消费]页面查看");
    negotiationButtonLoading.value = false;
  } else {
    const negotiationId = await saveNegotiation(data);

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    if (negotiationId !== null) {
      //协商
      let item = null;
      item = await judgeNegotiationStatus(negotiationId);
      while (negotiationStatus.value === 0) {
        await wait(2000); // 等待2秒
        item = await judgeNegotiationStatus(negotiationId);
      }

      negotiationIsNext.value = true;
      //数据传输
      //console.log("NJ item=", item);
      if (item !== null && item.state === "FINALIZED") {
        const agreeId = item.contractAgreementId;
        const transferId = await initTransfer(data, agreeId);
        let transferItem = null;
        transferItem = await judgeTransferStatus(transferId);
        //console.log("transferItem=", transferItem);
        while (transferStatus.value === 0) {
          await wait(2000); // 等待2秒
          transferItem = await judgeTransferStatus(transferId);
          //console.log("transferItem=", transferItem);
        }
        if (transferItem !== null && transferItem.state === "STARTED") {
          const edr = await getEDR(transferId);
          const edrItem = edr.find(item => item["@id"] === transferId);
          showSuccessMessage("获取数据传输端点令牌");
          const edrAddress = await getEDRAddress(edrItem);
          const authorization = edrAddress.authorization;
          savePersonalAsset({
            assetId: data.id,
            authorization: authorization,
            participantId: data.participantId,
            endpointURL: data.endpointURL
          });
          // downloadData(edrAddress, data.id);
        }
      }
    }
  }
};
const openSuccessBuy = () => {
  ElMessageBox.confirm(
    "资产已购买，是否前往[我的资产]->[资产消费]页面查看？",
    "提示",
    {
      confirmButtonText: "前往查看",
      type: "warning"
    }
  )
    .then(() => {
      negotiationButtonLoading.value = false;
      router.push(gotoPersonalAsset().path);
    })
    .catch(() => {
      negotiationButtonLoading.value = false;
    });
};
const downloadSteps = async (data: CatalogData) => {
  const res = await personalAssetIsExist({ assetId: data.id });
  const isProvider = await personalAssetIsProvider({ assetId: data.id });
  if (res.success || !isProvider.success) {
    // showErrorMessage("该资产已购买，请前往[我的资产]->[资产消费]页面查看");
    negotiationButtonLoading.value = false;
    if (res.success) {
      if (res.result === 1) {
        showErrorMessage("该资产已购买，请前往[我的资产]->[资产消费]页面查看");
        openSuccessBuy();
      } else {
        showErrorMessage(res.message);
      }
    } else {
      showErrorMessage(isProvider.message);
    }
  } else {
    negotiationButtonLoading.value = true;
    const balance = await checkBalance(data.id);
    if (balance.success) {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      switch (data.step) {
        case 0:
          //协商
          negotiationButtonLoading.value = true;
          negotiationFormId.value = await saveNegotiation(data);
          if (negotiationFormId.value !== null) {
            negotiationFormItem.value = await judgeNegotiationStatus(
              negotiationFormId.value
            );
            while (negotiationStatus.value === 0) {
              await wait(2000); // 等待2秒
              negotiationFormItem.value = await judgeNegotiationStatus(
                negotiationFormId.value
              );
            }
            negotiationButtonLoading.value = false;
            negotiationIsNext.value = true;
          }
          break;
        case 1:
          const item = negotiationFormItem.value;
          if (item !== null && item.state === "FINALIZED") {
            const agreeId = item.contractAgreementId;
            negotiationFormTransferId.value = await initTransfer(data, agreeId);
            negotiationFormTransferItem.value = await judgeTransferStatus(
              negotiationFormTransferId.value
            );
            //console.log("transferItem=", negotiationFormTransferItem.value);
            while (transferStatus.value === 0) {
              await wait(2000); // 等待2秒
              negotiationFormTransferItem.value = await judgeTransferStatus(
                negotiationFormTransferId.value
              );
            }
          }
          negotiationButtonLoading.value = false;
          negotiationIsNext.value = true;
          break;
        case 2:
          const transferItem = negotiationFormTransferItem.value;
          if (transferItem !== null && transferItem.state === "STARTED") {
            const edr = await getEDR(negotiationFormTransferId.value);
            //console.log("edr=", edr);
            const edrItem = edr.find(
              item => item["@id"] === negotiationFormTransferId.value
            );
            //showSuccessMessage("获取数据传输端点令牌");
            loadText.value = "正在获取数据传输端点令牌，时间较长请耐心等待";
            const edrAddress = await getEDRAddress(edrItem);
            authorization_1.value = edrAddress.authorization;
            loadText.value =
              "资产打包上链中，资产上链时间较长，大概60秒左右，请耐心等待。如果超时请关闭窗口，稍后前往[我的资产]->[资产消费]页面查看";
            //downloadData(edrAddress, data.id);
          }
          // negotiationButtonLoading.value = false;
          // sleep(10000);
          negotiationIsNext.value = true;
          break;
        case 3:
          await savePersonalAsset({
            assetId: data.id,
            authorization: authorization_1.value,
            participantId: data.participantId,
            endpointURL: data.endpointURL
          });
          // negotiationIsNext.value = true;
          break;
        case 4:
          authorization_1.value = "";
          break;
        default:
          break;
      }
    } else {
      showErrorMessage("余额不足，请充值");
      negotiationButtonLoading.value = false;
    }
  }
};
const savePersonalAsset = data => {
  addPersonalAsset(data)
    .then(res => {
      if (res.success) {
        loadText.value = "保存成功，前往[我的资产]->[资产消费]页面查看";
        openSuccessBuy();
      } else {
        showErrorMessage(res.message);
      }
      //showSuccessMessage("保存成功，前往个人资产页面查看");
    })
    .catch(err => {
      showErrorMessage(err);
    })
    .finally(() => {
      negotiationIsNext.value = true;
      negotiationButtonLoading.value = false;
    });
};
const save = async (data: CatalogData) => {
  console.log("save data=", data);
};
</script>
