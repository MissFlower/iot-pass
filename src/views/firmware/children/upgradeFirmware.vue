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
      width="500px"
    >
      <el-form
        :model="form"
        ref="ruleFormUpgrade"
        :rules="rules"
        label-width="150px"
        v-loading="loading"
      >
        <el-form-item label="升级前版本号" label-width="150px" prop="srcVersion">
          <el-select v-model="srcVersion" multiple class="w240" @change="scopeTypeChange">
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
            class="w240"
          ></el-input>
        </el-form-item>
        <el-form-item label="升级策略" prop="ugStrategy" required>
          <el-select v-model="form.ugStrategy" placeholder="请选择升级策略" class="w240" @change="ugStrategyChange">
            <el-option label="静态升级" value="0"></el-option>
            <el-option label="动态升级" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级范围" prop="scopeType" required>
          <el-select
            v-model="form.scopeType"
            placeholder="请选择升级范围"
            class="w240"
            @change="scopeTypeChange"
          >
            <el-option label="全部设备" value="0"></el-option>
            <el-option label="定向升级" value="1" v-if="form.ugStrategy != 1"></el-option>
            <!-- <el-option label="区域升级" value="2"></el-option> -->
            <!-- <el-option label="灰度升级" value="3"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.scopeType === '1'" label="设备选择方式" required>
          <el-radio-group v-model="form.selectType">
            <el-radio :label="1">手动选择</el-radio>
            <el-radio :label="2">文件上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备范围" v-if="form.scopeType == 1" prop="selectDevicenames">
          <el-select
            v-model="selectDevicenames"
            v-if="form.selectType == 1"
            multiple
            :collapse-tags="selectDevicenames.length > 5"
            placeholder="请选择"
            @focus="handleFocus"
            @change="handleChange"
            class="w240"
          ></el-select>
          <div v-else>
            <label for="upload-file" class="el-button--mini el-button--primary">{{ file ? '重新上传' : '上传文件' }}</label>
            <input id="upload-file" type="file" title="" hidden="hidden" accept=".xls, .xlsx" @change="changeUpload()" />
            <span class="ml20">{{ file ? file.name : '' }}</span>
            <el-progress v-if="file" class="w240 mt5 " :percentage="progress" :color="customColorMethod" :status="pFlag == 0 ? 'exception' : 'success'" :stroke-width="3"></el-progress>
            <span v-if="file" class="f12 red" :class="pFlag == 0 ? 'red' : 'success'">{{ pFlag == 0 ? '上传的文件数据有问题' : '上传成功' }}</span>
          </div>
        </el-form-item>
        <el-form-item label="升级时间" prop="ugTimeType" required>
          <el-select v-model="form.ugTimeType" placeholder="请选择升级时间类型" class="w240">
            <el-option label="立即升级" value="0"></el-option>
            <el-option label="定时升级" value="1" v-if="form.ugStrategy != 1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.ugTimeType ==1">
          <el-form-item prop="ugStartTime">
            <span slot="label">
              升级开始时间
              <el-tooltip effect="light">
                <i class="el-icon-question c9"></i>
                <div slot="content" class="f12 c6 w240">选择的开始时间距当前时间最少 10 分钟，最多 7 天</div>
              </el-tooltip>
            </span>
            <el-date-picker
              v-model="form.ugStartTime"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
              class="w240"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="ugEndTime">
            <span slot="label">
              升级结束时间
              <el-tooltip effect="light">
                <i class="el-icon-question c9"></i>
                <div slot="content" class="f12 c6 w240">不填写默认不会强制结束，选择的结束时间距开始时间最少 1 小时，最多为 30 天</div>
              </el-tooltip>
            </span>
            <el-date-picker
              v-model="form.ugEndTime"
              type="datetime"
              :picker-options="pickerOptions1"
              placeholder="选择日期时间"
              class="w240"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="固件推送速率" label-width="150px" prop="rate" required>
          <el-input
            class="w240"
            v-model.number="form.rate"
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
          <el-select v-model="form.retryInterval" class="w240">
            <el-option label="不重试" value="-1"></el-option>
            <el-option label="立即重试" value="0"></el-option>
            <el-option label="10分钟后重试" value="10"></el-option>
            <el-option label="30分钟后重试" value="30"></el-option>
            <el-option label="1小时后重试" value="60"></el-option>
            <el-option label="24小时后重试" value="1440"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级重试上限次数" v-if="form.retryInterval != -1" required>
          <el-select v-model="form.maxRetryCnt" class="w240">
            <el-option label="1次" value="1"></el-option>
            <el-option label="2次" value="2"></el-option>
            <el-option label="5次" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备升级超时时间（分钟）" label-width="150px" prop="timeOut">
          <el-input
            class="w240"
            v-model.number="form.timeOut"
            auto-complete="off"
            placeholder="请输入升级超时时间（分钟）"
          ></el-input>
        </el-form-item>
        <div class="df ai_c">
          <div class="flex1 tl f12">
            本次批量升级共
            <span class="blue">{{ deviceCount }}</span> 个设备
          </div>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="upgradeSubmit('ruleFormUpgrade')">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <select-device
      v-if="selectDeviceFlag"
      :selectDeviceList="selectDeviceList"
      :checkInfo="checkInfo"
      :srcVersion="srcVersion"
      @success="successDeviceDrawer"
      @close="closeDeviceDrawer"
    ></select-device>
  </div>
