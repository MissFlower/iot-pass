<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的服务部分
 -->

<template>
  <div id="serviceCon">
    <el-form :model="formData" :rules="rules">
      <el-form-item label="调用方式" prop="cdecl">
        <el-radio v-model="formData.cdecl" label="1">异步</el-radio>
        <el-radio v-model="formData.cdecl" label="0">同步</el-radio>
      </el-form-item>
      <el-form-item label="输入参数">
        <el-button type="text" icon="el-icon-plus" @click="addStruct">新增参数</el-button>
      </el-form-item>
      <el-form-item label="输出参数">
        <el-button type="text" icon="el-icon-plus" @click="addStruct">新增参数</el-button>
      </el-form-item>
    </el-form>
    <add-param v-if="flag == 1"></add-param>
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
        cdecl: '1'
      },
      rules: {
        cdecl: [
          {required: true, message: "请选择调用方式", trigger: 'change' }
        ]
      },
      inputDataSpecs: []
    }
  },
  methods: {
    addStruct () {
      this.flag = 1
    }
  }
}
</script>