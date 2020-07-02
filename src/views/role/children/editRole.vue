<!--
  文件作者：mawenjuan
  创建日期：2020.6.18
  文件说明：角色的编辑、创建
-->
<template>
  <el-dialog
    :title="`${editItem.menuId ? '编辑' : '新建'}角色`"
    :visible.sync="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="30%"
    @close="handleClose"
    v-loading="loading"
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
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from "@/api/role";
export default {
  props: ["info"],
  data() {
    return {
      dialogVisible: true,
      loading: false,
      editItem: {
        name: "", //	姓名
        description: ""
      }
    };
  },
  mounted() {
    this.editItem = {
      name: "", //	姓名
      description: ""
    };
    if (this.info) {
      for (const key in this.editItem) {
        this.editItem[key] = this.info[key];
      }
      this.editItem["roleId"] = this.info.roleId;
    }
  },
  methods: {
    // 提交函数
    handleSave() {
      let promise = null;
      let str = "";
      if (this.info) {
        promise = updateRole;
        str = "编辑";
      } else {
        promise = addRole;
        str = "创建";
      }
      this.loading = true;
      promise(this.editItem)
        .then(res => {
          if (res.code === 200) {
            this.$message.success(`角色${str}成功`);
            this.handleClose();
          } else {
            this.$message.error(`角色${str}失败`);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error(`角色${str}失败`);
          this.loading = false;
        });
    },
    // 取消函数
    handleClose() {
      // this.$parent.editFlag = false;
      this.$emit("close");
    }
  }
};
</script>
