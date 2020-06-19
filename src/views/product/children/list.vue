<template>
  <div id="addProduct">    
    <el-table :data="data" border v-loading="loading">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="产品KEY" prop="productKey"></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="节点类型">
        <template slot-scope="scope">
          {{nodeTypeData(scope.row.nodeType)}}
        </template>
      </el-table-column>
      <el-table-column label="连网方式" >
        <template slot-scope="scope">
          {{netTypeData(scope.row.netType)}}
        </template>
      </el-table-column>
      <el-table-column label="数据格式">
        <template slot-scope="scope">
          {{scope.row.dataFormat == 1 ? 'Json' : '透传/自定义'}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.productStatus == 1 ? '发布' : '开发中'}}
        </template>
      </el-table-column>      
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text"  @click="productDetail(scope.row.productKey)">查看</el-button>
          <el-button type="text">设备管理</el-button>
          <el-button type="text" v-if="!scope.row.productStatus" @click="delProduct(scope.row.productKey)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
   
  </div>
</template>

<script>
import { delProduct } from "@/api/product"
import {nodeTypeData, netTypeData} from "./transformation"
export default { 
  name:'productList',
  props: {
    data:[Array],
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
    nodeTypeData(val){
      return nodeTypeData(val)
    },
    netTypeData(val){
      return netTypeData(val)
    },
    //产品详情
    productDetail(key){
      this.$router.push({path: `detail/${key}`})
    },
    //删除产品
    delProduct(productKey){
      this.$confirm('确定要删除产品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProduct({productKey}).then(res => {
            if(res.code === 200){
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
              this.$emit('getList')
            }
          }).catch(err => {
              this.$message({
                  type: 'error',
                  message: '删除失败!'
              });
          })
         
        })
      
    },
    
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
