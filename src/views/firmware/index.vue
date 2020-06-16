<template>
  <div id="firmware">
    <div class="mb20 tr">
      <el-button type="primary">新建设备</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="固件ID"></el-table-column>
      <el-table-column label="固件名称"></el-table-column>
      <el-table-column label="产品名称"></el-table-column>
      <el-table-column label="升级前版本"></el-table-column>
      <el-table-column label="升级后版本"></el-table-column>
      <el-table-column label="创建时间"></el-table-column>
      <el-table-column label="固件状态"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <el-pagination
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
      list: [],
      page: 1,
      total: 0
    };
  },
  methods: {
    handleCurrentChange() {}
  }
};
</script>

<style lang="scss" scoped>
#firmware {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
