<!--
文件作者：mawenjuan
创建日期：2020.7.23
文件说明：验证进程
 -->

<template>
  <el-dialog :visible.sync="visible" title="验证固件" @close="close" width="30%">
    <div class="df mb10 f12">
      <div class="flex1">
        <i v-if="status == 1" class="el-icon-loading"></i>
        <svg-icon v-else icon-class="success"></svg-icon>
        <span class="ml10">{{ status == 1 ? '固件升级中…' : '固件升级完成' }}</span>
      </div>
      <div>{{ value }}%</div>
    </div>
    <el-progress :stroke-width="5" :percentage="value" :show-text="false" :color="color"></el-progress>
    <div
      class="f12 c9 mt10"
    >{{ status == 1 ? '固件验证需要时间，请耐心等待。（升级状态请到升级详情页查看）' : '验证固件已完成，您可以开始进行批量升级。' }}</div>
    <span slot="footer">
      <el-button v-if="status == 2" size="mini" type="primary" @click="handleUpgrade">批量升级</el-button>
      <el-button size="mini" @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: true,
      value: 0,
      color: '#0070cc'
    }
  },
  mounted() {
    if (this.status === 1) {
      this.value = 0
    } else if (this.status === 2) {
      this.value = 100
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleUpgrade() {
      this.$emit('upgrade')
    }
  }
}
</script>
