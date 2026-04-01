<template>
  <el-card>
    <template #header>
      <div style="font-size: 24px">
        <span>最热门资源TOP10</span>
      </div>
    </template>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <div class="mb-2">
          <el-button type="danger" circle> 1 </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ tableData[0] }}
          </span>
        </div>
        <div class="mb-2">
          <el-button type="warning" circle> 2 </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ tableData[1] }}
          </span>
        </div>
        <div class="mb-2">
          <el-button type="primary" circle> 3 </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ tableData[2] }}
          </span>
        </div>
        <div class="mb-2">
          <el-button type="info" circle> 4 </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ tableData[3] }}
          </span>
        </div>
        <div class="mb-2">
          <el-button type="info" circle> 5 </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ tableData[4] }}
          </span>
        </div>
      </div>
      <div class="col-span-1">
        <div
          v-for="(item, index) in tableData.slice(5, 10)"
          :key="index"
          class="mb-2"
        >
          <el-button type="info" circle> {{ index + 6 }} </el-button>
          <span style="font-size: 16px; align-items: center" class="ml-2">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getHotAsset } from "@/api/basic/personalAsset";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
defineOptions({
  name: "BoardProvider"
});
const emit = defineEmits(["update:visible"]);
const loading = ref(false);

// const tableData = ref<any>([
//   "禅定佛-莫高窟第259窟-北魏",
//   "水鸟-莫高窟第285窟-西魏",
//   "钟馗-莫高窟第150窟-清重绘",
//   "雷神-莫高窟第329窟-初唐",
//   "龙王降雨-榆林窟第25窟-中唐",
//   "九层灯轮-莫高窟第433窟-隋",
//   "双鹤起舞-莫高窟第148窟-盛唐",
//   "狒狒与玄鸟-莫高窟第249窟-西魏",
//   "九龙灌顶-莫高窟第290窟-北周",
//   "牛王救太子-莫高窟第148窟-盛唐"
// ]);
const tableData = ref<any>([]);

// watch(
//   () => props.visible,
//   visible => {
//     if (visible) {
//       Object.assign(data, props.data);
//     }
//   }
// );
const setTableData = () => {
  loading.value = true;
  getHotAsset()
    .then(res => {
      tableData.value = res.result.map(item => item.assetId);
    })
    .catch(err => {
      showErrorMessage(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};
setTableData();
</script>

<style lang="scss" scoped></style>
