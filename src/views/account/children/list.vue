<template>
  <div id="accList">
    <div class="mb20 tr">
      <el-button type="primary" @click="handleShowCon(1)">
        新建用户
      </el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="账户名" prop="name"></el-table-column>
      <el-table-column label="姓名"></el-table-column>
      <el-table-column label="电话"></el-table-column>
      <el-table-column label="邮箱"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <svg-icon
            icon-class="accountRole"
            class="success hand f20"
            @click.stop="handleShowCon(3, scope.row)"
          ></svg-icon>
          <svg-icon
            icon-class="roleSet"
            class="success orange f16 ml20"
            @click.stop="handleShowAddRole(scope.row)"
          ></svg-icon>
          <i
            class="el-icon-edit blue hand ml20 f18"
            @click="handleShowCon(1, scope.row)"
          ></i>
          <i
            class="el-icon-close red ml20 hand f20"
            @click="handleClose(scope.row)"
          ></i>
        </template>
      </el-table-column>
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
          name: "张三"
        },
        {
          id: 2,
          name: "李四"
        }
      ],
      page: 1,
      total: 0
    };
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleShowCon(key, row) {
      this.$parent.switchCon(key, row);
    },
    handleShowAddRole(row) {
      this.$parent.showAddRole(row);
    },
    handleClose() {}
  }
};
</script>

<style lang="scss" scoped>
#accList {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
