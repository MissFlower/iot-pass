<template>
  <div id="attributeCon">
    <el-form-item label="数据类型">
      <el-select v-model="formData.dataType">
        <el-option v-for="(item, index) in dataTypeArr" :key="index" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        dataType: 'int'
      },
      dataTypeArr: [{
        value: 'int',
        label: 'int32 (整数型)'
      }, {
        value: 'float',
        label: 'float (单精度浮点型)'
      }, {
        value: 'double',
        label: 'double (双精度浮点型)'
      }, {
        value: 'enum',
        label: 'enum (枚举型)'
      }, {
        value: 'bool',
        label: 'bool (布尔型)'
      }, {
        value: 'text',
        label: 'text (字符串)'
      }, {
        value: 'date',
        label: 'date (时间型)'
      }, {
        value: 'struct',
        label: 'struct (结构体)'
      }, {
        value: 'array',
        label: 'array (数组)'
      }]
    }
  }
}
</script>