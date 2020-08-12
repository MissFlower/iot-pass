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
      width="420px"
    >
      <el-form
        :model="form"
        ref="ruleFormUpgrade"
        :rules="rules"
        label-width="150px"
        v-loading="loading"
      >
        <el-form-item label="升级前版本号" label-width="150px" prop="srcVersion">
          <el-select v-model="srcVersion" multiple class="w200" @change="scopeTypeChange">
            <el-option
              v-for="version in srcVersionList"
              :key="version"
              :label="version"
              :value="version"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级后版本号" prop="destVersion" required>
          <el-input
            v-model="form.destVersion"
            auto-complete="off"
            :disabled="checkInfo.destVersion != ''"
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item label="升级策略" prop="ugStrategy" required>
          <el-select v-model="form.ugStrategy" placeholder="请选择升级策略" class="w200">
            <el-option label="静态升级" value="0"></el-option>
            <el-option label="动态升级" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级范围" prop="scopeType" required>
          <el-select
            v-model="form.scopeType"
            placeholder="请选择升级范围"
            class="w200"
            @change="scopeTypeChange"
          >
            <el-option label="全部设备" value="0"></el-option>
            <el-option label="定向升级" value="1" v-if="form.ugStrategy != 1"></el-option>
            <!-- <el-option label="区域升级" value="2"></el-option> -->
            <!-- <el-option label="灰度升级" value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="设备范围" v-if="form.scopeType == 1" prop="selectDevicenames">
          <el-select
            v-model="selectDevicenames"
            multiple
            placeholder="请选择"
            @focus="handleFocus"
            class="w200"
          ></el-select>
        </el-form-item>
        <el-form-item label="升级时间" prop="ugTimeType" required>
          <el-select v-model="form.ugTimeType" placeholder="请选择升级时间类型" class="w200">
            <el-option label="立即升级" value="0"></el-option>
            <el-option label="定时升级" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.ugTimeType ==1">
          <el-form-item prop="ugStartTime">
            <span slot="label">
              升级开始时间
              <el-tooltip effect="light">
                <i class="el-icon-question c9"></i>
                <div slot="content" class="f12 c6 w200">选择的开始时间距当前时间最少 10 分钟，最多 7 天</div>
              </el-tooltip>
            </span>
            <el-date-picker
              v-model="form.ugStartTime"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
              class="w200"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="ugEndTime">
            <span slot="label">
              升级结束时间
              <el-tooltip effect="light">
                <i class="el-icon-question c9"></i>
                <div slot="content" class="f12 c6 w200">不填写默认不会强制结束，选择的结束时间距开始时间最少 1 小时，最多为 30 天</div>
              </el-tooltip>
            </span>
            <el-date-picker
              v-model="form.ugEndTime"
              type="datetime"
              :picker-options="pickerOptions1"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="固件推送速率" label-width="150px" prop="rate" required>
          <el-input
            class="w200"
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
        </el-form-item>-->
        <el-form-item label="设备升级超时时间（分钟）" label-width="150px" prop="timeOut">
          <el-input
            class="w200"
            v-model.number="form.timeOut"
            auto-complete="off"
            placeholder="请输入升级超时时间（分钟）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="df ai_c">
        <div class="flex1 tl f12">
          本次批量升级共
          <span class="blue">{{ deviceCount }}</span> 个设备
        </div>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" @click="upgradeSubmit('ruleFormUpgrade')">确 定</el-button>
      </div>
    </el-dialog>
    <select-device
      v-if="selectDeviceFlag"
      :productKey="checkInfo.productKey"
      :moduleType="checkInfo.moduleType"
      :fmId="checkInfo.id"
      :destVersion="checkInfo.destVersion"
      :srcVersion="srcVersion"
      @success="successDeviceDrawer"
      @close="closeDeviceDrawer"
    ></select-device>
  </div>
</template>
<script>
import { saveUpgrade, getSrcVersionList, getDeviceCount } from '@/api/fireware'
import selectDevice from './selectDevice'

