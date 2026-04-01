<template>
  <el-dialog
    :title="'查看资产'"
    center
    width="60%"
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <div class="grid grid-cols-12 gap-2" style="height: 350px">
      <div class="col-span-5" style="height: 330px">
        <el-image
          style="width: 100%; height: 100%"
          :src="imgUrl"
          fit="contain"
          class="no-pointer-events"
        >
          <template #error>
            <div class="image-slot">{{ "非图片文件" }}</div>
          </template>
        </el-image>
      </div>
      <div class="col-span-7">
        <el-descriptions
          class="margin-top ml-3"
          :column="1"
          size="large"
          border
        >
          <el-descriptions-item
            label="资产名称(ID)"
            label-class-name="description-item"
          >
            {{ form.assetId }}
          </el-descriptions-item>
          <el-descriptions-item label="提供者">
            {{ form.deptName }}
          </el-descriptions-item>
          <el-descriptions-item label="拥有者">
            {{ form.userName }}
          </el-descriptions-item>
          <el-descriptions-item label="购买时间">
            {{ form.gmtCreate }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="m-4 text-center text-2xl">资产溯源-区块链</div>
        <!--        展示溯源信息-->
        <el-steps class="p-4 pt-6" style="width: 100%" :active="2">
          <el-step
            v-for="item in form.ownerAssetHistory"
            :key="item"
            :title="item"
          />
        </el-steps>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" :loading="buttonLoading" @click="save">
        资产下载
      </el-button>
      <el-button type="primary" :loading="downloadLoading" @click="getqrcode">
        证书下载
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
const emit = defineEmits([
  "update:visible",
  "save",
  "update:loading",
  "getqrcode"
]);
const props = defineProps({
  data: {
    type: Object as PropType<any>
  },
  visible: {
    type: Boolean,
    default: false
  },
  buttonLoading: {
    type: Boolean,
    default: false
  },
  downloadLoading: {
    type: Boolean,
    default: false
  }
});
const imgUrl = ref("");
const fileType = ref("json");

const form = reactive<any>({
  assetId: "",
  endpointURL: "",
  participantId: "",
  deptName: "",
  imgUrl: "",
  ownerAssetHistory: ""
});
const active = ref(0);
watch(
  () => props.visible,
  visible => {
    if (visible) {
      // console.log("监听", props.data);
      Object.assign(form, props.data);
      fileType.value = props.data.fileType;
      imgUrl.value = props.data.imgUrl;
    }
  }
);
// watch(
//   () => props.txtList,
//   txtList => {
//     console.log("监听", txtList);
//     Object.assign(list, props.txtList);
//   }
// );
const close = () => {
  // //重置表单
  // formRef.value.resetFields();
  // //重置表单校验
  // formRef.value.clearValidate();
  emit("update:visible", false);
  active.value = 0;
};

const rules = reactive<FormRules>({
  id: [{ required: true, message: "请输入名称", trigger: "blur" }]
});

const save = () => {
  const data = form;
  data.step = active.value;
  emit("save", data);
};

//获取证书
const getqrcode = () => {
  const data = form;
  data.step = active.value;
  emit("getqrcode", data);
};
</script>

<style scpoed>
.no-pointer-events {
  pointer-events: none;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 48ch; /* 限制最多显示48个字符 */
}
.description-item {
  width: 120px;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>
