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
      width="35%"
    >
      <el-form :model="form" ref="ruleFormUpgrade" :rules="rules" label-width="150px">
        <el-form-item
          label="升级前版本号"
          label-width="150px"
          prop="srcVersion"
        >
          <el-select v-model="srcVersion" multiple>
            <el-option v-for="version in srcVersionList" :key="version" :label="version" :value="version"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="升级后版本号"
          prop="destVersion"
          required
        >
          <el-input v-model="form.destVersion" auto-complete="off" :disabled="checkInfo.destVersion != ''"></el-input>
        </el-form-item>
        <el-form-item
          label="升级策略"
          prop="ugStrategy"
          required
        >
          <el-select v-model="form.ugStrategy" placeholder="请选择升级策略">
            <el-option label="静态升级" value="0"></el-option>
            <el-option label="动态升级" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="升级范围"
          prop="scopeType"
          required
        >
          <el-select v-model="form.scopeType" placeholder="请选择升级范围">
            <el-option label="全部设备" value="0"></el-option>
            <el-option label="定向升级" value="1"></el-option>
            <!-- <el-option label="区域升级" value="2"></el-option> -->
            <!-- <el-option label="灰度升级" value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="设备范围" v-if="form.scopeType == 1" prop="selectDevicenames">
          <el-select v-model="selectDevicenames" multiple placeholder="请选择" @focus="handleFocus"></el-select>

        </el-form-item>
        <el-form-item
          label="升级时间"
          prop="ugTimeType"
          required
        >
          <el-select v-model="form.ugTimeType" placeholder="请选择升级时间类型">
            <el-option label="立即升级" value="0"></el-option>
            <el-option label="定时" value="1"></el-option>
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
        <el-form-item
          label="设备升级超时时间（分钟）"
          label-width="150px"
          prop="timeOut"
        >
          <el-input
            v-model.number="form.timeOut"
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
    <select-device v-if="selectDeviceFlag" :productId="checkInfo.productId" :moduleType="checkInfo.moduleType" :fmId="checkInfo.id" :destVersion="checkInfo.destVersion" @success="successDeviceDrawer" @close="closeDeviceDrawer"></select-device>
  </div>
</template>
<script>
import { saveUpgrade, getSrcVersionList } from "@/api/fireware";
import selectDevice from "./selectDevice"

export default {
  components: { selectDevice },
  props: {
    upgradeFmVisible: {
      type: Boolean
    },
    checkInfo: {
      type: Object
    }
  },
  data() {
    const validateSelectNames = (rules, value, callback) => {
      if (this.selectDeviceIds.length === 0) {
        callback(new Error('请选择设备范围'))
      } else {
        callback()
      }
    }
    const validSrcVersion = (rule, value, callback) => {
      if (this.srcVersion.length === 0) {
        callback(new Error('请选择待升级版本'))
      } else {
        if (this.form.destVersion !== '') {
          this.$refs.ruleFormUpgrade.validateField('destVersion');
          callback()
        }  else {
          callback()
        }
      }
    }
    const validDrcVersion = (rule, value, callback) => {
      if (value !== '' && this.srcVersion.indexOf(value) > -1) {
          callback(new Error('升级前后版本号不能相同'))
        } else {
          callback()
        }
    }
    return {
      form: {
        fmId: "",
        serialVersionUID: 1,
        srcVersion: "",
        destVersion: "",
        ugStrategy: "0",
        scopeType: "0",
        ugTimeType: "0",
        timeOut: "",
        retryInterval: "0",
        rate: "",
        deviceIds: ''
      },
      rules: {
        rate: [
            { required: true, message: '请输入固件推送速率', trigger: 'blur' },
            { type: 'number', min: 1, message: '推送速率必须为大于0的数字值' }
          ],
          srcVersion: [
              { required: true, message: '请输入待升级版本号', trigger: 'blur' },
              { validator: validSrcVersion, trigger: 'change'}
          ],
          destVersion: [
              { required: true, message: '请输入升级后版本号', trigger: 'blur' },
              {validator: validDrcVersion, trigger: 'change'}
          ],
          timeOut: [
            { required: true, message: '请输入设备升级超时时间', trigger: 'blur' },
            { type: 'number', message: '设备升级超时时间必须为数字值' }
          ],
          selectDevicenames: [
            { required: true, validator: validateSelectNames, trigger: 'blur' }
          ]
      },
      selectDevicenames: [],
      selectDeviceIds: [],
      selectDeviceFlag: false,
      srcVersionList: [], // 待升级版本列表
      srcVersion: []
    };
  },
  mounted () {
    if (this.checkInfo) {
      this.getVersionList()
      this.form.destVersion = this.checkInfo.destVersion
    }
  },
  methods: {
    // 固件批量升级
    upgradeSubmit(formName) {
      this.form.srcVersion = this.srcVersion.join(',')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.fmId = this.checkInfo.id;
          this.form.deviceIds = this.selectDeviceIds
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
    },
    handleFocus () {
      this.selectDeviceFlag = true
    },
    closeDeviceDrawer () {
      this.selectDeviceFlag = false
    },
    successDeviceDrawer (list) {
      this.selectDevicenames = []
      this.selectDeviceIds = []
      if (list && list.length > 0) {
        list.forEach(item => {
          this.selectDevicenames.push(item.deviceName)
          this.selectDeviceIds.push(item.deviceId * 1)
        })
      }
    },
    getVersionList () {
      this.loading = true
      getSrcVersionList({
        productId: this.checkInfo.productId,
        moduleType: this.checkInfo.moduleType
      }).then(res => {
        if (res.code === 200) {
          this.srcVersionList = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
};
</script>
