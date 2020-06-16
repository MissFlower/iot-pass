<template>
  <div id="addProduct">
    <div class="mb20 tr">
      <el-button type="primary" @click="handleAdd">新建产品</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="产品KEY" prop="key"></el-table-column>
      <el-table-column label="产品名称" prop="name"></el-table-column>
      <el-table-column label="节点类型"></el-table-column>
      <el-table-column label="联网方式"></el-table-column>
      <el-table-column label="数据格式"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="100"
      layout="total, prev, pager, next"
      :total="total"
      class="tr mt20"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          key: "rty",
          name: "测试产品"
        }
      ],
      page: 1,
      total: 0
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleAdd() {
      this.$router.push("add-product");
    }
  }
};
</script>

<style lang="scss" scoped>
#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
