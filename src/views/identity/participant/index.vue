<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between">
        <el-form :inline="true" :model="searchForm.jsonParam" ref="formRef">
          <!-- <el-form-item prop="logContent" label="日志内容">
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
            <el-option :label="'成功'" :value="'成功'" />
            <el-option :label="'失败'" :value="'失败'" />
          </el-select>
        </el-form-item> -->
          <el-form-item>
            <!-- <el-button type="primary" @click="search">搜索</el-button> -->
            <!-- <el-button type="primary" @click="openAssetForm">新增</el-button> -->
            <!-- <el-button @click="resetSearch(formRef)">重置</el-button> -->
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
          :data="tableData"
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
            prop="participantId"
            label="参与者名称"
            align="center"
          />
          <el-table-column prop="did" label="DID身份" align="center" />
          <!-- <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="edit(row)">
              编辑
            </el-button>
            <el-button link type="primary" size="small" @click="editMenu(row)">
              授权
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="remove([row.roleId])"
              >删除
            </el-button>
          </template>
        </el-table-column> -->
        </el-table>
      </div>

      <!-- <div class="absolute bottom-8 right-8 w-full">
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
    </div> -->

      <asset-form
        :data="formData"
        v-model:visible="formVisible"
        @save="save"
        :deviceOptions="[]"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  type ParticipantData,
  getParticipantList
} from "@/api/identity/participant";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { type FormInstance, type ElTable } from "element-plus";
import axios from "axios";
import AssetForm from "./form.vue";
import { useDark } from "@pureadmin/utils";
import { getWatermark } from "@/utils/role";

const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
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
const formRef = ref<FormInstance>();

const searchForm: QueryParam<any> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    logStatus: "",
    logContent: "",
    userId: null
  }
});

const tableData = ref<any>([]);
const showP = ref({
  url: "",
  participantId: ""
});

const setTableData = () => {
  loading.value = true;
  // const searchJson = {};
  getParticipantList()
    .then(res => {
      console.log("res=", res);
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

const formData = ref<any>();
const formVisible = ref(false);

const openAssetForm = (data: any) => {
  data = {
    id: null,
    baseUrl: "",
    description: ""
  };
  formVisible.value = true;
  formData.value = data;
};
const save = (data: any) => {
  console.log("save data=", data);
  const assetData = transferToAssetData(data);
  getParticipantList(assetData)
    .then(() => {
      showSuccessMessage("创建成功");
      formVisible.value = false;
      if (data.roleId) {
        setTableData();
      } else {
        search();
      }
    })
    .catch(showErrorMessage);
};
const transferToAssetData = (data: any) => {
  const res = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@id": data.id,
    "@type": "Asset",
    properties: {
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
</script>
