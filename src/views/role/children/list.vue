<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色的列表
-->

<template>
  <div id="roleList" v-loading="loading">
    <div class="mb20 df">
      <div class="flex1">
        <el-input
          v-model.trim="formData.name"
          placeholder="角色名称"
          class="w200 searchInput"
          @keyup.enter.native="searchFun"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchFun"></i>
            <i class="el-icon-close hand" v-if="formData.name != ''" @click="clearFun('name')"></i>
          </span>
        </el-input>
      </div>
      <el-button
        v-if="authArr.indexOf('role_add') > -1"
        type="primary"
        @click="handleShowEdit()"
      >
        新建角色
      </el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="roleId"></el-table-column>
      <el-table-column label="角色名" prop="name"></el-table-column>
      <!-- <el-table-column label="排序"></el-table-column> -->
      <el-table-column label="描述" prop="description"></el-table-column>
      <el-table-column label="创建时间" prop="createTime_"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <svg-icon
            v-if="authArr.indexOf('role_setAuthority') > -1"
            icon-class="auth"
            class="success hand f20"
            @click.stop="handleShowCon(2, scope.row)"
          ></svg-icon>
          <i
            v-if="authArr.indexOf('role_edit') > -1"
            class="el-icon-edit blue hand f18"
            @click="handleShowEdit(scope.row)"
          ></i>
          <i
            v-if="authArr.indexOf('role_remove') > -1"
            class="el-icon-close red hand f20"
            @click="handleDelete(scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="formData.pageNum"
      :page-size="formData.pageSize"
      layout="total, prev, pager, next"
      :total="total"
      class="tr mt20"
    >
    </el-pagination>
  </div>
</template>

<script>
import { roleList, delRole } from "@/api/role";

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
        name: ""
      }
    };
  },
  watch: {
    "formData.name": function() { // 监控name字段
      if (this.$fun.trim(this.formData.name === "")) {
        this.handleCurrentChange(1);
      }
    }
  },
  computed: {
    authArr() {// 页面权限
      return this.$store.state.app.functionArr;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取角色列表
    getData() {
      this.loading = true;
      this.list = [];
      roleList(this.formData)
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.data && res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.createTime_ = item.createTime
                  ? this.$fun.dateFormat(
                      this.$fun.strFormatDate(item.createTime),
                      "yyyy-MM-dd hh:mm:ss"
                    )
                  : "";
              });
              this.list = res.data.data;
            }
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.$message.error(res.message);
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message.error("角色列表获取失败");
          this.loading = false;
        });
    },
    clearFun(key) {
      this.formData[key] = ''
    },
    // 筛选函数
    searchFun() {
      if (this.$fun.trim(this.formData.name === "")) {
        return;
      }
      this.handleCurrentChange(1);
    },
    // 选择页
    handleCurrentChange(page) {
      this.formData.pageNum = page;
      this.getData();
    },
    // 主题切换
    handleShowCon(key, row) {
      this.$parent.switchCon(key, row);
    },
    // 编辑函数
    handleShowEdit(row) {
      this.$parent.showEditRole(row);
    },
    // 删除函数，触发提示
    handleDelete(row) {
      const str = "确认删除该角色吗？";
      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          delRole({
            roleId: row.roleId
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success("角色删除成功");
                this.getData();
              } else {
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("角色删除失败");
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
