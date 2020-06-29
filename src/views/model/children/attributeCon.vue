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
export default {
  props: ['dataType'],
  data() {
    return {
      formData: {
        accessMode: '0',
        dataType: null
      }
    }
  },
  mounted () {
    console.log(this.dataType)
  },
  methods: {
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