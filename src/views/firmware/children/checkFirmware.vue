<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：验证固件
 -->
<template>
  <div>
    <el-dialog
      title="验证固件"
      :visible.sync="checkFmVisible"
      width="420px"
      :before-close="closeDialog"
    >
      <el-form :model="form" ref="ruleForm" label-width="150px" :rules="rules" v-loading="loading">
        <el-form-item label="待升级版本号" prop="srcVersions">
          <el-select v-model="version" multiple class="w200" @change="versionChangeFun">
            <el-option v-for="ver in srcVersionList" :key="ver" :label="ver" :value="ver"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="待验证设备" prop="showDeviceNames">
          <el-select
            class="w200"
            v-model="form.showDeviceNames"
            multiple
            placeholder="请选择设备"
            @focus.stop="selectDevice"
          >
            <option value></option>
          </el-select>
        </el-form-item>
        <el-form-item label="固件验证超时时间（分钟）" label-width="150px" prop="timeOut">
          <el-input
            v-model.number="form.timeOut"
            auto-complete="off"
            class="w200"
            placeholder="请输入验证超时时间（分钟）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="verifySubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="验证固件" :visible.sync="progressVisible" width="20%" :show-close="showClose">
      <p>{{ checkStatus === "1" ? "固件验证中" : "固件验证失败" }}</p>
      <p v-if="checkStatus === '2'">提示：{{ checkMessage }}</p>
      <el-progress :percentage="checkPer" v-if="checkStatus !== '2'"></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <ChooseDevice
      v-if="chooseDeviceVisible"
      :fmDeviceList="deviceList"
      @deviceVisible="deviceVisible"
      @multipleDevice="multipleDevice"
    ></ChooseDevice>
  </div>
</template>
<script>
import ChooseDevice from './chooseDevice'
import { addVerify, getSrcVersionList, getVerifyFirmInfo } from '@/api/fireware'
export default {
  components: {
    ChooseDevice
  },
  props: {
    checkFmVisible: {
      type: Boolean,
      default: false
    },
    checkFmId: {
      type: String,
      default: ''
    },
    srcVersion: {
      type: String,
      default: ''
    },
    fmDeviceList: {
      type: Array,
      default: () => []
    },
    checkInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateSelectDevice = (rule, value, callback) => {
      if (!this.form.deviceIds || this.form.deviceIds.length === 0) {
        callback(new Error('请选择待验证设备'))
      } else {
        callback()
      }
    }
    const validSrcVersion = (rule, value, callback) => {
      if (this.version.length === 0) {
        callback(new Error('请选择待升级版本'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        fmId: '',
        srcVersions: '',
        deviceIds: [],
        showDeviceNames: [],
        timeOut: ''
      },
      chooseDeviceVisible: false,
      progressVisible: false,
      showClose: false,
      checkPer: 0,
      checkStatus: '1',
      checkMessage: '',
      rules: {
        srcVersions: [
          { required: true, message: '请输入待升级版本号', trigger: 'change' },
          { validator: validSrcVersion, trigger: 'change' }
        ],
        showDeviceNames: [
          { required: true, validator: validateSelectDevice, trigger: 'blur' }
        ],
        timeOut: [
          // { required: true, message: '请输入设备升级超时时间', trigger: 'blur' },
          { type: 'number', message: '设备升级超时时间必须为数字值' }
        ]
      },
      version: [],
      srcVersionList: [],
      deviceList: []
    }
  },
  mounted() {
    if (this.checkInfo) {
      this.getVersionList()
      this.form.showDeviceNames = []
      this.form.srcVersions = this.checkInfo.srcVersion
      this.form.fmId = this.checkInfo.id + ''
      this.deviceList = this.fmDeviceList
      if (this.checkInfo.srcVersion) {
        this.version = this.checkInfo.srcVersion.split(',')
      }
    }
  },
  methods: {
    // 提交验证固件
    verifySubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.srcVersions = this.version.join(',')
          const data = {
            'fmId': this.form.fmId,
            'srcVersions': this.form.srcVersions,
            'deviceNames': this.form.showDeviceNames,
            timeOut: this.form.timeOut
          }
          addVerify(data).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功')
            } else {
              this.$message.error(res.message)
            }
            this.progressVisible = true
            this.$emit('checkVisible', this.checkFmVisible)
            this.checkProgress(res)
          })
        }
      })
    },
    // 进度条
    checkProgress(res) {
      const self = this
      const timer = setInterval(function() {
        if (self.checkPer === 99) {
          clearInterval(timer)
        } else {
          self.checkPer += 1
        }
      }, 100)
      if (res.code === 200) {
        clearInterval(timer)
        this.checkPer = 100
        this.checkStatus = '1'
        this.$emit('refreshList', true)
      } else {
        clearInterval(timer)
        this.checkStatus = '2'
        this.checkMessage = res.message
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.form = {
        fmId: '',
        srcVersions: '',
        deviceIds: [],
        showDeviceNames: []
      }
      this.$refs['ruleForm'].resetFields() // 清空弹出框校验
      this.$emit('checkVisible', this.checkFmVisible)
    },
    // 获取选中的设备
    multipleDevice(checkedDeviceList) {
      this.form.showDeviceNames = []
      this.form.deviceIds = []
      checkedDeviceList.forEach(item => {
        this.form.showDeviceNames.push(item.deviceName)
        this.form.deviceIds.push(item.deviceId)
      })
    },
    selectDevice() {
      this.chooseDeviceVisible = true
    },
    deviceVisible() {
      this.chooseDeviceVisible = false
    },
    // 获取版本信息
    getVersionList() {
      this.loading = true
      getSrcVersionList({
        productKey: this.checkInfo.productKey,
        moduleType: this.checkInfo.moduleType,
        destVersion: this.checkInfo.destVersion
      }).then(res => {
        if (res.code === 200) {
          this.srcVersionList = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    versionChangeFun() {
      const data = {
        pageNum: 1,
        pageSize: 10,
        fmId: this.checkInfo.id,
        srcVersions: this.srcVersion
      }
      getVerifyFirmInfo(data).then(res => {
        if (res.code === 200) {
          this.deviceList = res.data.data
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
