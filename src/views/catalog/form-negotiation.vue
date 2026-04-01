<template>
  <el-dialog
    :title="'资产详情'"
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
            {{ form.id }}
          </el-descriptions-item>
          <el-descriptions-item label="提供者">
            {{ form.assetItem?.deptName }}
          </el-descriptions-item>
          <el-descriptions-item label="资产金额">
            {{ form.assetItem?.assetPrice }}
          </el-descriptions-item>
          <el-descriptions-item label="资产数量">
            {{ form.assetItem?.assetQuantity }}
          </el-descriptions-item>
        </el-descriptions>
        <el-steps
          class="p-4 pt-6"
          style="width: 100%"
          :active="active"
          finish-status="success"
        >
          <el-step title="协商" />
          <el-step title="数据传输" />
          <el-step title="资产保存" />
          <el-step title="资产上链" />
        </el-steps>
        <el-text class="mx-1 pl-4" size="large">{{ loadText }}</el-text>
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
          <!-- <el-form-item label="调用参数">
            <el-row>
              <el-col
                :span="24"
                v-for="(item, index) in txtList"
                class="ellipsis"
                style="width: 100%"
              >
                <el-text>
                  {{ item }}
                </el-text>
              </el-col>
            </el-row>
          </el-form-item> -->
          <!-- <el-form-item label="">
            <el-steps
              class="p-1 pt-2"
              style="width: 100%"
              :active="active"
              finish-status="success"
            >
              <el-step title="协商" />
              <el-step title="数据传输" />
              <el-step title="资产保存" />
            </el-steps>
          </el-form-item> -->
          <!-- <el-form-item label="">
            <el-text class="mx-1" size="large">{{ loadText }}</el-text>
          </el-form-item> -->
        </el-form>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <!-- <el-button
        type="primary"
        @click="save"
        :loading="buttonLoading"
        v-if="active < 3"
      >
        {{ activeButtonTxt[active] }}
      </el-button> -->
      <el-button type="primary" @click="save" :loading="buttonLoading">
        购买
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
  "update:txtList",
  "update:loading",
  "update:isNext",
  "update:loadText"
]);
const props = defineProps({
  data: {
    type: Object as PropType<any>
  },
  visible: {
    type: Boolean,
    default: false
  },
  txtList: {
    type: Array as PropType<String>,
    default: () => []
  },
  buttonLoading: {
    type: Boolean,
    default: false
  },
  isNext: {
    type: Boolean,
    default: false
  },
  loadText: {
    type: String,
    default: ""
  }
});
const imgUrl = ref("");
const fileType = ref("json");
const formRef = ref<FormInstance>();

const form = reactive<any>({
  id: "",
  endpointURL: "",
  participantId: "",
  assetItem: {
    deptName: "",
    assetPrice: 0,
    assetQuantity: 0
  }
});
const active = ref(0);
const activeButtonTxt = ["开始协商", "请求传输", "保存"];
const next = () => {
  emit("update:isNext", false);
  if (active.value++ > 3) active.value = 4;
  if (active.value < 4) {
    save();
  }
};
watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(form, props.data);
      fileType.value = props.data.fileType;
      imgUrl.value = props.data.imgUrl;
    }
  }
);
watch(
  () => props.isNext,
  visible => {
    if (visible) {
      next();
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
  //重置表单
  formRef.value.resetFields();
  //重置表单校验
  formRef.value.clearValidate();
  emit("update:visible", false);
  emit("update:txtList", []);
  emit("update:loadText", "");
  active.value = 0;
};

const rules = reactive<FormRules>({
  id: [{ required: true, message: "请输入名称", trigger: "blur" }]
});

const save = () => {
  formRef.value
    .validate()
    .then(() => {
      const data = form;
      data.step = active.value;
      emit("save", data);
    })
    .catch(() => null);
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
.cell-item {
  display: flex;
  align-items: center;
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
