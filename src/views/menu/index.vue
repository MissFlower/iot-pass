<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单管理的主体
 -->

<template>
  <div id="menu">
    <menu-list v-if="activeIndex == 1"></menu-list>
    <edit-menu v-if="activeIndex == 2" :activeItem="selectRow"></edit-menu>
  </div>
</template>

<script>
import menuList from "./children/list";
import editMenu from "./children/editmenu";
export default {
  components: { menuList, editMenu },
  data() {
    return {
      activeIndex: 1,
      selectRow: null
    };
  },
  methods: {
    showCon(key, row) {
      if (row) {
        this.selectRow = row;
      } else {
        this.selectRow = null;
      }
      this.activeIndex = key;
    }
  }
};
</script>

<style lang="scss" scoped>
#menu {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
