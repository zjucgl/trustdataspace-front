<template>
  <el-dialog
    :title="form.type === 'update' ? '编辑资产' : '新增资产'"
    center
    width="640px"
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
              :disabled="form.type === 'update'"
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
          <el-form-item label="数据源类型" prop="sourceType">
            <el-radio-group
              v-model="form.sourceType"
              :disabled="form.type === 'update'"
            >
              <el-radio-button label="HttpData">HTTP / 文件</el-radio-button>
              <el-radio-button label="AmazonS3">S3 / OSS</el-radio-button>
              <el-radio-button label="JdbcDataAddress">JDBC</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <template v-if="form.sourceType === 'HttpData'">
          <el-col :span="24">
            <el-form-item label="资产链接" prop="baseUrl" class="w-full">
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
                <span>（点击上传按钮，选择想要上传的资源文件）</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </template>

        <template v-if="form.sourceType === 'AmazonS3'">
          <el-col :span="24">
            <el-form-item label="Endpoint" prop="s3Endpoint">
              <el-input
                v-model="form.s3Endpoint"
                placeholder="如 https://oss-cn-hangzhou.aliyuncs.com"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bucket" prop="s3Bucket">
              <el-input v-model="form.s3Bucket" placeholder="bucket 名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Object" prop="s3ObjectName">
              <el-input
                v-model="form.s3ObjectName"
                placeholder="如 datasets/training/clip-001.mp4"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="AccessKey" prop="s3AccessKey">
              <el-input v-model="form.s3AccessKey" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SecretKey" prop="s3SecretKey">
              <el-input
                v-model="form.s3SecretKey"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
        </template>

        <template v-if="form.sourceType === 'JdbcDataAddress'">
          <el-col :span="24">
            <el-form-item label="JDBC URL" prop="jdbcUrl">
              <el-input
                v-model="form.jdbcUrl"
                placeholder="如 jdbc:mysql://host:3306/dbname"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="jdbcUser">
              <el-input v-model="form.jdbcUser" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="jdbcPassword">
              <el-input
                v-model="form.jdbcPassword"
                type="password"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表名" prop="jdbcTable">
              <el-input v-model="form.jdbcTable" placeholder="如 orders" />
            </el-form-item>
          </el-col>
        </template>

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
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, type PropType } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadFile,
  UploadUserFile
} from "element-plus";
import { genFileId } from "element-plus";
import { showErrorMessage } from "@/utils/message";
import { uploadToMinio } from "@/api/utils/minio";
import {
  ASSET_SOURCE_TYPES,
  type AssetSourceType,
  type AssetData
} from "@/api/mvd/asset";

type FormState = {
  id: string;
  type: "add" | "update";
  assetPrice: number;
  assetQuantity: number;
  description: string;
  contractdefinition: string;
  sourceType: AssetSourceType;
  baseUrl: string;
  path: string;
  s3Endpoint: string;
  s3Bucket: string;
  s3ObjectName: string;
  s3AccessKey: string;
  s3SecretKey: string;
  jdbcUrl: string;
  jdbcUser: string;
  jdbcPassword: string;
  jdbcTable: string;
};

type IncomingFormData = AssetData & {
  type?: "add" | "update";
  assetPrice?: number;
  assetQuantity?: number;
  path?: string;
};

type SaveEvent = FormState;

const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
  (e: "save", data: SaveEvent): void;
}>();

