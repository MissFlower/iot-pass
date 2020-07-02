<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的服务部分
 -->

<template>
  <div id="serviceCon">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="调用方式" prop="callType">
        <el-radio v-model="formData.callType" label="async">异步</el-radio>
        <el-radio v-model="formData.callType" label="sync">同步</el-radio>
      </el-form-item>
      <el-form-item label="输入参数">
        <div v-for="(item, index) in formData.inputData" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{item.name}}</div>
          <div>
            <el-link type="primary" :underline="false" class="f12 mr10" @click.stop="editSturct(item)">编辑</el-link>
            <el-link type="primary" :underline="false" class="f12" @click.stop="deleteStruct(index)">删除</el-link>
          </div>
        </div>
        <el-button type="text" icon="el-icon-plus" @click="addStruct('input')">新增参数</el-button>
      </el-form-item>
      <el-form-item label="输出参数">
        <div v-for="(item, index) in formData.outputData" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{item.name}}</div>
          <div>
            <el-link type="primary" :underline="false" class="f12 mr10" @click.stop="editSturct(item)">编辑</el-link>
            <el-link type="primary" :underline="false" class="f12" @click.stop="deleteStruct(index)">删除</el-link>
          </div>
        </div>
        <el-button type="text" icon="el-icon-plus" @click="addStruct('output')">新增参数</el-button>
      </el-form-item>
    </el-form>
    <add-param v-if="flag == 1" :specs="specs" :info="structInfo" @close="closeAddParam" @success="successAddParams"></add-param>
  </div>
</template>

<script>
import addParam from "./addParam"
export default {
  components: {addParam},
  data () {
    return {
      flag: 0,
      formData: {
        callType: 'async',
        inputData: [],
        outputData: []
      },
      rules: {
        callType: [
          {required: true, message: "请选择调用方式", trigger: 'change' }
        ]
      },
      type: '',
      structInfo: null,
      specs: []
    }
  },
  methods: {
    addStruct (str) {
      this.type = str
      this.specs = JSON.parse(JSON.stringify(this.formData[`${str}Data`]))
      this.flag = 1
    },
    closeAddParam () {
      this.flag = 0
    },
    successAddParams (data) {
      let row = this.formData.inputData
      if (this.type === 'output') {
        row = this.formData.outputData
      }
      if (data) {
        row.push(data)
      }
    },
    getDataForParent () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('success', this.formData)
        }
      })
    }
  }
}
</script>