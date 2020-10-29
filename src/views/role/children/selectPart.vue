<template>
  <div class="selectPart mb20" :class="type > 1 ? 'df fww' : ''">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="selectPartItem"
      :class="type > 1 ? 'df' : ''"
    >
      <div class="w200 mt10">
        <!-- :disabled="item.pid != 0 && selects.indexOf(item.pid) == -1" -->
        <el-checkbox
          :label="item.id"
          @change="handeleChangeNode(item)"
        >{{ item.name }}</el-checkbox>
      </div>
      <div class="df selectPartChildren" v-if="item.children">
        <select-part :list="item.children" :type="type + 1" :selects="selects"></select-part>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectPart',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 0
    },
    selects: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handeleChangeNode(row) {
      const len = this.selects.indexOf(row.id)
      if (len > -1) {
        // 之前存在，删除
        this.selects.splice(len, 1)
        if (row.children && row.children.length > 0) {
          this.removeFun(row.children)
        }
      }
    },
    removeFun(list) {
      list.forEach(item => {
        const len = this.selects.indexOf(item.id)
        if (len > -1) {
          this.selects.splice(len, 1)
          this.$store.dispatch('setAuths', this.selects)
          if (item.children && item.children.length > 1) {
            this.removeFun(item.children)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.selectPart {
  width: 100%;
  position: relative;
  .selectPartItem {
    position: relative;
    .selectPartChildren {
      // width: calc(100% - 200px);
      margin-left: 30px;
      margin-top: 10px;
    }
  }
}
</style>
