<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色管理的主体
-->
<template>
  <div id="role">
    <i v-if="activeIndex == 2" class="el-icon-back b pre-icon" @click="switchCon(0)" />
    <list ref="list" v-if="activeIndex == 0 || activeIndex == 1 || activeIndex == 3" />
    <edit-role v-if="editFlag" :info="selectRow" @close="handleCloseEditRole" />
    <role-auth v-if="activeIndex == 2" :info="selectRow" />
  </div>
</template>

<script>
import list from './children/list'
import editRole from './children/editRole'
import roleAuth from './children/editRoleAuth'
export default {
  components: { list, editRole, roleAuth },
  data() {
    return {
      activeIndex: 0,
      selectRow: null,
      editFlag: false
    }
  },
  methods: {
    // 主题显示切换函数
    switchCon(key, row) {
      if (row) {
        this.selectRow = row
      } else {
        this.selectRow = null
      }
      this.activeIndex = key
    },
    // 显示编辑、添加角色弹框
    showEditRole(row) {
      this.selectRow = row
      this.editFlag = true
    },
    // 关闭编辑、添加角色弹框
    handleCloseEditRole() {
      this.editFlag = false
      this.$refs.list.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
#role {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
