<template>
  <el-card body-style="padding: 0">
    <template #header>
      <div style="font-size: 24px">
        <span>区块数量</span>
      </div>
    </template>
    <div ref="chartRef" style="width: 100%; height: 240px" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getBlockNumber } from "@/api/system/miner";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { useECharts } from "@pureadmin/utils";
defineOptions({
  name: "BoardProvider"
});
const emit = defineEmits(["update:visible"]);
const loading = ref(false);

const tableData = ref<any>(20000);

const setChartData = () => {
  loading.value = true;
  getBlockNumber()
    .then(res => {
      tableData.value = res;
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
      setChart(tableData.value);
    });
};
// watch(
//   () => props.visible,
//   visible => {
//     if (visible) {
//       Object.assign(data, props.data);
//     }
//   }
// );
const chartRef = ref();
const { setOptions } = useECharts(chartRef);
const setChart = (data: number) => {
  const valueList = [data, data] as any[];
  const nodeList = ["节点A", "节点B"] as any[];
  setOptions({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: {
      type: "category",
      data: nodeList,
      axisLabel: {
        //x轴文字的配置
        show: true,
        interval: 0, //使x轴文字显示全
        formatter: function (params) {
          let newParamsName = "";
          const paramsNameNumber = params.length;
          const provideNumber = 5; //一行显示几个字
          const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < rowNumber; p++) {
              let tempStr = "";
              const start = p * provideNumber;
              const end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        }
      }
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: valueList,
        type: "bar",
        itemStyle: {
          color: "#00CD66"
        }
      }
    ]
  });
};

setChartData();
</script>

<style lang="scss" scoped></style>
@/api/mvd/asset
