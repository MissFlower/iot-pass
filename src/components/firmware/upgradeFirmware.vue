<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：批量升级
 -->
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
          label-width="150px"
          prop="srcVersion"
          required
        >
          <el-input v-model="form.srcVersion" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="升级后版本号"
          label-width="150px"
          prop="destVersion"
          required
        >
          <el-input v-model="form.destVersion" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="升级策略"
          label-width="150px"
          prop="ugType"
          required
        >
          <el-select v-model="form.ugType" placeholder="请选择升级策略">
            <el-option label="静态升级" value="1"></el-option>
            <el-option label="动态升级" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="升级范围"
          label-width="150px"
          prop="scope"
          required
        >
          <el-select v-model="form.scope" placeholder="请选择升级范围">
            <el-option label="全部" value="0"></el-option>
            <el-option label="定向" value="1"></el-option>
            <el-option label="区域" value="2"></el-option>
            <el-option label="灰度" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="升级时间"
          label-width="150px"
          prop="ugTimeType"
          required
        >
          <el-select v-model="form.ugTimeType" placeholder="请选择升级时间类型">
            <el-option label="立即升级" value="1"></el-option>
            <el-option label="定时" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="固件推送速率"
          label-width="150px"
          prop="ugDeviceCount"
          required
        >
          <el-input
            v-model="form.ugDeviceCount"
            auto-complete="off"
            placeholder="请输入每分钟推送的设备数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="升级失败重试间隔"
          label-width="150px"
          prop="retryInterval"
          required
        >
          <el-select v-model="form.retryInterval">
            <el-option label="不重试" value="1"></el-option>
            <el-option label="立即重试" value="2"></el-option>
            <el-option label="10分钟后重试" value="3"></el-option>
            <el-option label="30分钟后重试" value="4"></el-option>
            <el-option label="1小时后重试" value="5"></el-option>
            <el-option label="24小时后重试" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备升级超时时间（分钟）"
          label-width="150px"
          prop="timeOut"
        >
          <el-input
            v-model="form.timeOut"
            auto-complete="off"
            placeholder="请输入升级超时时间（分钟）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="upgradeSubmit('ruleFormUpgrade')"
          >确 定</el-button
        >
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
        timeOut: "",
        retryInterval: "1",
        ugDeviceCount: ""
      }
    };
  },
  methods: {
    // 固件批量升级
    upgradeSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.fmId = this.checkFmId;
          saveUpgrade(this.form).then(res => {
            if (res.code === 200) {
              this.$emit("upgradeVisible", this.upgradeFmVisible);
            } else {
              this.$message.warning(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
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