export default {
  components: { selectDevice },
  props: {
    upgradeFmVisible: {
      type: Boolean
    },
    checkInfo: {
      type: Object,
      default: () => {}
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
          this.$refs.ruleFormUpgrade.validateField('destVersion')
          callback()
        } else {
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
    const validateUgStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择升级开始时间'))
      } else {
        const time = value - new Date()
        if (time < 1000 * 60 * 10 || time > 1000 * 60 * 60 * 24 * 7) {
          callback(new Error('选择的开始时间距当前时间最少 10 分钟，最多 7 天'))
        } else {
          this.$refs.ruleFormUpgrade.validateField('validateUgEndTime')
          callback()
        }
      }
    }
    const validateUgEndTime = (rule, value, callback) => {
      if (!value) {
        // 不填写默认不会强制结束，选择的结束时间距开始时间最少 1 小时，最多为 30 天
        callback()
      } else {
        if (this.form.ugStartTime) {
          const time = value - this.form.ugStartTime
          if (time < 1000 * 60 * 60 || time > 1000 * 60 * 60 * 24 * 30) {
            callback(new Error('选择的结束时间距开始时间最少 1 小时，最多为 30 天'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      form: {
        fmId: '',
        serialVersionUID: 1,
        srcVersion: '',
        destVersion: '',
        ugStrategy: '0',
        scopeType: '',
        ugTimeType: '0',
        timeOut: '',
        retryInterval: '0',
        rate: '',
        deviceNames: '',
        ugStartTime: '',
        ugEndTime: ''
      },
      rules: {
        rate: [
          { required: true, message: '请输入固件推送速率', trigger: 'blur' },
          { type: 'number', min: 1, message: '推送速率必须为大于0的数字值' }
        ],
        srcVersion: [
          { required: true, message: '请输入待升级版本号', trigger: 'blur' },
          { validator: validSrcVersion, trigger: 'change' }
        ],
        destVersion: [
          { required: true, message: '请输入升级后版本号', trigger: 'blur' },
          { validator: validDrcVersion, trigger: 'change' }
        ],
        timeOut: [
          { required: true, message: '请输入设备升级超时时间', trigger: 'blur' },
          { type: 'number', message: '设备升级超时时间必须为数字值' }
        ],
        selectDevicenames: [
          { required: true, validator: validateSelectNames, trigger: 'blur' }
        ],
        ugStartTime: [
          { required: true, validator: validateUgStartTime, trigger: 'change' }
        ],
        ugEndTime: [
          { required: true, validator: validateUgEndTime, trigger: 'change' }
        ]
      },
      selectDevicenames: [],
      selectDeviceIds: [],
      selectDeviceList: [],
      selectDeviceFlag: false,
      srcVersionList: [], // 待升级版本列表
      srcVersion: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 7
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 90
        }
      },
      deviceCount: 0
    }
  },
  mounted() {
    if (this.checkInfo) {
      this.getVersionList()
      this.form.destVersion = this.checkInfo.destVersion
    }
  },
  methods: {
    // 固件批量升级
    upgradeSubmit(formName) {
      if (this.loading) {
        return
      }
      this.form.srcVersion = this.srcVersion.join(',')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.fmId = this.checkInfo.id
          this.form.deviceNames = this.selectDevicenames
          const obj = JSON.parse(JSON.stringify(this.form))
          obj.ugStartTime = this.$fun.dateFormat(this.form.ugStartTime, 'yyyy-MM-dd hh:mm:ss')
          obj.ugEndTime = this.$fun.dateFormat(this.form.ugEndTime, 'yyyy-MM-dd hh:mm:ss')
          this.loading = true
          saveUpgrade(obj).then(res => {
            if (res.code === 200) {
              this.$emit('upgradeVisible', this.upgradeFmVisible)
            } else {
              this.$message.warning(res.message)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$refs.ruleFormUpgrade.resetFields()
      this.$emit('upgradeVisible', this.upgradeFmVisible)
    },
    handleFocus() {
      this.selectDeviceFlag = true
    },
    closeDeviceDrawer() {
      this.selectDeviceFlag = false
    },
    successDeviceDrawer(list, version) {
      this.srcVersion = version
      this.scopeTypeChange()
      this.selectDevicenames = []
      this.selectDeviceIds = []
      this.selectDeviceList = list
      if (list && list.length > 0) {
        list.forEach(item => {
          this.selectDevicenames.push(item.deviceName)
          this.selectDeviceIds.push(item.deviceId)
        })
      }
      this.deviceCount = list.length
    },
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
    // 选择的设备数量统计
    scopeTypeChange() {
      if (this.form.scopeType !== '' && this.form.scopeType * 1 === 0 && this.srcVersion.length > 0) {
        getDeviceCount({
          productKey: this.checkInfo.productKey,
          srcVersions: this.srcVersion.join(','),
          moduleType: this.checkInfo.moduleType
        }).then(res => {
          if (res.code === 200) {
            this.deviceCount = res.data
          }
        })
      } else {
        this.deviceCount = 0
        this.selectDevicenames = []
      }
    }
  }
}
</script>
