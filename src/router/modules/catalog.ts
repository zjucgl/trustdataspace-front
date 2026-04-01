export default {
  path: "/catalog",
  redirect: "/catalog/index",
  meta: {
    icon: "ep:notebook",
    title: "资产目录",
    rank: 1,
    roles: ["admin", "consumer", "providerQA"]
  },
  children: [
    {
      path: "/catalog/index",
      name: "CatalogAsset",
      component: () => import("@/views/catalog/index.vue"),
      meta: {
        icon: "ep:notebook",
        title: "资产目录",
        showParent: false
      }
    }
  ]
} as RouteConfigsTable;
