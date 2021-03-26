<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in list" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import variables from '../variables.scss'

export default {
  components: { SidebarItem },
  props: {
    list: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route
      let { path } = route
      const pathArr = path.split('/')
      path = '/' + pathArr[1]
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.$store.state.collapse.opened
    }
  }
}
</script>

<style lang="scss">
@import '../variables.scss';
@import './sidebar.scss';
</style>
