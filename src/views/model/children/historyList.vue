<template>
  <el-drawer ref="drawer" title="历史版本" :visible.sync="drawer" @close="close">
    <div class="con">
      <el-table :data="list">
        <el-table-column label="历史版本" prop="version"></el-table-column>
        <el-table-column label="发布时间"></el-table-column>
        <el-table-column label="版本描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.version == selectVersion"
              type="info"
              class="f12 c9"
              :underline="false"
            >已选择</el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
              class="f12"
              @click="selectVersionFun(scope.row.version)"
            >选择</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button @click="closeDrawer">关闭</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selectVersion: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      drawer: true
    }
  },
  mounted() {
    console.log(this.list)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selectVersionFun(version) {
      this.$emit('selectVertion', version)
    },
    closeDrawer() {
      this.$refs.drawer.closeDrawer()
    }
  }
}
</script>

<style lang="scss">
.el-drawer__header {
  padding: 15px;
  margin-bottom: 0;
  border: 1px solid #efefef;
  font-size: 16px;
}
</style>
