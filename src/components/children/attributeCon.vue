<template>
  <div id="attributeCon">
    <datatype-selectpart></datatype-selectpart>
    <el-form-item label="读写类型">
      <el-radio v-model="type" label="1">读写</el-radio>
      <el-radio v-model="type" label="0">只读</el-radio>
    </el-form-item>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
      type: '1'
    }
  }
}
</script>