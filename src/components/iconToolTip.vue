<template>
  <span>
    <el-tooltip :placement="placement" :content="content" class="blue hand" @click.native="clickFun" v-if="content">
      <svg-icon v-if="icons.indexOf(icon) > -1" :icon-class="icon" class="hand"></svg-icon>
      <i v-else-if="icon.indexOf('el-icon-') > -1" :class="icon"></i>
      <span v-else>{{ icon }}</span>
    </el-tooltip>
    <span v-else @click="clickFun" class="blue">
      <svg-icon v-if="icons.indexOf(icon) > -1" :icon-class="icon" class="hand"></svg-icon>
      <i v-else-if="icon.indexOf('el-icon-') > -1" :class="icon"></i>
      <span v-else>{{ icon }}</span>
    </span>
    <!-- <div id="copy_content_wrp">
      <input type="text" id="copy_content" />
    </div> -->
  </span>
</template>

<script>
import objData from '@/data/icon'
export default {
  props: {
    placement: {
      type: String,
      default: 'top'
    },
    content: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      require: true,
      default: 'el-icon-setting'
    },
    copyStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icons: objData.icons,
      target: null
    }
  },
  methods: {
    clickFun() {
      if (this.copyStr) {
        this.copyFun()
        return
      }
      this.$emit('clickFun')
    },
    async copyFun() {
      if (!this.target) {
        this.target = document.createElement('input') // 创建input节点
      }
      this.target.value = this.copyStr // 给input的value赋值
      document.body.appendChild(this.target) // 向页面插入input节点
      this.target.select() // 选中input
      try {
        await document.execCommand('Copy') // 执行浏览器复制命令
        document.body.removeChild(this.target)
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      } catch {
        console.log('复制失败')
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.svg-icon {
  width: 20px!important;
  height: 18px!important;
}
i {
  font-size: 15px;
}
</style>
