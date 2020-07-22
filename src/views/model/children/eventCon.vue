<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的事件部分
 -->

<template>
  <div class="eventCon">
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="事件类型" prop="type">
        <div v-if="modelType" class="disabledDiv">
          {{eventType[formData.type]}}
        </div>
        <div v-else>
          <el-radio v-model="formData.type" label="alert">信息</el-radio>
          <el-radio v-model="formData.type" label="warn">告警</el-radio>
          <el-radio v-model="formData.type" label="error">故障</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="输出参数">
        <div v-for="(item, index) in formData.outputData" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{item.name}}</div>
          <div>
            <el-link type="primary" :underline="false" class="f12 mr10" @click.stop="editSturct(item)">编辑</el-link>
            <el-link type="primary" :underline="false" class="f12" @click.stop="deleteStruct(index)" :disabled="modelType">删除</el-link>
          </div>
        </div>
        <el-button type="text" icon="el-icon-plus" @click="addStruct">新增参数</el-button>
      </el-form-item>
    </el-form>
    <add-param v-if="flag == 1" :specs="specs" :info="structInfo" :modelType="modelType" @close="closeAddParam" @success="successAddParams" :allFlag="0"></add-param>
  </div>
</template>

<script>
import addParam from "./addParam"
import dataObj from '@/data/data'
export default {
  components: {addParam},
  props: ['info', 'modelType'],
  data () {
    return {
      flag: 0,
      formData: {
        type: 'alter',
        outputData: []
      },
      rules: {
        type: [
          {required: true, message: "请选择事件类型", trigger: 'change' }
        ]
      },
      structInfo: null,
      structIndex: -1,
      specs: [],
      eventType: dataObj.eventType
    }
  },
  mounted () {
    if (this.info) {
      for(let key in this.formData) {
        this.formData[key] = this.info[key]
      }
    }
  },
  methods: {
    addStruct () {
      this.specs = JSON.parse(JSON.stringify(this.formData.outputData))
      this.flag = 1
      this.structInfo = null
    },
    editSturct (row, index) {
      this.structInfo = JSON.parse(JSON.stringify(row))
      this.structIndex = index
      let specs = this.formData.outputData
      specs = specs.filter(item => {
        return item.identifier !== row.identifier
      })
      this.specs = specs
      this.flag = 1
    },
    deleteStruct (index) {
      const row = this.formData.outputData
      row.splice(index, 1)
    },
    closeAddParam () {
      this.flag = 0
    },
    successAddParams (data) {
      if (data) {
        const row = this.formData.outputData
        if (this.structInfo) {
          row.splice(this.structIndex, 1, data)
          this.structIndex = -1
          this.structInfo = null
        } else {
          row.push(data)
        }
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
