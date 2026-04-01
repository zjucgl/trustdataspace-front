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
            prop="assetId"
            label="资产名称"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="deptName"
            label="提供者"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="userName"
            label="拥有者"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="gmtCreate"
            label="购买时间"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="edit(row)">
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

      <asset-form
        v-model:visible="formVisible"
        v-model:buttonLoading="formButtonLoading"
        v-model:downloadLoading="downloadLoading"
        :data="formData"
        @save="save"
        @getqrcode="getqrcode"
      />
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  type PersonalAssetData,
  type PersonalAssetParam,
  getPersonalAssetPage,
  getAssetHistory
} from "@/api/basic/personalAsset";
import { showErrorMessage } from "@/utils/message";
import { type FormInstance, type ElTable, ElMessage } from "element-plus";
import AssetForm from "./form.vue";
import { getWorkFileByName } from "@/api/utils/workfile";
import { downloadFile } from "@/utils/download";
import { downloadDataFromPublic } from "@/api/catalog/catalog";
import { getWatermark } from "@/utils/role";
import { getQrcode } from "@/api/utils/qrcode";
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const loading = ref(false);
const formRef = ref<FormInstance>();

const searchForm: QueryParam<PersonalAssetParam> = reactive({
  pageNo: 1,
  pageSize: 10,
  jsonParam: {
    assetId: ""
  }
});

const tableData = ref<TableData<PersonalAssetData>>({
  data: [],
  pageNo: 0,
  pageSize: 0,
  totalCount: 0
});

const setTableData = () => {
  loading.value = true;
  getPersonalAssetPage(searchForm)
    .then(res => {
      tableData.value = res.result;
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

const formData = ref<PersonalAssetData>();
const formVisible = ref(false);
const formButtonLoading = ref(false);
const downloadLoading = ref(false);

const edit = (data: PersonalAssetData) => {
  getFilePreview(data);
};
const save = (data: PersonalAssetData) => {
  formButtonLoading.value = true;
  console.log("save data=", data);
  downloadData(data, data.assetId);
};
const downloadData = async (data: any, name: string) => {
  try {
    const res = await downloadDataFromPublic(data);
    // console.log("下载成功", res);

    // 下载文件
    downloadFile(res, name); // 设置你希望的文件名
  } catch (error) {
    showErrorMessage(error);
  } finally {
    formButtonLoading.value = false;
  }
};

const addr = "http://211.91.61.25:29000";

const getFilePreview = (data: PersonalAssetData) => {
  const json = {
    id: data.assetId
  };
  console.log("json=", json);
  getWorkFileByName(json)
    .then(res => {
      formData.value = data;
      formData.value.imgUrl = addr + res.result.baseUrl;
      formData.value.fileType = res.result.type;
      console.log("item=", res);
      const searchInfo = `?assetId=${data.assetId}&userId=${data.userId}`;
      getAssetHistory(searchInfo)
        .then(res => {
          formData.value.ownerAssetHistory = res;
          formVisible.value = true;
          // console.log("res=", res[res.length - 1]);测试启用
        })
        .catch(err => {
          ElMessage.error("资产溯源失效");
          console.error(err);
        });
    })
    .catch(err => {
      ElMessage.error("资产信息获取失败");
      console.error(err);
    });
};
function isValidBase64(str) {
  return /^[A-Za-z0-9+/=]+$/.test(str);
}
const getqrcode = (data: any) => {
  const searchInfo = `?assetId=${data.assetId}&userId=${data.userId}`;
  downloadLoading.value = true;
  getQrcode(searchInfo)
    .then(res => {
      console.log("res=", res);
      const data = res.result;
      // 假设 data 是 Base64 编码的 PDF 数据
      const base64Data = data;
      const cleanData = data.replace(/^data:application\/pdf;base64,/, "");
      const validBase64 = cleanData.replace(/[^A-Za-z0-9+/=]/g, "");

      if (isValidBase64(validBase64)) {
        try {
          const binaryData = atob(validBase64);
          const uint8Array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "downloaded.pdf";
          a.click();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("解码 Base64 数据时出错:", error);
        }
      } else {
        console.error("传入的数据不是有效的 Base64 编码");
      }
    })
    .catch(err => {
      console.error(err);
    });
  downloadLoading.value = false;
};
</script>
