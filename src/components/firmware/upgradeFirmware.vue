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
      <el-form :model="form" ref="ruleFormUpgrade" :rules="rules">
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
          <el-input v-model="form.destVersion" auto-complete="off" :disabled="checkDestVersion != ''"></el-input>
        </el-form-item>
        <el-form-item
          label="升级策略"
          label-width="150px"
          prop="ugStrategy"
          required
        >
          <el-select v-model="form.ugStrategy" placeholder="请选择升级策略">
            <el-option label="静态升级" value="0"></el-option>
            <!-- <el-option label="动态升级" value="1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item
          label="升级范围"
          label-width="150px"
          prop="scopeType"
          required
        >
          <el-select v-model="form.scopeType" placeholder="请选择升级范围">
            <el-option label="全部" value="0"></el-option>
            <!-- <el-option label="定向" value="1"></el-option> -->
            <!-- <el-option label="区域" value="2"></el-option> -->
            <!-- <el-option label="灰度" value="3"></el-option> -->
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
            <!-- <el-option label="定时" value="2"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item
          label="固件推送速率"
          label-width="150px"
          prop="rate"
          required
        >
          <el-input
            v-model.number="form.rate"
            auto-complete="off"
            placeholder="请输入每分钟推送的设备数"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="升级失败重试间隔"
          label-width="150px"
          prop="retryInterval"
          required
        >
          <el-select v-model="form.retryInterval">
            <el-option label="不重试" value="-1"></el-option>
            <el-option label="立即重试" value="0"></el-option>
            <el-option label="10分钟后重试" value="10"></el-option>
            <el-option label="30分钟后重试" value="30"></el-option>
            <el-option label="1小时后重试" value="60"></el-option>
            <el-option label="24小时后重试" value="1440"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item
          label="设备升级超时时间（分钟）"
          label-width="150px"
          prop="timeOut"
        >
          <el-input
            v-model.number="form.timeOut"
            auto-complete="off"
            placeholder="请输入升级超时时间（分钟）"
          ></el-input>
        </el-form-item> -->
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
    },
    checkDestVersion: {
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
        ugStrategy: "1",
        scopeType: "0",
        ugTimeType: "1",
        timeOut: "",
        retryInterval: "0",
        rate: ""
      },
      rules: {
        rate: [
            { required: true, message: '请输入固件推送速率', trigger: 'blur' },
            { type: 'number', min: 1, message: '推送速率必须为大于0的数字值' }
          ],
          srcVersion: [
              { required: true, message: '请输入待升级版本号', trigger: 'blur' }
          ],
          destVersion: [
              { required: true, message: '请输入升级后版本号', trigger: 'blur' }
          ],
          timeOut: [
            { required: true, message: '请输入设备升级超时时间', trigger: 'blur' },
            { type: 'number', message: '设备升级超时时间必须为数字值' }
          ],
      }
    };
  },
  mounted () {
    this.form.destVersion = this.checkDestVersion
  },
  methods: {
    // 固件批量升级
    upgradeSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.fmId = this.checkFmId;
          // let formData = new FormData()
          //   for (let item in this.form) {
          //       formData.append(item, this.form[item])
          //   }
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
