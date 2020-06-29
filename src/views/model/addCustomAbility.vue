<!-- 
文件作者：mawenjuan
创建日期：2020.6.24
文件说明：添加自定义功能的弹框 --  主体
 -->

<template>
  <el-dialog :visible.sync="dialogVisible" title="添加自定义功能" width="400px" class="addCustomAbility">
    <el-form ref="addCustomAbilityForm" :model="formData" :rules="rules">
      <el-form-item prop="abilityType">
        <span slot="label">
          功能类型
          <el-tooltip>
            <i class="el-icon-question c9"></i>
            <div slot="content" class="f12 c9 w200">属性一般是设备的运行状态，如当前温度等；服务是设备可被调用的方法，支持定义参数，如执行某项任务；事件则是设备上报的通知，如告警，需要被及时处理。</div>
          </el-tooltip>
        </span>
        <el-radio-group v-model="formData.abilityType" @change="changeAblityTypeFun">
          <el-radio-button label="1">属性</el-radio-button>
          <el-radio-button label="2">服务</el-radio-button>
          <el-radio-button label="3">事件</el-radio-button>
        </el-radio-group>
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
        <el-input v-model="formData.modelData.identifier" placeholder="请输入您的标识符"></el-input>
      </el-form-item>
      <!--不同类型对应不同模块-->
      <attribute-con ref="attDataSelectPart"  v-if="formData.abilityType == 1" :dataType="formData.dataType" @callBack="callBackForAttribute"></attribute-con>
      <service-con v-if="formData.abilityType == 2"></service-con>
      <event-con v-if="formData.abilityType == 3"></event-con>
      <el-form-item label="描述">
        <el-input v-model="formData.modelData.description" type="textarea" placeholder="请输入描述" :rows="4" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="handleSave">确认</el-button>
      <el-button>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import attributeCon from "./children/attributeCon";
import serviceCon from "./children/serviceCon";
import eventCon from "./children/eventCon";

import { addCustomAbility } from '@/api/model'

export default {
  components: {attributeCon, serviceCon, eventCon},
  props: ['productKey'],
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
      formData: {
        productKey: '',
        abilityType: 1,
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
      }
    }
  },
  mounted () {
    this.formData.productKey = this.productKey
  },
  methods: {
    changeAblityTypeFun (index) {
      this.$refs.addCustomAbilityForm.resetFields()
      this.formData.abilityType = index
    },
    handleSave () {
      this.$refs.addCustomAbilityForm.validate(valid => {
        if (valid) {
          this.$refs.attDataSelectPart.getDataForParent()
        }
      })
    },
    callBackForAttribute (data) {
      if (data) {
        for (let key in data) {
          this.formData.modelData[key] = data[key]
        }
        console.log(this.formData)
        addCustomAbility(this.formData).then(res => {
          console.log(res)
        })
      }
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