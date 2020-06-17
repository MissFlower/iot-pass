<template>
  <div id="addProduct">
    <div class="mb20 tr">
      <el-button type="primary" @click="handleAdd">新建产品</el-button>
    </div>
    <el-table :data="productInfos" border :loading="loading">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="产品KEY" prop="key"></el-table-column>
      <el-table-column label="产品名称" prop="name"></el-table-column>
      <el-table-column label="节点类型"></el-table-column>
      <el-table-column label="联网方式"></el-table-column>
      <el-table-column label="数据格式"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="操作">
        <template >
          <el-button type="text"  >查看</el-button>
          <el-button type="text"  >设备管理</el-button>
          <el-button type="text"  >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
  </div>
</template>

<script>

export default { 
  name:'productList',
  props: {
    productInfos:[Array],
    loading:{
      type:[Boolean],
      default:false
    }
  },
  data() {
    return {   
      
     
    };
  },  
  methods: {   
    handleAdd() {
      this.$router.push("add-product");
    }
  }
};
</script>

<style lang="scss" scoped>
#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
