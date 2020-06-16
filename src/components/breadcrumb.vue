<template>
  <div id="breadcrumb">
    <el-breadcrumb separator="/">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item
        v-for="(item, index) in list"
        :key="index"
        :to="{ path: item.path }"
        @click.native="handleClick(item, index)"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
// import { delBreadCrumbFun } from "@/data/fun";
export default {
  data() {
    return {};
  },
  computed: {
    list() {
      return this.$store.state.app.breadcrumdList;
    }
  }
  // methods: {
  //   handleClick(row, index) {
  //     if (row.path) {
  //       delBreadCrumbFun(index + 1);
  //     }
  //   }
  // }
};
</script>

<style lang="scss" scoped>
#breadcrumb {
  display: inline-block;
  padding: 20px;
}
</style>
