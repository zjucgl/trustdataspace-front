export default {
  path: "/identity",
  meta: {
    icon: "ep:office-building",
    title: "身份中心",
    rank: 10,
    roles: ["admin"]
  },
  children: [
    {
      path: "/identity/contract/index",
      name: "IdentityContract",
      component: () => import("@/views/identity/contract/index.vue"),
      meta: {
        icon: "ri:mail-lock-line",
        title: "合约管理",
        showParent: true
      }
    },
    {
      path: "/identity/policy/index",
      name: "IdentityPolicy",
      component: () => import("@/views/identity/policy/index.vue"),
      meta: {
        icon: "ri:mail-lock-line",
        title: "策略管理",
        showParent: true
      }
    },
    // {
    //   path: "/identity/participant/index",
    //   name: "IdentityParticipant",
    //   component: () => import("@/views/identity/participant/index.vue"),
    //   meta: {
    //     icon: "ep:user",
    //     title: "参与者管理",
    //     showParent: true,
    //     roles: ["admin"]
    //   }
    // },
    {
      path: "/identity/keypair/index",
      name: "IdentityKeyPair",
      component: () => import("@/views/identity/keypair/index.vue"),
      meta: {
        icon: "ep:lollipop",
        title: "密钥查询",
        showParent: true,
        roles: ["admin"]
      }
    },
    {
      path: "/identity/did/index",
      name: "IdentityDid",
      component: () => import("@/views/identity/did/index.vue"),
      meta: {
        icon: "ri:account-box-line",
        title: "DID查询",
        showParent: true,
        roles: ["admin"]
      }
    },
    {
      path: "/identity/credential/index",
      name: "IdentityCredential",
      component: () => import("@/views/identity/credential/index.vue"),
      meta: {
        icon: "ri:mail-lock-line",
        title: "凭证查询",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
} as RouteConfigsTable;
