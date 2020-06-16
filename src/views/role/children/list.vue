<template>
  <div>
    <div class="mb20 tr">
      <el-button type="primary" @click="handleShowCon(3)">新建角色</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="角色名" prop="name"></el-table-column>
      <el-table-column label="排序"></el-table-column>
      <el-table-column label="描述"></el-table-column>
      <el-table-column label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <svg-icon
            icon-class="auth"
            class="success hand f20"
            @click.stop="handleShowCon(2, scope.row)"
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
          name: "管理员",
          id: "1"
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
    handleClose() {}
  }
};
</script>
