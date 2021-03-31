<!--
  文件作者：mawenjuan
  创建日期：2020.6.19
  文件说明：用户的角色列表
-->

<template>
  <div id="accRoleList" v-loading="loading">
    <div class="mb20">
      <span>{{ info.name ? info.name : info.account }}的角色列表</span>
      <!-- <svg-icon
        icon-class="roleSet"
        class="success orange f16 ml20"
        @click.stop="handleShowAddRole"
      /> -->
    </div>
    <el-table :data="roleList" border class="w200">
      <el-table-column label="ID" prop="roleId" width="60" />
      <el-table-column label="角色名称" prop="name" />
    </el-table>
  </div>
</template>

<script>
import { userRoleList } from '@/api/user'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      roleList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // 角色列表
      this.loading = true
      this.roleList = []
      userRoleList({
        userId: this.info.id
      })
        .then(res => {
          if (res.code === 200) {
            this.roleList = res.data.roles.filter(item => {
              return item.checked
            })
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error('角色列表获取失败')
          this.loading = false
        })
    },
    handleShowAddRole() {
      this.$parent.showAddRole(this.info)
    }
  }
}
</script>