const props = defineProps({
  data: {
    type: Object as PropType<IncomingFormData>,
    default: () => ({})
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const formRef = ref<FormInstance>();

const getDefaults = (): FormState => ({
  id: "",
  type: "add",
  assetPrice: 0,
  assetQuantity: 1,
  description: "",
  contractdefinition: "",
  sourceType: "HttpData",
  baseUrl: "",
  path: "",
  s3Endpoint: "",
  s3Bucket: "",
  s3ObjectName: "",
  s3AccessKey: "",
  s3SecretKey: "",
  jdbcUrl: "",
  jdbcUser: "",
  jdbcPassword: "",
  jdbcTable: ""
});

const form = reactive<FormState>(getDefaults());

const minioBaseUrl = "http://211.91.61.25:29000/";
const upload = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
const imageFile = ref<UploadFile | null>(null);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    Object.assign(form, getDefaults());
    const incoming = props.data ?? {};
    if (incoming.id) {
      form.id = incoming.id;
      form.type = incoming.type ?? "update";
    } else {
      form.type = incoming.type ?? "add";
    }
    if (incoming.assetPrice !== undefined) form.assetPrice = incoming.assetPrice;
    if (incoming.assetQuantity !== undefined) form.assetQuantity = incoming.assetQuantity;
    if (incoming.description) form.description = incoming.description;
    if (incoming.contractdefinition)
      form.contractdefinition = incoming.contractdefinition;
    const incomingSourceType = incoming.sourceType;
    if (
      incomingSourceType &&
      ASSET_SOURCE_TYPES.includes(incomingSourceType)
    ) {
      form.sourceType = incomingSourceType;
    }
    if (incoming.baseUrl) {
      form.baseUrl = incoming.baseUrl;
      fileList.value = [{ name: incoming.id ?? "", url: incoming.baseUrl }];
    } else {
      fileList.value = [];
    }
    if (incoming.path) form.path = incoming.path;
    form.s3Endpoint = incoming.s3Endpoint ?? "";
    form.s3Bucket = incoming.s3Bucket ?? "";
    form.s3ObjectName = incoming.s3ObjectName ?? "";
    form.s3AccessKey = incoming.s3AccessKey ?? "";
    form.s3SecretKey = incoming.s3SecretKey ?? "";
    form.jdbcUrl = incoming.jdbcUrl ?? "";
    form.jdbcUser = incoming.jdbcUser ?? "";
    form.jdbcPassword = incoming.jdbcPassword ?? "";
    form.jdbcTable = incoming.jdbcTable ?? "";
    imageFile.value = null;
  }
);

const handlePictureCardPreview = (_file: UploadFile) => {};

const handleChange: UploadProps["onChange"] = (file, files) => {
  imageFile.value = files.length > 0 ? file : null;
};

const handleRemove: UploadProps["onRemove"] = () => {
  imageFile.value = null;
};

const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const close = () => {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  fileList.value = [];
  imageFile.value = null;
  emit("update:visible", false);
};

const rules = reactive<FormRules>({
  id: [{ required: true, message: "请输入名称", trigger: "blur" }],
  sourceType: [
    { required: true, message: "请选择数据源类型", trigger: "change" }
  ],
  s3Endpoint: [{ required: true, message: "请输入 Endpoint", trigger: "blur" }],
  s3Bucket: [{ required: true, message: "请输入 Bucket", trigger: "blur" }],
  s3ObjectName: [
    { required: true, message: "请输入 Object 路径", trigger: "blur" }
  ],
  jdbcUrl: [{ required: true, message: "请输入 JDBC URL", trigger: "blur" }],
  jdbcTable: [{ required: true, message: "请输入表名", trigger: "blur" }]
});

const submit = () => {
  if (form.sourceType === "HttpData" && form.type === "add") {
    const file = imageFile.value;
    if (!file) {
      showErrorMessage("HTTP 资源未上传");
      return;
    }
    const fileForm = new FormData();
    if (file.raw) fileForm.append("file", file.raw);
    uploadToMinio(fileForm).then(res => {
      const objectKey: string = res.result;
      form.path = "/" + objectKey;
      form.baseUrl = minioBaseUrl + objectKey;
      validateAndEmit();
    });
    return;
  }
  validateAndEmit();
};

const validateAndEmit = () => {
  formRef.value
    ?.validate()
    .then(() => emit("save", { ...form }))
    .catch(() => null);
};
</script>

<style scoped></style>