</template>
<script>
import { saveUpgrade, getSrcVersionList, getDeviceCount, uploadDeviceFile } from '@/api/fireware'
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
      if (this.form.scopeType === 1) {
        if (this.selectDeviceIds.length === 0) {
          callback(new Error('请选择设备范围'))
        } else {
          callback()
        }
      } else {
        if (!this.file) {
          callback(new Error('请选择上传文件'))
        } else if (this.pFlag === 0) {
          callback(new Error(''))
        } else {
          callback()
        }
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
        maxRetryCnt: '5',
        rate: '',
        deviceNames: '',
        ugStartTime: '',
        ugEndTime: '',
        selectType: 1
      },
      rules: {
        rate: [
          { required: true, message: '请输入固件推送速率', trigger: 'blur' },
          { type: 'number', min: 1, max: 1000, message: '推送速率必须为大于0小于1000的数字值' }
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
      deviceCount: 0,
      // 文件上传
      file: null,
      progress: 0,
      pFlag: 0,
      tokenId: ''
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
          this.loading = true
          this.form.fmId = this.checkInfo.id
          this.form.deviceNames = this.selectDevicenames
          const obj = JSON.parse(JSON.stringify(this.form))
          obj.ugStartTime = this.$fun.dateFormat(this.form.ugStartTime, 'yyyy-MM-dd hh:mm:ss')
          obj.ugEndTime = this.$fun.dateFormat(this.form.ugEndTime, 'yyyy-MM-dd hh:mm:ss')
          if (obj.retryInterval === '-1') {
            obj.maxRetryCnt = ''
          }
          if (this.form.selectType === 2) {
            obj.tokenId = this.tokenId
          }
          saveUpgrade(obj).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
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
    handleChange() {
      this.deviceCount = this.selectDevicenames.length
    },
    closeDeviceDrawer() {
      this.selectDeviceFlag = false
    },
    successDeviceDrawer(list) {
      const version = new Set()
      this.scopeTypeChange()
      this.selectDevicenames = []
      this.selectDeviceIds = []
      this.selectDeviceList = list
      if (list && list.length > 0) {
        list.forEach(item => {
          this.selectDevicenames.push(item.deviceName)
          this.selectDeviceIds.push(item.deviceId)
          version.add(item.version)
        })
      }
      this.srcVersion = [...version]
      this.deviceCount = list.length
    },
    getVersionList() {
      this.loading = true
      getSrcVersionList({
        productKey: this.checkInfo.productKey,
        moduleType: this.checkInfo.moduleType,
        destVersion: this.checkInfo.destVersion,
        productType: this.checkInfo.productType
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
      this.selectDeviceList = []
      if (this.form.scopeType !== '' && this.form.scopeType * 1 === 0 && this.srcVersion.length > 0) {
        getDeviceCount({
          productKey: this.checkInfo.productKey,
          productType: this.checkInfo.productType,
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
    },
    // 升级策略变化的函数
    ugStrategyChange() {
      if (this.form.ugStrategy * 1 === 1) {
        if (this.form.scopeType * 1 === 1) {
          this.form.scopeType = '0'
        }
        if (this.form.ugTimeType * 1 === 1) {
          this.form.ugTimeType = '0'
        }
      }
    },
    // 文件上传
    changeUpload() {
      this.file = document.getElementById('upload-file').files[0]
      if (this.file) {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('fmId', this.checkInfo.id)
        this.loading = true
        const onUploadProgress = progressEvent => {
          const comp = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.progress = comp // 赋值，进度条变化
        }
        uploadDeviceFile(formData, onUploadProgress).then(res => {
          if (res.code === 200) {
            this.pFlag = 1
            this.tokenId = res.data.tokenId
            this.srcVersion = res.data.srcVersions
          } else {
            this.pFlag = 0
            this.$message.error(res.message)
          }
          this.loading = false
        })
      }
    },
    // 进度条颜色函数
    customColorMethod(percentage) {
      if (percentage < 100) {
        return '#1890FF'
      } else {
        if (this.pFlag === 1) {
          return '#67c23a'
        } else {
          return '#FF5500'
        }
      }
    }
  }
}
</script>

<style scoped>
.filepath {
  /* opacity: 0; */
  /* // border: 1px solid red; */
  /* color: transparent; */
  width: 100px;
  display: inline-block;
}
</style>
