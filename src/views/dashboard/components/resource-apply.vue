<template>
  <el-card>
    <template #header>
      <div style="font-size: 24px">
        <span>我消费的资源</span>
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
        min-width="100"
      />
      <el-table-column
        prop="gmtCreate"
        label="购买时间"
        align="center"
        min-width="100"
      />
      <el-table-column
        prop="ethAssetId"
        label="资源标识"
        align="center"
        min-width="100"
      />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getAssetListByUser } from "@/api/basic/personalAsset";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
defineOptions({
  name: "BoardProvider"
});
const emit = defineEmits(["update:visible"]);
const loading = ref(false);

const tableData = ref<any>([]);

const setTableData = () => {
  loading.value = true;
  getAssetListByUser()
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
</script>

<style lang="scss" scoped></style>
@/api/mvd/asset
