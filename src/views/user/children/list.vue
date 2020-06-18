<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：用户的列表
-->

<template>
  <div id="accList">
    <div class="mb20 df">
      <div class="flex1">
        <el-input
          v-model="formData.account"
          placeholder="请输入账号名"
          class="w200 mr20"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchAccountFun"
        ></el-input>
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
          class="w200"
          suffix-icon="el-icon-search"
          @keyup.enter.native="searchPhoneFun"
        ></el-input>
      </div>
      <el-button type="primary" @click="handleShowCon(1)">
        新建用户
      </el-button>
    </div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column
        label="账户名"
        prop="account"
        align="center"
      ></el-table-column>
      <el-table-column
        label="姓名"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="电话"
        prop="phone"
        align="center"
      ></el-table-column>
      <el-table-column
        label="邮箱"
        prop="email"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.status == 0 ? 'success' : 'red'">
            {{ scope.row.status == 0 ? "启用" : "禁用" }}
          </span>
        </template>
      </el-table-column>
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
      @current-change="handleCurrentChange"
      :current-page.sync="formData.pageNum"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      class="tr mt20"
    >
    </el-pagination>
  </div>
</template>

<script>
import { userList, delUser } from "@/api/user";
export default {
  data() {
    return {
      list: [],
      loading: false,
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
        account: "",
        phone: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  watch: {
    "formData.account": function() {
      if (this.$fun.trim(this.formData.account === "")) {
        this.handleCurrentChange(1);
      }
    },
    "formData.phone": function() {
      if (this.$fun.trim(this.formData.phone === "")) {
        this.handleCurrentChange(1);
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.list = [];
      userList(this.formData)
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.list) {
              this.list = res.data.list;
            }
            this.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("用户列表获取失败");
          this.loading = false;
        });
    },
    searchAccountFun() {
      if (this.$fun.trim(this.formData.account === "")) {
        return;
      }
      this.handleCurrentChange(1);
    },
    searchPhoneFun() {
      if (this.$fun.trim(this.formData.phone === "")) {
        return;
      }
      this.handleCurrentChange(1);
    },
    handleCurrentChange(page) {
      this.formData.pageNum = page;
      this.getData();
    },
    handleShowCon(key, row) {
      this.$parent.switchCon(key, row);
    },
    handleShowAddRole(row) {
      this.$parent.showAddRole(row);
    },
    handleClose(row) {
      const str = "确认删除该用户吗？";
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          delUser({
            id: row.id
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success("用户删除成功");
                this.getData();
              } else {
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("用户删除失败");
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message("操作已取消");
        });
    }
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
