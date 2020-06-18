<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.17
  文件说明：菜单的选择图标的组件
 -->
<template>
  <el-dialog :visible.sync="dialogVisible" title="选择图标">
    <div class="df ai_c fww">
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import objData from "@/data/icon";
export default {
  props: ["icon"],
  data() {
    return {
      dialogVisible: true,
      icons: objData.icons,
      selectIcon: ""
    };
  },
  mounted() {
    if (this.icon) {
      this.selectIcon = this.icon;
    }
  },
  methods: {
    handleSelect(icon) {
      this.selectIcon = icon;
    },
    submit() {
      this.$emit("select", this.selectIcon);
      this.handleCancel();
    },
    handleCancel() {
      this.$emit("close");
    }
  }
};
</script>
