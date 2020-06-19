<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        background-color="#fff"
        text-color="#3A3E4A"
        :unique-opened="false"
        active-text-color="#4F94FF"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in list"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from "./SidebarItem";
// import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  data() {
    return {
      list: [
        {
          icon: "home",
          title: "首页",
          path: "/home"
        },
        {
          icon: "menu",
          title: "菜单管理",
          path: "/menu"
          // children: [
          //   {
          //     icon: "menu",
          //     title: "菜单管理0",
          //     path: "index"
          //   },
          //   {
          //     icon: "menu",
          //     title: "菜单管理1",
          //     path: "index1"
          //   }
          // ]
        },
        {
          title: "角色管理",
          path: "/role/index",
          icon: "role"
        },
        {
          title: "用户管理",
          path: "/account/index",
          icon: "account"
        },
        {
          title: "产品管理",
          path: "/product/index",
          icon: "product"
        },
        // {
        //   title: "物模型管理",
        //   path: "/model/index",
        //   icon: "model"
        {
          title: "设备管理",
          path: "/device/deviceManage",
          icon: "equ"
        },
        {
          title: "固件管理",
          path: "/firmware/index",
          icon: "firmware"
        },
        {
          title: "日志管理",
          path: "/log/index",
          icon: "log"
        }
      ]
    };
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { path } = route;
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    }
  }
};
</script>
