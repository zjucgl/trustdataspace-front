export default {
  path: "/dashboard",
  redirect: "/dashboard/index",
  meta: {
    icon: "ep:stopwatch",
    title: "仪表板",
    rank: 1,
    roles: ["admin", "consumer", "providerQA"]
  },
  children: [
    {
      path: "/dashboard/index",
      name: "Board",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        icon: "ep:stopwatch",
        title: "数据概览",
        showParent: false,
        roles: ["admin", "consumer", "providerQA"]
      }
    }
  ]
} as RouteConfigsTable;
