<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单管理的主体
 -->

<template>
  <div id="menu">
    <i
      v-if="activeIndex == 2"
      class="el-icon-back b pre-icon"
      @click="showCon(1)"
    ></i>
    <menu-list ref="list" v-if="activeIndex == 1"></menu-list>
    <edit-menu
      v-if="activeIndex == 2"
      :activeItem="selectRow"
      @success="successFun"
    ></edit-menu>
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
      selectRow: null,
      list: []
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
    },
    successFun() {
      this.activeIndex = 1;
      // this.$nextTick(() => {
      //   this.$refs.list.getData();
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
#menu {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
