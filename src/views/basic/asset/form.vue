<template>
  <el-dialog
    :title="form.type === 'update' ? '编辑资产' : '新增资产'"
    center
    width="600px"
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产名称(ID)" prop="id">
            <el-input
              v-model="form.id"
              autocomplete="off"
              :disabled="form.type === 'update' ? true : false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格设置" prop="assetPrice">
            <el-input-number v-model="form.assetPrice" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量设置" prop="assetQuantity">
            <el-input-number v-model="form.assetQuantity" :min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="资产链接" prop="baseUrl" class="w-full">
            <!-- <el-input v-model="form.baseUrl" autocomplete="off" /> -->
            <el-upload
              ref="upload"
              v-model:file-list="fileList"
              action="#"
              :auto-upload="false"
              :limit="1"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-preview="handlePictureCardPreview"
              :on-exceed="handleExceed"
              class="w-full"
            >
              <el-button type="primary">上传</el-button>
              <span>（点击上传按钮，选择想要上传的图片资源）</span>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="description">
            <el-input
              v-model="form.description"
              autocomplete="off"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="uploadFile"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { type RoleData } from "@/api/system/role";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  TabsPaneContext,
  UploadFile
} from "element-plus";
import { genFileId } from "element-plus";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { uploadToMinio } from "@/api/utils/minio";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<any>
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const formRef = ref<FormInstance>();

const form = reactive<any>({
  id: null,
  baseUrl: "",
  path: "",
  description: "",
  assetPrice: 0,
  assetQuantity: 1,
  type: "add"
});
//上传
//minio外链
const addr = ref("http://211.91.61.25:29000/");
const upload = ref<UploadInstance>();
const hideUpload = ref(true);
const imageUrl = ref("");
const imageFile = ref(null);
const fileList = ref([
  // {
  //   name: "man.png",
  //
  //   url: "/man.png"
  // }
]);
watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(form, props.data);
      form.type = form.id ? "update" : "add";
      console.log("form.type", form.type);
      if (props.data.baseUrl !== "") {
        fileList.value = [
          {
            name: props.data.id,
            url: props.data.baseUrl
          }
        ];
      }
    }
  }
);
const handlePictureCardPreview = (file: UploadFile) => {
  imageUrl.value = file.url!;
  // console.log("file", file);
};

const handleChange = (file: UploadFile, fileList) => {
  hideUpload.value = fileList.length >= 1;
  imageFile.value = file;
  // upload(imageFile.value);
  // form.signatureImage = file;
  // form.uploadFile = file.raw;
  console.log("imageFile.value", imageFile.value);
};
const handleRemove = (file: UploadFile) => {
  hideUpload.value = false;
  imageFile.value = null;
  // upload(imageFile.value);
  // console.log("file", file);
};
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const close = () => {
  //重置表单
  formRef.value.resetFields();
  //重置表单校验
  formRef.value.clearValidate();
  fileList.value = [];
  imageFile.value = null;
  emit("update:visible", false);
};

const rules = reactive<FormRules>({
  id: [{ required: true, message: "请输入名称", trigger: "blur" }]
});

const uploadFile = () => {
  console.log("imageFile.value", imageFile.value);
  if (imageFile.value != null) {
    const file = imageFile.value;
    const fileForm = new FormData();
    fileForm.append("file", file.raw);
    uploadToMinio(fileForm).then(res => {
      console.log("res", res);
      form.path = "/" + res.result;
      form.baseUrl = addr.value + res.result;
      //showSuccessMessage("上传成功");
      save();
    });
  } else {
    // detailData.personImage = "";
    if (form.type === "add") {
      showErrorMessage("资源未上传或资源上传失败");
    } else {
      save();
    }
  }
};
const save = () => {
  formRef.value
    .validate()
    .then(() => {
      emit("save", form);
    })
    .catch(() => null);
};
</script>

<style scpoed></style>
