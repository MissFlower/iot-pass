<!--
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的服务部分
 -->

<template>
  <div id="serviceCon">
    <el-form ref="form" :model="formData" :rules="rules" :disabled="showFlag">
      <el-form-item label="调用方式" prop="callType">
        <el-radio v-model="formData.callType" label="async">异步</el-radio>
        <el-radio v-model="formData.callType" label="sync">同步</el-radio>
      </el-form-item>
      <el-form-item label="输入参数">
        <div v-for="(item, index) in formData.inputData" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{ item.name }}</div>
          <div>
            <el-link
              type="primary"
              :underline="false"
              class="f12 mr10"
              @click.stop="editSturct('input', item, index)"
              v-if="showFlag"
            >查看</el-link>
            <el-link
              type="primary"
              :underline="false"
              class="f12 mr10"
              @click.stop="editSturct('input', item, index)"
              v-if="!showFlag"
            >编辑</el-link>
            <el-link
              type="primary"
              :underline="false"
              v-if="!(showFlag || modelType)"
              class="f12"
              @click.stop="deleteStruct('input', index)"
            >删除</el-link>
          </div>
        </div>
        <el-button v-if="!showFlag" type="text" icon="el-icon-plus" @click="addStruct('input')">新增参数</el-button>
        <div class="ml20 f12" v-else-if="formData.outputData.length == 0">无输入参数</div>
      </el-form-item>
      <el-form-item label="输出参数">
        <div v-for="(item, index) in formData.outputData" :key="index" class="df ai_c json_item">
          <div class="flex1">参数名称： {{ item.name }}</div>
          <div>
            <el-link
              type="primary"
              :underline="false"
              class="f12 mr10"
              @click.stop="editSturct('output', item, index)"
              v-if="showFlag"
            >查看</el-link>
            <el-link
              type="primary"
              :underline="false"
              class="f12 mr10"
              v-if="!showFlag"
              @click.stop="editSturct('output', item, index)"
            >编辑</el-link>
            <el-link
              type="primary"
              :underline="false"
              class="f12"
              @click.stop="deleteStruct('output', index)"
              v-if="!(showFlag || modelType)"
            >删除</el-link>
          </div>
        </div>
        <el-button v-if="!showFlag" type="text" icon="el-icon-plus" @click="addStruct('output')">新增参数</el-button>
        <div class="ml20 f12" v-else-if="formData.outputData.length == 0">无输出参数</div>
      </el-form-item>
    </el-form>
    <add-param
      v-if="flag == 1"
      :specs="specs"
      :info="structInfo"
      :showFlag="showFlag"
      :modelType="addParamFlag"
      :allFlag="1"
      @close="closeAddParam"
      @success="successAddParams"
    ></add-param>
  </div>
</template>

<script>
import addParam from './addParam'
export default {
  components: { addParam },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    showFlag: {
      type: Boolean,
      default: false
    },
    modelType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: 0,
      formData: {
        callType: 'async',
        inputData: [],
        outputData: []
      },
      rules: {
        callType: [
          { required: true, message: '请选择调用方式', trigger: 'change' }
        ]
      },
      type: '',
      structInfo: null,
      structIndex: -1,
      specs: [],
      addParamFlag: false
    }
  },
  mounted() {
    if (this.info) {
      for (const key in this.formData) {
        this.formData[key] = this.info[key]
      }
    }
  },
  methods: {
    addStruct(str) {
      this.type = str
      this.specs = JSON.parse(JSON.stringify(this.formData[`${str}Data`]))
      this.flag = 1
      this.structInfo = null
      this.addParamFlag = false
    },
    editSturct(type, row, index) {
      this.addParamFlag = this.modelType
      this.type = type
      this.structInfo = JSON.parse(JSON.stringify(row))
      this.structIndex = index
      let specs = this.formData.inputData
      if (this.type === 'output') {
        specs = this.formData.outputData
      }
      specs = specs.filter(item => {
        return item.identifier !== row.identifier
      })
      this.specs = specs
      this.flag = 1
    },
    deleteStruct(type, index) {
      const row = this.formData[`${type}Data`]
      row.splice(index, 1)
    },
    closeAddParam() {
      this.flag = 0
    },
    successAddParams(data) {
      let row = this.formData.inputData
      if (this.type === 'output') {
        row = this.formData.outputData
      }
      if (data) {
        if (this.structInfo) {
          row.splice(this.structIndex, 1, data)
          this.structIndex = -1
          this.structInfo = null
        } else {
          row.push(data)
        }
      }
    },
    getDataForParent() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('success', this.formData)
        }
      })
    }
  }
}
</script>
