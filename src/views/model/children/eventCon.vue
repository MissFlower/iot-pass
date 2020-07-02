<!-- 
文件作者：mawenjuan
创建日期：2020.6.23
文件说明：自定义功能的事件部分
 -->

<template>
  <div class="eventCon">
    <el-form :model="formData" :rules="rules">
      <el-form-item label="事件类型" prop="eventType">
        <el-radio v-model="formData.eventType" label="0">信息</el-radio>
        <el-radio v-model="formData.eventType" label="1">告警</el-radio>
        <el-radio v-model="formData.eventType" label="2">故障</el-radio>
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
        eventType: '0'
      },
      rules: {
        eventType: [
          {required: true, message: "请选择事件类型", trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addStruct () {
      this.flag = 1
    }
  }
}
</script>