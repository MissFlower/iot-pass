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
          v-model.trim="formData.account"
          placeholder="请输入账号名"
          class="w200 mr20 searchInput"
          @keyup.enter.native="searchAccountFun"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchAccountFun" />
            <i
              v-if="formData.account != ''"
              class="el-icon-close hand"
              @click="clearFun('account')"
            />
          </span>
        </el-input>
        <el-input
          v-model.trim="formData.phone"
          placeholder="请输入手机号"
          class="w200 searchInput"
          @keyup.enter.native="searchPhoneFun"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchPhoneFun" />
            <i v-if="formData.phone != ''" class="el-icon-close hand" @click="clearFun('phone')" />
          </span>
        </el-input>
      </div>
      <el-button
        v-if="authArr.indexOf('mgr_add') > -1"
        type="primary"
        @click="handleShowCon(1)"
      >新建用户</el-button>
    </div>
    <el-table v-loading="loading" :data="list" border :max-height="tableHeight">
      <el-table-column label="ID" prop="id" align="center" width="50" />
      <el-table-column label="账号名" prop="account">
        <template slot-scope="{ row }">
          <span>{{ row.account }}</span>
          <span @mouseout="showRoleList($event, row)" @mouseleave.stop="hideRoleList">
            <svg-icon icon-class="accountRole" class="success hand f14 ml10" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="电话" prop="phone" align="center" />
      <el-table-column label="邮箱" prop="email" align="center" />
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.status == 0 ? 'success' : 'red'">
            {{ scope.row.status == 0 ? "启用" : "禁用" }}
          </span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="authArr.indexOf('mgr_updateRole') > -1" @click.stop="handleShowAddRole(scope.row)">角色配置</el-button>
          <el-button type="text" v-if="authArr.indexOf('mgr_edit') > -1" @click="handleShowCon(1, scope.row)">编辑</el-button>
          <el-button type="text" v-if="authArr.indexOf('mgr_delete') > -1" @click="handleClose(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="formData.pageNum"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total"
      class="tr mt20"
      @current-change="handleCurrentChange"
    />
    <el-popover placement="right" ref="popover" width="200" trigger="manual" v-model="visible">
      <role-list v-if="userInfo" :info="userInfo"></role-list>
      <el-button v-show="false" slot="reference">手动激活</el-button>
    </el-popover>
  </div>
</template>

<script>
import { userList, delUser } from '@/api/user'

import roleList from './roleList'

export default {
  components: { roleList },
  data() {
    return {
      visible: false,
      userInfo: null,
      list: [],
      loading: false,
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
        account: '',
        phone: '',
        startTime: '',
        endTime: ''
      },
      tableHeight: window.innerHeight - 245
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  watch: {
    'formData.account': function() {
      if (this.$fun.trim(this.formData.account === '')) {
        this.handleCurrentChange(1)
      }
    },
    'formData.phone': function() {
      if (this.$fun.trim(this.formData.phone === '')) {
        this.handleCurrentChange(1)
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // 列表数据获取
      this.loading = true
      this.list = []
      userList(this.formData)
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.data) {
              this.list = res.data.data
            }
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error('用户列表获取失败')
          this.loading = false
        })
    },
    clearFun(key) {
      this.formData[key] = ''
    },
    searchAccountFun() {
      // 账号名筛选函数
      if (this.$fun.trim(this.formData.account === '')) {
        return
      }
      this.handleCurrentChange(1)
    },
    searchPhoneFun() {
      // 手机号筛选函数
      if (this.$fun.trim(this.formData.phone === '')) {
        return
      }
      this.handleCurrentChange(1)
    },
    handleCurrentChange(page) {
      // 页面切换函数
      this.formData.pageNum = page && page > 0 ? page : this.formData.pageNum
      this.getData()
    },
    handleShowCon(key, row) {
      this.$parent.switchCon(key, row)
    },
    handleShowAddRole(row) {
      this.$parent.showAddRole(row)
    },
    handleClose(row) {
      // 用户删除
      const str = '确认删除该用户吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          delUser({
            id: row.id
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('用户删除成功')
                this.getData()
              } else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
            .catch(() => {
              this.$message.error('用户删除失败')
              this.loading = false
            })
        })
        .catch(() => {
          this.$message('操作已取消')
        })
    },
    // 显示角色列表
    showRoleList(e, row) {
      if (this.userInfo && row.id === this.userInfo.id) { // 防止弹框抖动
        return
      }
      this.userInfo = row
      const el = e.target
      this.visible = true
      this.$nextTick(() => {
        const pop = this.$refs.popover
        pop.popperJS._reference = el
        pop.popperJS.state.position = pop.popperJS._getPosition(pop.popperJS._popper, pop.popperJS._reference)
        pop.popperJS.update()
      })
    },
    // 隐藏角色列表
    hideRoleList() {
      this.visible = false
      this.userInfo = null
    }
  }
}
</script>

<style lang="scss" scoped>
#accList {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
