<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色的菜单权限的展示、编辑
 -->
<template>
  <div id="roleAuth" v-loading="loading">
    <div class="ml20 mb20">
      <span>角色权限</span>
      <span v-if="flag" class="f12 blue ml20">(编辑中)</span>
      <el-button v-else type="primary" class="fr" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
    </div>
    <div class="main">
      <el-checkbox-group v-model="ids" :disabled="!flag">
        <selectPart :list="authData" :type="0" :selects="ids" />
      </el-checkbox-group>
    </div>
    <div v-if="flag" class="tc mt20">
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getMenusTree, setAuthorityForRole } from '@/api/role'
import { dealAuthTreeFun } from '@/data/fun'
import selectPart from './selectPart'
export default {
  components: { selectPart },
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  inject: ['reload'],
  data() {
    return {
      flag: 0,
      loading: false,
      authData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      ids: [],
      allList: null // 用户编辑状态的切换
    }
  },
  computed: {
    auths() {
      return this.$store.state.app.auths
    }
  },
  watch: {
    auths() {
      this.ids = JSON.parse(JSON.stringify(this.auths))
    }
  },
  mounted() {
    this.getAuth()
  },
  methods: {
    // 获取角色权限
    getAuth() {
      this.loading = true
      this.authData = []
      this.ids = []
      getMenusTree({
        roleId: this.info.roleId
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              res.data.forEach(item => {
                if (item.checked) {
                  this.ids.push(item.id)
                }
                item.disabled = true
              })
              this.$store.dispatch('setAuths', this.ids)
              this.allList = res.data
              this.authData = dealAuthTreeFun(res.data)
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error('角色的菜单权限获取失败')
          this.loading = false
        })
    },
    handleEdit() {
      this.allList.forEach(item => {
        item.disabled = false
      })
      this.flag = 1
    },
    // 取消函数
    handleCancel() {
      this.getAuth()
      this.flag = 0
    },
    // 提交函数
    handleSave() {
      // this.ids = this.$refs.tree.getCheckedKeys();
      this.loading = true
      setAuthorityForRole({
        roleId: this.info.roleId,
        ids: this.ids.join(',')
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('角色的菜单权限设置成功')
            this.reload(1)
            this.flag = 0
            this.getAuth()
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$message.error('角色的菜单权限设置失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#roleAuth {
  position: relative;
  width: 100%;
  height: 100%;
  .main {
    position: relative;
    height: calc(100% - 80px);
    overflow: auto;
    padding: 0 20px;
  }
}
</style>

<style lang="scss">
#roleAuth {
  .el-checkbox {
    display: flex;
    width: 100%;
    .el-checkbox__label {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
    opacity: 0.6;
  }
  .el-checkbox__label {
    font-weight: 400;
    color: #606266;
  }
}
</style>
