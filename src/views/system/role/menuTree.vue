<template>
  <el-dialog
    :title="'权限分配'"
    center
    width="40%"
    :model-value="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <el-tree
      ref="treeRef"
      style="width: 100%"
      :data="treeData"
      show-checkbox
      node-key="menuId"
      :default-checked-keys="roleData.menuList"
      :props="defaultProps"
    />
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick } from "vue";
import { ElTree } from "element-plus";
import { type RoleData, getMenuTree } from "@/api/system/role";

const emit = defineEmits(["update:visible", "save"]);
const props = defineProps({
  data: {
    type: Object as PropType<RoleData>
  },
  visible: {
    type: Boolean,
    default: false
  }
});
const defaultProps = {
  children: "children",
  label: "menuName"
};
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref();
const roleData = reactive<RoleData>({
  roleId: null,
  roleName: "",
  roleCode: "",
  roleInfo: "",
  menuList: []
});

watch(
  () => props.visible,
  visible => {
    if (visible) {
      Object.assign(roleData, props.data);
      nextTick(() => {
        treeRef.value!.setCheckedKeys(roleData.menuList, false);
      });
    }
  }
);

const setTableData = () => {
  getMenuTree()
    .then(res => {
      treeData.value = res.result;
    })
    .catch(err => {
      console.error(err);
    });
};
setTableData();
const close = () => {
  emit("update:visible", false);
  treeRef.value!.setCheckedKeys([], false);
};
const save = () => {
  roleData.menuList = treeRef.value!.getCheckedKeys(true);
  // console.log("data=", roleData);
  emit("save", roleData);
};
</script>

<style scpoed></style>
