<template>
  <el-card>
    <template #header>
      <div style="font-size: 24px">
        <span>我提供的资源</span>
      </div>
    </template>
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
      max-height="200"
    >
      <el-table-column
        prop="assetId"
        label="资源名称"
        align="center"
        min-width="150"
      />
      <el-table-column
        prop="assetPrice"
        label="价格"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="assetQuantity"
        label="数量"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="assetDescription"
        label="描述"
        align="center"
        min-width="100"
      />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { queryAssetByBoard } from "@/api/system/asset";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
defineOptions({
  name: "BoardProvider"
});
const emit = defineEmits(["update:visible"]);
const loading = ref(false);
const tableData = ref<any>([
  {
    assId: "禅定佛-莫高窟第259窟-北魏",
    assPrice: 6,
    assQuantity: 100
  }
]);

const setTableData = () => {
  loading.value = true;
  queryAssetByBoard()
    .then(res => {
      console.log("res=", res);
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
</script>

<style lang="scss" scoped></style>
