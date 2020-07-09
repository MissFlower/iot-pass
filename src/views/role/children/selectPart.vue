<template>
  <div class="selectPart mb20"  :class="type > 1 ? 'df fww' : ''">
    <div v-for="(item, index) in list" :key="index" class="selectPartItem" :class="type > 1 ? 'df' : ''">
      <div class="w200 mt10">
        <el-checkbox :label="item.id" @change="handeleChangeNode(item)" :disabled="disabledFlag_">{{item.name}}</el-checkbox>
      </div>
      <div class="df selectPartChildren" v-if="item.children" > 
        <select-part :list="item.children" :type="type + 1" :selects="selects" :disabledFlag="!item.checked"></select-part>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectPart",
  // props: ['list', 'type', 'selects', 'disabledFlag'],
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
    },
    disabledFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    disabledFlag () {
      this.disabledFlag_ = this.disabledFlag
    }
  },
  data () {
    return {
      disabledFlag_: false
    }
  },
  mounted () {
    this.disabledFlag_ = this.disabledFlag
  },
  methods: {
    handeleChangeNode (row) {
      if (this.selects.indexOf(row.id) > -1) {
        row.checked = false
        if (row.children && row.children.length > 0) {
          this.removeFun(row.children)
        }
      } else {
        row.checked = true
      }
    },
    removeFun (list) {
      list.forEach(item => {
        console.log(item)
        const len = this.selects.indexOf(item.id)
        console.log(len)
        if (len > -1) {
          this.selects.splice(len, 1)
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