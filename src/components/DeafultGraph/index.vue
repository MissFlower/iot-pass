<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-07 10:55:12
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-13 11:00:29
-->
<template>
  <div class="default-graph-container" :style="{width: width + 'px', height: height + 'px'}">
    <SvgIcon :icon-class="iconClass" class="svg-icon" width="calc(100% - 28px)" height="calc(100% - 28px)" />
    <span class="default-graph-text">{{ text }}</span>
  </div>
</template>

<script>
import SvgIcon from 'src/components/SvgIcon'
export default {
  name: 'DeafultGraph',
  components: {
    SvgIcon
  },
  props: {
    width: {
      type: [String, Number],
      default: 100
    },
    height: {
      type: [String, Number],
      default: 100
    },
    iconClass: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.default-graph-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .svg-icon {
    display: inline-block;
  }

  .default-graph-text {
    line-height: 24px;
    font-size: 14px;
    color: #333;
  }
}
</style>
