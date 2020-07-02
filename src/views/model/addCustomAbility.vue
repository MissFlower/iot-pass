<!-- 
文件作者：mawenjuan
创建日期：2020.6.24
文件说明：添加自定义功能的弹框 --  主体
 -->

<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="400px" class="addCustomAbility" @close="close" v-loading="loading">
    <el-form ref="addCustomAbilityForm" :model="formData" :rules="rules">
      <el-form-item prop="abilityType">
        <span slot="label">
          功能类型
          <el-tooltip v-if="!editAbility">
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">属性一般是设备的运行状态，如当前温度等；服务是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理。</div>
          </el-tooltip>
        </span>
        <el-radio-group v-model="formData.abilityType" @change="changeAblityTypeFun" v-if="!editAbility">
          <el-radio-button label="1">属性</el-radio-button>
          <el-radio-button label="2">服务</el-radio-button>
          <el-radio-button label="3">事件</el-radio-button>
        </el-radio-group>
        <div v-else><el-tag type="primary">{{abilityTypeObj[formData.abilityType]}}</el-tag></div>
      </el-form-item>
      <el-form-item prop="name">
        <span slot="label">
          功能名称
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过30个字符。</div>
          </el-tooltip>
        </span>
        <el-input v-model="formData.modelData.name" placeholder="请输入您的功能名称"></el-input>
      </el-form-item>
      <el-form-item prop="identifier">
        <span slot="label">
          标识符
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">必填，支持大小写字母、数字和下划线、不超过50个字符。</div>
          </el-tooltip>
        </span>
        <el-input v-model="formData.modelData.identifier" placeholder="请输入您的标识符" :disabled="editAbility ? true : false"></el-input>
      </el-form-item>
      <!--不同类型对应不同模块-->
      <attribute-con ref="attDataSelectPart"  v-if="formData.abilityType == 1" :dataType="formData.modelData.dataType" :accessMode="formData.modelData.accessMode" @callBack="callBackForAttribute"></attribute-con>

      <service-con ref="servivePart" v-if="formData.abilityType == 2" @success="servivePartSuccess"></service-con>

      <event-con ref="eventPart" v-if="formData.abilityType == 3" @success="eventPartSuccess"></event-con>
      <el-form-item label="描述">
        <el-input v-model="formData.modelData.description" type="textarea" placeholder="请输入描述" :rows="4" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleSave">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import attributeCon from "./children/attributeCon";
import serviceCon from "./children/serviceCon";
import eventCon from "./children/eventCon";

import { addCustomAbility, updateCustomAbility } from '@/api/model'
import dataObj from '@/data/data'
export default {
  components: {attributeCon, serviceCon, eventCon},
  props: ['productKey', 'editAbility'],
  data () {
    const validateName = (rule, value, callback) => {
      if (this.formData.modelData.name === '') {
        callback(new Error('该名称不能为空'))
      } else {
        callback()
      }
    }
    const validateIdentifier = (rule, value, callback) => {
      if (this.formData.modelData.identifier === '') {
        callback(new Error('标识符不能为空'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: true,
      loading: false,
      formData: {
        productKey: '',
        abilityType: 0,
        modelData: {
          identifier: 'test',
          name: '测试',
          description: '',
          accessMode: '',
          dataType: {}
        }
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'change' },
        ],
        identifier: [
          { required: true, validator: validateIdentifier, trigger: 'change' },
        ]
      },
      title: '添加自定义功能',
      abilityTypeObj: dataObj.abilityTypeObj
    }
  },
  mounted () {
    if (this.editAbility) {
      this.title = '编辑功能'
      for (let key in this.formData) {
        if (key !== 'modelData') {
          this.formData[key] = this.editAbility[key]
        } else {
          const row = this.formData[key]
          for (let key_row in row) {
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
    changeAblityTypeFun (index) {
      this.$refs.addCustomAbilityForm.resetFields()
      this.formData.abilityType = index
    },
    handleSave () {
      this.$refs.addCustomAbilityForm.validate(valid => {
        if (valid) {
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
    callBackForAttribute (data) {
      if (data) {
        for (let key in data) {
          this.formData.modelData[key] = data[key]
        }
        const obj = {
          modelData: this.formData.modelData,
          abilityType: this.formData.abilityType * 1,
          productKey: this.formData.productKey
        }
        this.submitFun(obj)
      }
    },
    // 服务的成功回调
    servivePartSuccess (data) {
      if (data) {
        const obj = JSON.parse(JSON.stringify(data))
        obj.name = this.formData.modelData.name
        obj.identifier = this.formData.modelData.identifier
        obj.method = `thing.service.${obj.identifier}`
        this.formData.modelData = obj
        this.submitFun(this.formData)
      }
    },
    eventPartSuccess (data) {
      if (data) {
        const obj = JSON.parse(JSON.stringify(data))
        obj.name = this.formData.modelData.name
        obj.identifier = this.formData.modelData.identifier
        obj.method = `thing.event.${obj.identifier}.post`
        this.formData.modelData = obj
        this.submitFun(this.formData)
      }
    },
    // 提交函数
    submitFun (obj) {
      this.loading = true
      let promise = addCustomAbility
      let str = '添加'
      if (this.editAbility) {
        promise = updateCustomAbility
        str = '编辑'
        obj.modelType = this.editAbility.type * 1
        obj.modelData.index = 0
      }
      obj.modelData = JSON.stringify(obj.modelData)
      promise(obj).then(res => {
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
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.addCustomAbility {
  .el-dialog__body {
    padding: 10px 20px 0;
  }
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    float: none;
  }
}
</style>