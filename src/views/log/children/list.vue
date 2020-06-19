<template>
  <div>
    <el-table :data="data" border v-loading="loading">
      <el-table-column label="通信的topic" prop="topic"></el-table-column>
      <el-table-column label="产品KEY" prop="productKey"></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="设备名称" prop="deviceName"></el-table-column>
      <el-table-column label="消息id" prop="messageId"></el-table-column>
      <el-table-column label="业务编码" prop="bizCode"></el-table-column>
      <el-table-column label="操作编码" prop="operation"></el-table-column>
      <el-table-column label="创建时间" prop="time"></el-table-column>
      <el-table-column label="消息" prop="message"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name:'logList',
  props: {
    data:[Array],
    loading:{
      type:[Boolean],
      default:false
    }
  }
};
</script>
