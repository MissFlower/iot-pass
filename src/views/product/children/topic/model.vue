<template>
  <div>
    <div class="mt20 f14">物模型通信Topic</div>
    <el-table
      :data="modelData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="fn"
        label="功能"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="Topic类型">
      </el-table-column>
      <el-table-column
        prop="pess"
        label="操作权限">
      </el-table-column>
      <el-table-column
        prop="des"
        label="描述">
      </el-table-column>    
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['modelData'],
    data() {
      return {
        
      
      };
    },   
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex  === 0) {
            return [2,1];
          } else if (rowIndex  === 2){
            return [2,1];
          }else if(rowIndex  === 4){
             return [1,1];
          } else {
            return [0,0]
          }
        }
      }
    }
  };
</script>