<template>
  <div id="equ">
    <div class="mb20 tr">
      <el-button type="primary">新建设备</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID"></el-table-column>
      <el-table-column label="设备名称"></el-table-column>
      <el-table-column label="产品名称"></el-table-column>
      <el-table-column label="节点类型"></el-table-column>
      <el-table-column label="备注名称"></el-table-column>
      <el-table-column label="最后登录时间"></el-table-column>
      <el-table-column label="最后登出时间"></el-table-column>
      <el-table-column label="设备状态"></el-table-column>
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
#equ {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
