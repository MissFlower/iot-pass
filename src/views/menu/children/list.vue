<!--
  文件作者：mawenjuan
  创建日期：2020.6.19
  文件说明：菜单管理的列表
 -->

<template>
  <div id="menu" v-loading="loading">
    <div class="mb20 df">
      <div class="flex1">
        <el-input
          v-model.trim="formData.name"
          placeholder="请输入菜单名"
          class="w200 mr20 searchInput"
          @keyup.enter.native="searchNameFun"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchNameFun"></i>
            <i class="el-icon-close hand" v-if="formData.name != ''" @click="clearFun('name')"></i>
          </span>
        </el-input>
        <el-input
          v-model.trim="formData.code"
          placeholder="请输入菜单编号"
          class="w200 searchInput"
          @keyup.enter.native="searchCodeFun"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchCodeFun"></i>
            <i class="el-icon-close hand" v-if="formData.code != ''" @click="clearFun('code')"></i>
          </span>
        </el-input>
      </div>
      <el-button v-if="authArr.indexOf('menu_add') > -1" type="primary" @click="handleEdit(2)">新建菜单</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column label="ID" prop="menuId" width="80"></el-table-column>
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="菜单编号" prop="code"></el-table-column>
      <el-table-column label="上层菜单">
        <template
          slot-scope="scope"
        >{{ menuObj[scope.row.pcode] ? menuObj[scope.row.pcode] : scope.row.pcode }}</template>
      </el-table-column>
      <el-table-column label="请求地址" prop="url"></el-table-column>
      <el-table-column label="菜单标记" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.menuFlag == "Y" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="图标" prop="icon"></el-table-column>
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template slot-scope="scope">
          <span
            :class="scope.row.status == 'ENABLE' ? 'success' : 'red'"
          >{{ scope.row.status == "ENABLE" ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
        align="center"
        v-if="
          authArr.indexOf('menu_edit') > -1 ||
            authArr.indexOf('menu_remove') > -1
        "
      >
        <template slot-scope="scope">
          <i
            v-if="authArr.indexOf('menu_edit') > -1"
            class="el-icon-edit blue f18"
            @click="handleEdit(2, scope.row)"
          ></i>
          <i
            v-if="authArr.indexOf('menu_remove') > -1"
            class="el-icon-close red f18"
            @click="handleClose(scope.row)"
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
    ></el-pagination>
    <el-table :data="list1" border>
      <el-table-column label="ID" prop="menuId" width="80"></el-table-column>
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="菜单编号" prop="code"></el-table-column>
      <el-table-column label="上层菜单">
        <template
          slot-scope="scope"
        >{{ menuObj[scope.row.pcode] ? menuObj[scope.row.pcode] : scope.row.pcode }}</template>
      </el-table-column>
      <el-table-column label="请求地址" prop="url"></el-table-column>
      <el-table-column label="菜单标记" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.menuFlag == "Y" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="图标" prop="icon"></el-table-column>
      <el-table-column label="状态" prop="status" width="80" align="center">
        <template slot-scope="scope">
          <span
            :class="scope.row.status == 'ENABLE' ? 'success' : 'red'"
          >{{ scope.row.status == "ENABLE" ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
        align="center"
        v-if="
          authArr.indexOf('menu_edit') > -1 ||
            authArr.indexOf('menu_remove') > -1
        "
      >
        <template slot-scope="scope">
          <i
            v-if="authArr.indexOf('menu_edit') > -1"
            class="el-icon-edit blue f18"
            @click="handleEdit(2, scope.row)"
          ></i>
          <i
            v-if="authArr.indexOf('menu_remove') > -1"
            class="el-icon-close red f18"
            @click="handleClose(scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { dealFun } from "@/data/fun";
import { getMenuList, delMenu } from '@/api/menu'
export default {
  data() {
    return {
      loading: false,
      formData: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        code: ''
      },
      list: [],
      list1: [],
      total: 0,
      menuObj: {}
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  watch: {
    'formData.code': function() {
      if (this.$fun.trim(this.formData.code) === '') {
        this.handleCurrentChange(1)
      }
    },
    'formData.name': function() {
      if (this.$fun.trim(this.formData.name) === '') {
        this.handleCurrentChange(1)
      }
    }
  },
  mounted() {
    this.getData()
    this.getData1()
  },
  methods: {
    getData() { // 获取菜单列表
      this.loading = true
      this.list = []
      // this.menuObj = {}
      getMenuList(this.formData).then(res => {
        if (res.code === 200) {
          if (res.data.data) {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                this.menuObj[item.code] = item.name
              })
            }
            this.list = res.data.data
            this.total = res.data.total
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.warning('菜单列表获取失败')
      })
    },
    getData1() { // 获取菜单列表
      this.loading = true
      this.list = []
      // this.menuObj = {}
      getMenuList({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.code === 200) {
          if (res.data.data) {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                this.menuObj[item.code] = item.name
              })
            }
            this.list1 = res.data.data
            // this.total = res.data.total
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.warning('菜单列表获取失败')
      })
    },
    handleEdit(key, row) {
      this.$parent.showCon(key, row)
    },
    handleClose(row) { // 删除菜单
      const str = '确认删除该菜单吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          delMenu({
            id: row.menuId
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('菜单删除成功')
                this.getData()
              } else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
            .catch(() => {
              this.$message.error('菜单删除失败')
              this.loading = false
            })
        })
        .catch(() => {
          this.$message('操作已取消')
        })
    },
    clearFun(key) {
      this.formData[key] = ''
    },
    searchNameFun() { // 筛选
      if (this.$fun.trim(this.formData.name) !== '') {
        this.handleCurrentChange(1)
      }
    },
    searchCodeFun() { // 筛选
      if (this.$fun.trim(this.formData.code) !== '') {
        this.handleCurrentChange(1)
      }
    },
    handleCurrentChange(page) { // 当前页改变
      this.formData.pageNum = page
      this.getData()
    }
  }
}
</script>

<style lang="scss">
#menu {
  position: relative;
  height: 100%;
  width: 100%;
  .el-input__suffix-inner {
    line-height: 32px;
    [class^="el-icon-"] + [class^="el-icon-"] {
      margin-left: 5px;
    }
  }
}
</style>
