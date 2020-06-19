<!-- 
文件作者：wengyoubin
创建日期：2020.6.18
文件说明：编辑设备名称
 -->
<template>
  <el-dialog
    title="编辑设备名称"
    :visible.sync='dialogVisible'
    width="500px"
    @close="handleClose"
    v-loading="loading"
  >
    <div class="df ai_c mb20">
      <div class="w100 tr">设备名称：</div>
      <el-input class="w300" v-model="newDeviceName" placeholder="请输入设备名称"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deviceUpdate } from "@/api/equRequest";
export default {
  props: ["deviceObj"],
  data() {
    return {
      dialogVisible: true,
      newDeviceName: '',
      loading: false
    };
  },
  mounted() {
    this.newDeviceName = this.deviceObj.nickName;
  },

  methods: {

    //取消
    handleCancel() {
      this.$parent.deviceNameEditClose();
    },

    //保存
    handleSave() {

      if(this.newDeviceName.length == 0){
        this.$message({
          message: "内容错误"
        });
        return;
      }

      this.loading = true;

      deviceUpdate({
        id: this.deviceObj.id,
        nickName: this.newDeviceName,
      })
        .then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.$parent.deviceNameEditClose(true);
          }
          this.$message({
            message: res.message
          });
        })
        .catch(() => {
          this.loading = false;
        });
        
    },

    //窗口关闭
    handleClose() {
      this.handleCancel();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
