<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="groupName" label="功能" width="180"></el-table-column>
      <el-table-column prop="topicName" label="Topic类型"></el-table-column>
      <el-table-column prop="operatePrivilege" label="操作权限"></el-table-column>
      <el-table-column prop="desc" label="描述"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    basicsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      numArr: []
    }
  },
  watch: {
    basicsData(basicsData) {
      var dataArr = []
      var numArr = []
      basicsData.map(basicsVal => {
        if (basicsVal.list) {
          basicsVal.list.map((dataVal, index) => {
            if (index === 0) {
              numArr.push(basicsVal.list.length)
            } else {
              numArr.push(0)
            }
            dataVal.groupName = basicsVal.groupName
          })
        }
        dataArr = dataArr.concat(basicsVal.list)
      })
      this.tableData = dataArr
      this.numArr = numArr
    }
  },

  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.numArr[rowIndex] > 0) {
          return [this.numArr[rowIndex], 1]
        } else {
          return [0, 0]
        }
      }
    }
  }
}
</script>
