const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

const homeRedirect =
  VITE_HIDE_HOME === "true" ? "/dashboard/index" : "/welcome";

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: homeRedirect,
  meta: {
    icon: "ep:home-filled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: "首页",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
