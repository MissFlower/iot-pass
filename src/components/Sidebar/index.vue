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
import { dealUserTreeFun } from "@/data/fun";

export default {
  components: { SidebarItem },
  data() {
    return {
      baseList: [
        {
          icon: "home",
          name: "首页",
          path: "/home"
        }
      ],
      list: []
    };
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { path } = route;
      return path;
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo;
    // },
    menuLists () {
      return this.$store.state.app.menuLists
    }
  },
  watch: {
    menuLists () {
      this.menuListDealFun()
    }
  },
  mounted() {
    this.menuListDealFun()
  },
  methods: {
    menuListDealFun () {
      this.menuLists.forEach(item => {
        if (!item.path) {
          item.path = '404'
        }
      })
      const list = dealUserTreeFun(this.menuLists)
      if (list.length > 0 && list[0].children) {
        this.list = this.baseList.concat(list[0].children)
      }
    }
  }
};
</script>
