<!--
文件作者：mawenjuan
创建日期：2020.6.24
文件说明：添加自定义功能的弹框 --  主体
 -->

<template>
  <el-drawer
    :visible.sync="dialogVisible"
    :title="title"
    size="45%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="addCustomAbility"
    @close="close"
  >
    <el-form ref="addCustomAbilityForm" :model="formData" :rules="rules" v-loading="loading" class="formDrawer">
      <el-form-item prop="abilityType">
        <span slot="label">
          功能类型
          <el-tooltip v-if="!editAbility">
            <i class="el-icon-question c9"></i>
            <div
              slot="content"
              class="f12 c9 w200"
            >属性一般是设备的运行状态，如当前温度等；服务是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理。</div>
          </el-tooltip>
        </span>
        <el-radio-group
          v-model="formData.abilityType"
          @change="changeAblityTypeFun"
          v-if="!editAbility"
        >
          <el-radio-button label="1">属性</el-radio-button>
          <el-radio-button label="2">服务</el-radio-button>
          <el-radio-button label="3">事件</el-radio-button>
        </el-radio-group>
        <div v-else class="disabledDiv">{{ abilityTypeObj[formData.abilityType] }}</div>
      </el-form-item>
      <el-form-item prop="name">
        <span slot="label">
          功能名称
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div
              slot="content"
              class="f12 c9 w200"
            >必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。</div>
          </el-tooltip>
        </span>
        <el-input v-model="formData.modelData.name" placeholder="请输入您的功能名称" :disabled="showFlag"></el-input>
      </el-form-item>
      <el-form-item prop="identifier">
        <span slot="label">
          标识符
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持大小写字母、数字和下划线、不超过50个字符。</div>
          </el-tooltip>
        </span>
        <el-input
          v-model="formData.modelData.identifier"
          placeholder="请输入您的标识符"
          :disabled="showFlag || (editAbility && editAbility.modelType == '1')"
        ></el-input>
      </el-form-item>
      <!--不同类型对应不同模块-->
      <attribute-con
        ref="attDataSelectPart"
        v-if="formData.abilityType == 1"
        :dataType="formData.modelData.dataType"
        :showFlag="showFlag"
        :modelType="editAbility && editAbility.modelType == '1'"
        :accessMode="formData.modelData.accessMode"
        @callBack="callBackForAttribute"
      ></attribute-con>

      <service-con
        ref="servivePart"
        v-if="formData.abilityType == 2"
        :info="editAbility"
        :showFlag="showFlag"
        :modelType="editAbility && editAbility.modelType == '1'"
        @success="servivePartSuccess"
      ></service-con>

      <event-con
        ref="eventPart"
        v-if="formData.abilityType == 3"
        :info="editAbility"
        :showFlag="showFlag"
        :modelType="editAbility && editAbility.modelType == '1'"
        @success="eventPartSuccess"
      ></event-con>
      <el-form-item label="描述">
        <el-input
          v-model="formData.modelData.desc"
          type="textarea"
          placeholder="请输入描述"
          :rows="4"
          maxlength="100"
          show-word-limit
          :disabled="showFlag"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="mb10 tr mr20">
      <el-button @click="close" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="handleSave" :disabled="showFlag || loading">确认</el-button>
    </div>
  </el-drawer>
</template>

<script>
import attributeCon from './children/attributeCon'
import serviceCon from './children/serviceCon'
import eventCon from './children/eventCon'

