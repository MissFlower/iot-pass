<!--
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单的选择图标的组件
 -->
<template>
  <el-popover v-model="dialogVisible" title="选择图标" trigger="manual">
    <i class="el-icon-close fr" style="position: absolute;top: 10px;right: 10px;" @click="close"></i>
    <div class="w400 df ai_c fww mt20">
      <div
        v-for="(item, index) in icons"
        :key="index"
        class="tc mb20 w120"
        :class="selectIcon == item ? 'blue' : 'hand'"
        @click="handleSelect(item)"
      >
        <svg-icon :icon-class="item"></svg-icon>
        <div>{{ item }}</div>
      </div>
    </div>
    <el-input slot="reference" v-model="selectIcon" placeholder="请输入图标" class="w200" @focus="handleShowIcons"></el-input>
  </el-popover>
</template>

<script>
import objData from '@/data/icon'
export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      icons: objData.icons,
      selectIcon: ''
    }
  },
  watch: {
    icon() {
      if (this.icon) {
        this.selectIcon = this.icon
      }
    }
  },
  mounted() {
    if (this.icon) {
      this.selectIcon = this.icon
    }
  },
  methods: {
    handleSelect(icon) {
      this.$emit('select', icon)
    },
    handleShowIcons() {
      this.dialogVisible = true
      this.$emit('changeShowFlag', true)
    },
    close() {
      this.dialogVisible = false
      this.$emit('changeShowFlag', false)
    }
  }
}
</script>
