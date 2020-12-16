<template>
  <div id="breadcrumb">
    <el-tag v-for="(tag, index) in list" :key="index" class="mr10 hand" :closable="tag.path != '/home'" :type="$route.fullPath == tag.path ? '' : 'info'" @close.stop="handleClose(index, tag)" @click.native="handleSelect(index)">{{ tag.meta.name }}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {}
  },
  computed: {
    list() {
      return this.$store.state.app.breadcrumdList
    }
  },
  methods: {
    handleClose(index, row) {
      const curPath = this.$route.fullPath
      if (curPath === row.path) {
        this.handleSelect(index - 1)
      }
      const list_ = JSON.parse(JSON.stringify(this.list))
      list_.splice(index, 1)
      this.$store.dispatch('resetBreadcrumb', list_)
    },
    handleSelect(index) {
      const path = this.list[index].path
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
#breadcrumb {
  position: fixed;
  height: 45px;
  // display: flex;
  background: #fff;
  padding: 10px;
  width: calc(100% - 235px);
  border-bottom: 1px solid #e6e6e6;
  overflow-x: auto;
  z-index: 3;
  top: 61px;
  white-space: nowrap;
}
</style>
