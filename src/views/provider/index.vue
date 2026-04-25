<template>
  <el-watermark :font="font" :content="watermark" class="h-full">
    <div class="p-8">
      <div class="flex justify-between mb-4">
        <div class="text-lg font-bold">数据提供方管理</div>
        <el-button type="primary" @click="add">新增提供方</el-button>
      </div>

      <div style="height: calc(100vh - 260px)">
        <el-table
          v-loading="loading"
          :data="tableData"
          class="w-full"
          :header-cell-style="{
            backgroundColor: '#F5F7FA',
            color: '#606266',
            fontWeight: 400
          }"
          height="100%"
        >
          <el-table-column
            type="index"
            width="60"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="providerName"
            label="Provider标识"
            align="center"
            width="140"
          />
          <el-table-column
            prop="providerLabel"
            label="显示名称"
            align="center"
          />
          <el-table-column
            prop="deptName"
            label="关联部门"
            align="center"
          />
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" effect="plain">
                {{ statusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="controlplaneMgmtPort"
            label="管理端口"
            align="center"
            width="100"
          />
          <el-table-column
            prop="deployHost"
            label="部署服务器"
            align="center"
            width="140"
          />
          <el-table-column
            prop="gmtCreate"
            label="创建时间"
            align="center"
            width="170"
          />
          <el-table-column label="操作" width="260" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="edit(row)">
                编辑
              </el-button>
              <el-button link type="primary" @click="detail(row)">
                详情
              </el-button>
              <el-button link type="success" @click="deploy(row)">
                部署脚本
              </el-button>
              <el-button link type="danger" @click="remove(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <provider-form
        v-model:visible="formVisible"
        :data="formData"
        :dept-options="deptTree"
        @save="save"
      />

      <el-dialog v-model="detailVisible" title="Provider 详情" width="500px">
        <el-descriptions :column="1" border v-if="detailData">
          <el-descriptions-item label="Provider标识">
            {{ detailData.providerName }}
          </el-descriptions-item>
          <el-descriptions-item label="显示名称">
            {{ detailData.providerLabel }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ statusLabel(detailData.status) }}
          </el-descriptions-item>
          <el-descriptions-item label="Controlplane管理端口">
            {{ detailData.controlplaneMgmtPort }}
          </el-descriptions-item>
          <el-descriptions-item label="Controlplane协议端口">
            {{ detailData.controlplaneProtocolPort }}
          </el-descriptions-item>
          <el-descriptions-item label="Controlplane公开端口">
            {{ detailData.controlplanePublicPort }}
          </el-descriptions-item>
          <el-descriptions-item label="Dataplane公开端口">
            {{ detailData.dataplanePublicPort }}
          </el-descriptions-item>
          <el-descriptions-item label="Identity Hub端口">
            {{ detailData.identityHubPort }}
          </el-descriptions-item>
          <el-descriptions-item label="STS端口">
            {{ detailData.stsPort }}
          </el-descriptions-item>
          <el-descriptions-item label="数据库地址" v-if="detailData.dbHost">
            {{ detailData.dbHost }}:{{ detailData.dbPort }}/{{
              detailData.dbName
            }}
          </el-descriptions-item>
          <el-descriptions-item label="部署服务器">
            {{ detailData.deployHost }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </el-watermark>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  type ProviderConfigData,
  getProviderList,
  addProvider,
  updateProvider,
  removeProvider as removeProviderApi,
  downloadDeployScript
} from "@/api/provider/index";
import { getDeptPage, type DeptData } from "@/api/orga/dept";
import { showErrorMessage, showSuccessMessage } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import providerForm from "./form.vue";
import { getWatermark } from "@/utils/role";

const font = reactive({ color: "rgba(0, 0, 0, .15)" });
const watermark = getWatermark();

const loading = ref(true);
const tableData = ref<ProviderConfigData[]>([]);
const deptTree = ref<DeptData[]>([]);
const formVisible = ref(false);
const formData = ref<ProviderConfigData | null>(null);
const detailVisible = ref(false);
const detailData = ref<ProviderConfigData | null>(null);

const statusTypeMap: Record<string, string> = {
  PENDING: "info",
  DEPLOYING: "warning",
  RUNNING: "success",
  STOPPED: "danger"
};

const statusLabelMap: Record<string, string> = {
  PENDING: "待部署",
  DEPLOYING: "部署中",
  RUNNING: "运行中",
  STOPPED: "已停止"
};

function statusType(status: string) {
  return statusTypeMap[status] || "info";
}

function statusLabel(status: string) {
  return statusLabelMap[status] || status;
}

async function fetchList() {
  loading.value = true;
  try {
    const res = await getProviderList();
    if (res.success) {
      tableData.value = res.result || [];
    }
  } finally {
    loading.value = false;
  }
}

async function fetchDeptTree() {
  const res = await getDeptPage();
  if (res.success) {
    deptTree.value = res.result || [];
  }
}

function add() {
  formData.value = null;
  formVisible.value = true;
}

function edit(row: ProviderConfigData) {
  formData.value = { ...row };
  formVisible.value = true;
}

function detail(row: ProviderConfigData) {
  detailData.value = row;
  detailVisible.value = true;
}

function deploy(row: ProviderConfigData) {
  downloadDeployScript(row.id!);
}

async function save(data: ProviderConfigData) {
  try {
    const res = data.id
      ? await updateProvider(data)
      : await addProvider(data);
    if (res.success) {
      showSuccessMessage(data.id ? "修改成功" : "创建成功");
      fetchList();
    } else {
      showErrorMessage(res.message);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "操作失败";
    showErrorMessage(msg);
  }
}

async function remove(row: ProviderConfigData) {
  await ElMessageBox.confirm(
    `确认删除提供方 "${row.providerLabel || row.providerName}"？`,
    "提示",
    { type: "warning" }
  );
  const res = await removeProviderApi(row.id!);
  if (res.success) {
    showSuccessMessage("删除成功");
    fetchList();
  } else {
    showErrorMessage(res.message);
  }
}

onMounted(() => {
  fetchList();
  fetchDeptTree();
});
</script>
