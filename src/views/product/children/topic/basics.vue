<template>
  <div>
    <div class="mt20 f14">基础通信Topic</div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="groupName"
        label="功能"
        width="180">
      </el-table-column>
      <el-table-column
        prop="topicName"
        label="Topic类型">
      </el-table-column>
      <el-table-column
        prop="operatePrivilege"
        label="操作权限">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述">
      </el-table-column>    
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['basicsData'],
    data() {
      return {        
        tableData: [],
        spanIndex: 0,
        spanTotle: 0,
        indexArr: []
      };
    }, 
    watch: {
      basicsData(basicsData){
        var dataArr = [];
        var indexArr = [];
        basicsData.map(basicsVal => {
          if(basicsVal.list){
            basicsVal.list.map(dataVal => {
              dataVal.groupName = basicsVal.groupName
            })
          }
          dataArr.concat(basicsVal.list);
          indexArr.push(basicsVal.list.length);
        })    
        this.indexArr = indexArr;
        this.tableData = dataArr;          
      }
    }, 
    
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {          
          if (rowIndex  === this.spanTotle) {
            var i = this.indexArr[this.spanIndex]
            this.spanTotle += i;
            this.spanIndex ++;
            return [i,1];          
          } else {
            return [0,0]
          }
        }
      }
    }
  };
</script>