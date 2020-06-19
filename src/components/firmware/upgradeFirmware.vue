<template>
  <div>
    <el-dialog
      title="批量升级"
      :visible.sync="upgradeFmVisible"
      :before-close="closeDialog"
      width="25%"
    >
      <el-form :model="form" ref="ruleFormUpgrade">
        <el-form-item
          label="升级前版本号"
          label-width="120px"
          prop="srcVersion"
        >
          <el-input v-model="form.srcVersion" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="升级后版本号"
          label-width="120px"
          prop="destVersion"
        >
          <el-input v-model="form.destVersion" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="升级策略" label-width="120px" prop="ugType">
          <el-select v-model="form.ugType" placeholder="请选择升级策略">
            <el-option label="静态升级" value="1"></el-option>
            <el-option label="动态升级" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级范围" label-width="120px" prop="scope">
          <el-select v-model="form.scope" placeholder="请选择升级范围">
            <el-option label="全部" value="0"></el-option>
            <el-option label="定向" value="1"></el-option>
            <el-option label="区域" value="2"></el-option>
            <el-option label="灰度" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级时间" label-width="120px" prop="ugTimeType">
          <el-select v-model="form.ugTimeType" placeholder="请选择升级时间类型">
            <el-option label="立即升级" value="1"></el-option>
            <el-option label="定时" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="upgradeSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveUpgrade } from "@/api/fireware";
export default {
  props: {
    upgradeFmVisible: {
      type: Boolean
    },
    checkFmId: {
      type: String
    }
  },
  data() {
    return {
      form: {
        fmId: "",
        serialVersionUID: 1,
        srcVersion: "",
        destVersion: "",
        ugType: "1",
        scope: "1",
        ugTimeType: "1",
        timeOut: 1
      }
    };
  },
  methods: {
    upgradeSubmit() {
      this.form.fmId = this.checkFmId;
      saveUpgrade(this.form).then(res => {
        if (res.code === 200) {
          this.$emit("upgradeVisible", this.upgradeFmVisible);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    closeDialog() {
      this.$refs.ruleFormUpgrade.resetFields();
      this.$emit("upgradeVisible", this.upgradeFmVisible);
    }
  }
};
</script>
