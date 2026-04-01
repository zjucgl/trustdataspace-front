<template>
  <el-card body-style="padding: 0">
    <template #header>
      <div style="font-size: 24px">
        <span>数据资源交易数量</span>
      </div>
    </template>
    <div ref="chartRef" style="width: 100%; height: 240px" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { getAssetChart } from "@/api/basic/personalAsset";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { useECharts } from "@pureadmin/utils";
defineOptions({
  name: "BoardProvider"
});
const emit = defineEmits(["update:visible"]);
const loading = ref(false);

const tableData = ref<any>([
  {
    date: "01.07",
    value: 20
  },
  {
    date: "01.09",
    value: 10
  },
  {
    date: "01.11",
    value: 30
  },
  {
    date: "01.13",
    value: 20
  },
  {
    date: "01.15",
    value: 40
  },
  {
    date: "01.17",
    value: 20
  },
  {
    date: "01.19",
    value: 30
  },
  {
    date: "01.21",
    value: 10
  }
]);

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
const setChart = (data: Array<any>) => {
  const valueList = [] as any[];
  const dateList = [] as any[];
  data.forEach(item => {
    dateList.push(item.date);
    valueList.push(item.value);
  });
  setOptions({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: {
      type: "category",
      data: dateList,
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
        type: "line",
        itemStyle: {
          color: "#FFD700"
        }
      }
    ]
  });
};

const setChartData = () => {
  loading.value = true;
  getAssetChart()
    .then(res => {
      tableData.value = res.result;
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
      setChart(tableData.value);
    });
};
setChartData();
</script>

<style lang="scss" scoped></style>
@/api/mvd/asset
