<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-5">
      <div class="text-xl font-semibold text-black">数据概览</div>
      <hr class="text-gray-300 mt-5 mb-1" />
      <div class="bg-[#FBFBFB] px-5 pt-3 pb-5 border-[#DDDDDD]">
        <div class="flex w-[100%]">
          <div class="flex-1 ml-8 w-[50%]" />
        </div>
        <div class="grid grid-cols-5 gap-8">
          <numCard class="col-span-1" :data="cardData[0]" />
          <numCard class="col-span-1" :data="cardData[1]" />
          <numCard class="col-span-1" :data="cardData[2]" />
          <numCard class="col-span-1" :data="cardData[3]" />
          <numCard class="col-span-1" :data="cardData[4]" />
          <!-- <numCard class="col-span-1" :data="cardData[5]" font-size="16px" /> -->
        </div>
        <div class="grid grid-cols-2 gap-4 mt-6">
          <resourceProvide class="col-span-1" />
          <resourceApply class="col-span-1" />
        </div>
        <div class="grid grid-cols-3 gap-4 mt-6">
          <resourceRank class="col-span-1" />
          <blockNumber class="col-span-1" />
          <resourceChart class="col-span-1" />
        </div>
        <div class="flex w-[100%] mt-2">
          <!-- <test-table class="flex-1 w-[50%]" />
        <test-echart class="flex-1 ml-8 w-[50%]" /> -->
        </div>
      </div>
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getWatermark } from "@/utils/role";
import { participantId } from "@/utils/mvd";
import { getCachedCatalogList } from "@/api/catalog/catalog";
import { queryParticipantCount } from "@/api/orga/dept";
import { getUserOption } from "@/api/orga/user";
import { getAssetListCount } from "@/api/basic/personalAsset";
import { getBlockNumber } from "@/api/system/miner";
import { minerList } from "@/api/system/minerList";
import numCard from "./components/num-card.vue";
import resourceProvide from "./components/resource-provide.vue";
import resourceApply from "./components/resource-apply.vue";
import resourceRank from "./components/resource-rank.vue";
import resourceChart from "./components/resource-chart.vue";
import blockNumber from "./components/block-number.vue";
defineOptions({
  name: "Board"
});
const font = reactive({
  color: "rgba(0, 0, 0, .15)"
});
const watermark = getWatermark();
const cardData = ref([
  { name: "可信空间节点数", value: 3 },
  { name: "资产目录数", value: null },
  { name: "资源成交数", value: 24 },
  { name: "认证用户数", value: 11 },
  { name: "区块链节点数", value: 2 }
]);
const catalogList = ref<Array<any>>([]);
console.log("participantId=", participantId.value);
const setParticipantNodeNum = () => {
  queryParticipantCount().then(res => {
    cardData.value[0].value = res.result;
  });
};
const setAssetListCount = () => {
  getAssetListCount().then(res => {
    cardData.value[2].value = res.result;
  });
};
const setUserNodeNum = () => {
  getUserOption().then(res => {
    cardData.value[3].value = res.result.length;
  });
};
const setBlockNode = () => {
  minerList().then(res => {
    cardData.value[4].value = res.result.length;
  });
};
const setNumberCartData = () => {
  setCatalogList();
  setParticipantNodeNum();
  setAssetListCount();
  setUserNodeNum();
  setBlockNode();
};
const setCatalogList = () => {
  const searchJson = {
    "@context": ["https://w3id.org/edc/connector/management/v0.0.1"],
    "@type": "QuerySpec"
  };
  getCachedCatalogList(searchJson)
    .then(res => {
      //convetData(res);
      convetCatalogData(res);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      getPageTotal();
    });
};
setNumberCartData();
const getPageTotal = () => {
  const list = catalogList.value;
  cardData.value[1].value = list.length;
};
const convetCatalogData = (data: Array<any>) => {
  const res = [];
  const list = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]["dcat:dataset"].length > 0) {
      for (let j = 0; j < data[i]["dcat:dataset"].length; j++) {
        list.push(data[i]["dcat:dataset"][j]);
      }
    }
  }
  console.log("list=", list);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (typeof item["dcat:dataset"] !== "undefined") {
      for (let j = 0; j < item["dcat:dataset"].length; j++) {
        const dataset = item["dcat:dataset"][j];
        res.push(dataset["@id"]);
      }
    }
  }
  catalogList.value = res;
};
</script>

<style lang="scss" scoped></style>
