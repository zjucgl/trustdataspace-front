<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="dropdown-badge navbar-bg-hover select-none">
      <IconifyIconOffline :icon="Star" class="star" />
      {{ roleMap[roles[0]] }}
      <IconifyIconOffline :icon="ArrowDown" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(role, index) in roleList"
          :key="index"
          @click="changeRole(role)"
        >
          {{ role.roleName }}
          <el-tag v-if="role.roles[0] === roles[0]" size="small" class="ml-1">
            当前
          </el-tag>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { resetRouter } from "@/router";
import { initRouter, getTopMenu } from "@/router/utils";
import { router } from "@/router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { roles, roleList, roleSessionKey } from "@/utils/role";
import { getRoleMap } from "@/api/system/role";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import Star from "@iconify-icons/ep/star";
import { showErrorMessage } from "@/utils/message";

const userStore = useUserStoreHook();
const roleMap = ref({});
const multiTagsStore = useMultiTagsStoreHook();
const setRoleMap = () => {
  getRoleMap()
    .then(res => {
      roleMap.value = res.result;
    })
    .catch(showErrorMessage);
};
setRoleMap();
const changeRole = role => {
  if (roles.value[0] === role.roleCode) return;
  userStore.setRoles(role).then(() => {
    resetRouter();
    initRouter().then(() => {
      const currentRoute = router.currentRoute.value;
      const topMenu = getTopMenu(true);
      if (currentRoute.path === topMenu.path) {
        router.go(0);
      } else {
        router.push(topMenu.path);
      }

      multiTagsStore.handleTags("splice", "", {
        startIndex: 1,
        length: Array.isArray(multiTagsStore.multiTags)
          ? multiTagsStore.multiTags.length
          : 1
      });
    });
  });
};
</script>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;
}

.star {
  font-size: 18px;
  margin-right: 5px;
}
</style>
