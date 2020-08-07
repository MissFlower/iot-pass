<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色的编辑、创建
-->
<template>
  <el-dialog
    v-loading="loading"
    :title="`${editItem.roleId ? '编辑' : '新建'}角色`"
    :visible.sync="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="30%"
    @close="handleClose"
  >
    <div class="df ai_c mb20">
      <div class="w100 tr">
        <span class="red">*</span>角色名称：
      </div>
      <el-input v-model="editItem.name" placeholder="请输入角色名称" />
    </div>
    <div class="df">
      <div class="w100 tr">角色描述：</div>
      <el-input v-model="editItem.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/role'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
      editItem: {
        name: '', //	姓名
        description: ''
      }
    }
  },
  mounted() {
    this.editItem = {
      name: '', //	姓名
      description: ''
    }
    if (this.info) {
      for (const key in this.editItem) {
        this.editItem[key] = this.info[key]
      }
      this.editItem['roleId'] = this.info.roleId
    }
  },
  methods: {
    // 提交函数
    handleSave() {
      if (this.editItem.name === '') {
        this.$message.warning('请输入角色名')
        return
      }
      let promise = null
      let str = ''
      if (this.info) {
        promise = updateRole
        str = '编辑'
      } else {
        promise = addRole
        str = '创建'
      }
      this.loading = true
      promise(this.editItem)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(`角色${str}成功`)
            this.handleClose()
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error(`角色${str}失败`)
          this.loading = false
        })
    },
    // 取消函数
    handleClose() {
      // this.$parent.editFlag = false;
      this.$emit('close')
    }
  }
}
</script>
