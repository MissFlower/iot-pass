<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：固件编辑
 -->
<template>
  <div>
    <el-dialog
      title="编辑固件"
      :visible.sync="EditDialogVisible"
      width="25%"
      :before-close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="固件名称" required>
          <el-input type="text" v-model="ruleForm.fmName"></el-input>
        </el-form-item>
        <el-form-item label="待升级版本号" required>
          <el-input
            type="text"
            v-model="detailInfo.srcVersion"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="升级后版本号" required>
          <el-input
            type="text"
            :value="detailInfo.destVersion"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属产品" required>
          <el-input
            type="text"
            :value="detailInfo.productName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="签名算法" required>
          <el-input
            type="text"
            :value="detailInfo.signMethod === 1 ? 'Md5' : 'SHA256'"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="固件描述" prop="fmDesc">
          <el-input type="textarea" v-model="ruleForm.fmDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFmSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { updateFm } from "@/api/fireware";
export default {
  props: {
    EditDialogVisible: {
      type: Boolean
    },
    detailInfo: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        fmName: "", // 固件名称
        id: "",
        fmDesc: ""
      }
    };
  },
  methods: {
    // 编辑固件信息
    addFmSubmit() {
      this.ruleForm.id = this.detailInfo.id;
      if (!this.ruleForm.fmDesc) {
        this.ruleForm.fmDesc = this.detailInfo.fmDesc;
      }
      // let formData = new FormData();
      // formData.append("fmName", this.ruleForm.fmName);
      // formData.append("id", this.ruleForm.id);
      // formData.append("fmDesc", this.ruleForm.fmDesc);
      updateFm(this.ruleForm)
        .then(res => {
          if (res.code === 200) {
            this.$emit("changeVisible", this.EditDialogVisible);
            this.$emit("changeDetail", true);
            this.ruleForm.fmDesc = "";
            this.ruleForm.fmName = "";
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 关闭弹窗
    closeDialog() {
      this.ruleForm.fmDesc = "";
      this.ruleForm.fmName = "";
      this.$emit("changeVisible", this.EditDialogVisible);
    }
  }
};
</script>
