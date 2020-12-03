<template>
  <el-dialog title="设备固件详情" :visible.sync="dialogVisible" width="300px" @close="close">
    <el-table :data="list">
      <el-table-column label="模块名称" prop="moduleType"></el-table-column>
      <el-table-column label="模块固定版本" prop="version"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>