import { addCustomAbility, updateCustomAbility } from '@/api/model'
import { abilityTypeObj } from '@/data/constants'
export default {
  components: { attributeCon, serviceCon, eventCon },
  props: {
    productKey: {
      type: String,
      default: ''
    },
    editAbility: {
      type: Object,
      default: () => {}
    },
    showFlag: { // 是否为查看
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      const name = this.formData.modelData.name
      if (name === '') {
        callback(new Error('该名称不能为空'))
      } else {
        const reg = /^(?!\.)(?!_)(?!-)[0-9a-zA-Z\u4e00-\u9fa5_.\\-]+$/
        if (!reg.test(name) || name.length > 30) {
          callback(new Error('必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。'))
        } else {
          callback()
        }
      }
    }
    const validateIdentifier = (rule, value, callback) => {
      const identifier = this.formData.modelData.identifier
      if (identifier === '') {
        callback(new Error('标识符不能为空'))
      } else {
        const reg = /^[a-zA-Z0-9_]+$/
        if (identifier && (!reg.test(identifier) || identifier.length > 50)) {
          callback(new Error('必填，支持大小写字母、数字和下划线、不超过50个字符'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogVisible: true,
      loading: false,
      formData: {
        productKey: '',
        abilityType: 0,
        modelData: {
          identifier: '',
          name: '',
          desc: '',
          accessMode: '',
          dataType: {}
        }
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        identifier: [
          { required: true, validator: validateIdentifier, trigger: 'change' }
        ]
      },
      title: '添加自定义功能',
      abilityTypeObj
    }
  },
  mounted() {
    if (this.editAbility) {
      this.title = '编辑功能'
      if (this.showFlag) {
        this.title = '查看功能'
      }
      for (const key in this.formData) {
        if (key !== 'modelData') {
          this.formData[key] = this.editAbility[key]
        } else {
          const row = this.formData[key]
          for (const key_row in row) {
            if (this.editAbility[key_row]) {
              row[key_row] = this.editAbility[key_row]
            }
          }
        }
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
    } else {
      this.formData.abilityType = 1
      this.title = '添加自定义功能'
    }
    this.formData.productKey = this.productKey
  },
  methods: {
    // 切换功能type
    changeAblityTypeFun(index) {
      this.formData.modelData.identifier = ''
      this.formData.modelData.name = ''
      this.formData.abilityType = index
      this.$nextTick(() => {
        this.$refs.addCustomAbilityForm.clearValidate()
      })
    },
    handleSave() {
      this.$refs.addCustomAbilityForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.formData.abilityType * 1 === 1) {
            this.$refs.attDataSelectPart.getDataForParent()
          } else if (this.formData.abilityType * 1 === 2) {
            this.$refs.servivePart.getDataForParent()
          } else if (this.formData.abilityType * 1 === 3) {
            this.$refs.eventPart.getDataForParent()
          }
        }
      })
    },
    // 属性的成功回调
    callBackForAttribute(data) {
      if (data) {
        for (const key in data) {
          this.formData.modelData[key] = data[key]
        }
        const obj = {
          modelData: JSON.parse(JSON.stringify(this.formData.modelData)),
          abilityType: this.formData.abilityType * 1,
          productKey: this.formData.productKey
        }
        this.submitFun(obj)
      } else {
        this.loading = false
      }
    },
    // 服务的成功回调
    servivePartSuccess(data) {
      if (data) {
        const obj = JSON.parse(JSON.stringify(data))
        obj.name = this.formData.modelData.name
        obj.identifier = this.formData.modelData.identifier
        obj.method = `thing.service.${obj.identifier}`
        const submitObj = JSON.parse(JSON.stringify(this.formData))
        submitObj.modelData = obj
        this.submitFun(submitObj)
      } else {
        this.loading = false
      }
    },
    // 事件的成功回调
    eventPartSuccess(data) {
      if (data) {
        const obj = JSON.parse(JSON.stringify(data))
        obj.name = this.formData.modelData.name
        obj.identifier = this.formData.modelData.identifier
        obj.method = `thing.event.${obj.identifier}.post`
        const submitObj = JSON.parse(JSON.stringify(this.formData))
        submitObj.modelData = obj
        this.submitFun(submitObj)
      } else {
        this.loading = false
      }
    },
    // 提交函数
    submitFun(obj) {
      this.loading = true
      let promise = addCustomAbility
      let str = '添加'
      if (this.editAbility) {
        promise = updateCustomAbility
        str = '编辑'
        obj.modelType = this.editAbility.modelType * 1
        obj.modelData.index = 0
        obj.identifier = this.editAbility.identifier
      } else {
        obj.modelType = '2'
      }
      obj.modelData = JSON.stringify(obj.modelData)
      const submitObj = JSON.parse(JSON.stringify(obj))
      promise(submitObj).then(res => {
        if (res.code === 200) {
          this.$message.success(`功能${str}成功`)
          this.$emit('success')
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.error(`功能${str}失败`)
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.addCustomAbility {
  .el-drawer__body {
    overflow: auto;
    .formDrawer {
      padding: 10px 20px;
      widows: 100%;
    }
  }
  .el-form-item--small .el-form-item__content,
  .el-form-item--small .el-form-item__label {
    float: none;
  }
}
</style>
