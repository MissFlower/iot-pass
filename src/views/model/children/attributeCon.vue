<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的属性部分
 -->

<template>
  <div id="attributeCon">
    <datatype-selectpart ref="form" :info="formData.dataType" @success="handleSuccess"></datatype-selectpart>
    <div><span class="red mr5">*</span>读写类型</div>
    <el-form-item>
      <el-radio v-model="formData.accessMode" label="0">读写</el-radio>
      <el-radio v-model="formData.accessMode" label="1">只读</el-radio>
    </el-form-item>
  </div>
</template>

<script>
import dataObj from '@/data/data'
export default {
  props: ['dataType', 'accessMode'],
  data() {
    return {
      formData: {
        accessMode: '0',
        dataType: null
      },
      dataTypeObj: dataObj.dataTypeObj
    }
  },
  mounted () {
    if (this.accessMode) {
      this.formData.accessMode = this.accessMode
    }
    if (this.dataType) {
      if (this.dataType.type) {
        this.dataType.type = this.dataTypeObj[this.dataType.type] ? this.dataTypeObj[this.dataType.type] : this.dataType.type
      }
      this.formData.dataType = JSON.parse(JSON.stringify(this.dataType))
    }
  },
  methods: {
    // 数据选择成功的回调
    handleSuccess (data) {
      if (data) {
        this.formData.dataType = JSON.parse(JSON.stringify(data))
        this.$emit('callBack', this.formData)
      } else {
        this.$emit('callBack', null)
      }
    },
    // 父级获取输入的参数
    getDataForParent () {
      this.$refs.form.getDataForParent()
    }
  }
}
</script>