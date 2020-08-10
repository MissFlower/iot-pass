<!--
文件作者：wengyoubin
创建日期：2020.6.18
文件说明：编辑备注名称
 -->
<template>
  <el-dialog
    title="编辑备注名称"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
    v-loading="loading"
  >
    <div class="df ai_c mb20">
      <div class="w100 tr">备注名称：</div>
      <el-input v-model="newDeviceName" placeholder="请输入备注名称"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deviceUpdate } from '@/api/deviceRequest'
export default {
  props: {
    deviceObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: true,
      newDeviceName: '',
      loading: false
    }
  },
  mounted() {
    this.newDeviceName = this.deviceObj.nickName
  },

  methods: {

    // 取消
    handleCancel() {
      this.$parent.deviceNameEditClose()
    },

    // 保存
    handleSave() {
      if (this.newDeviceName.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入备注名称'
        })
        return
      }
      this.loading = true
      deviceUpdate({
        id: this.deviceObj.id,
        nickName: this.newDeviceName
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$parent.deviceNameEditClose(true)
          }
          this.$message({
            type: res.code === 200 ? 'success' : 'warning',
            message: res.message
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 窗口关闭
    handleClose() {
      this.handleCancel()
    }
  }
}
</script>
