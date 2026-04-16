export default {
  path: "/provider",
  meta: {
    icon: "ep:connection",
    title: "提供方管理",
    rank: 5,
    roles: ["admin"]
  },
  children: [
    {
      path: "/provider/index",
      name: "ProviderList",
      component: () => import("@/views/provider/index.vue"),
      meta: {
        icon: "ep:connection",
        title: "数据提供方",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
