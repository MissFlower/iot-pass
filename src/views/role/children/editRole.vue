<template>
  <el-dialog
    :title="`${editItem.id ? '编辑' : '新建'}用户`"
    :visible.sync="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <div class="df ai_c mb20">
      <div class="w100 tr">角色名称：</div>
      <el-input v-model="editItem.name" placeholder="请输入角色名称"></el-input>
    </div>
    <div class="df">
      <div class="w100 tr">角色描述：</div>
      <el-input
        type="textarea"
        :rows="3"
        v-model="editItem.description"
        placeholder="请输入角色描述"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      dialogVisible: true,
      editItem: {
        name: "", //	姓名
        description: ""
      }
    };
  },
  mounted() {
    if (this.info) {
      this.editItem = JSON.parse(JSON.stringify(this.info));
    } else {
      this.editItem = {
        name: "", //	姓名
        description: ""
      };
    }
  },
  methods: {
    handleCancel() {},
    handleSave() {},
    handleClose() {
      this.$parent.switchCon(0);
    }
  }
};
</script>

<style lang="scss" scoped>
#editRole {
}
</style>
