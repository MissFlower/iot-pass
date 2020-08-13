<!--
 * @Description: 动态省略文本组件
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-12 14:19:38
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-13 10:59:00
-->
<template>
  <div>
    <ElTooltip :disabled="!showTooltip" v-bind="$attrs" :content="content" :placement="placement" popper-class="custom-tooltip-style">
      <div ref="content" :style="{width: width, ...styles}" class="ellipsis-item" @mouseover="showTooltipHandler">
        <slot name="content" />
      </div>
    </ElTooltip>
  </div>
</template>
<script>
import { debounce } from '@/utils'
export default {
  name: 'DynamicToolTip',
  props: {
    content: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      default: 'top'
    },
    width: {
      type: String,
      default: 'inherit'
    },
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showTooltip: false,
      resizeHandler: null
    }
  },
  mounted() {
    this.resizeHandler = debounce(() => {
      this.showTooltipHandler()
    }, 100)
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
    this.resizeHandler = null
  },
  methods: {
    showTooltipHandler() {
      // console.log(this.$refs.content.offsetWidth, this.$refs.content.getBoundingClientRect().width, this.$refs.content.scrollWidth)
      this.showTooltip = Math.ceil(this.$refs.content.getBoundingClientRect().width) < this.$refs.content.scrollWidth
    }
  }
}
</script>
<style lang="scss" scoped>
.ellipsis-item {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style lang="scss">
.custom-tooltip-style {
  max-width: 240px;
  &.is-light {
    border: 1px solid #999;
  }
}
</style>
