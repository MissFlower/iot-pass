<template>
  <div id="product" >
    <div class="mb20 tr">
      <div class="search_box">
        <el-input
          placeholder="请输入产品名称查询"
          prefix-icon="el-icon-search"
          v-model="productName">
        </el-input>
      </div>
      
      <el-button type="primary" @click="handleAdd">新建产品</el-button>
    </div>
    <product-list v-if="flag == 0" :data="listData" :loading="loading" @getList="getList"></product-list>
     <!-- 分页-->
    <pagination :data="tableData" @pagination="changePage"/>
  </div>
</template>

<script>
import productList from "./children/list";
import Pagination from "@/components/Pagination"
import { tableList } from "@/api/product"

export default {
  components: { productList , Pagination},
  data() {
    return {
      productName:'',
      flag: 0,
      listData:[],
      tableData:{        
        pageCount: 0, //总页数
        total: 0, // 总条数
        pageSize: 10, //一页大小
        pageNum: 0, // 第几页 从0开始           
       
      },
      loading:false,  
    }
  },
  created() {     
    this.getList();
  },
  methods: {
      //产品列表
      getList(){
        this.loading = true;
        tableList(Object.assign(this.tableData,{productName: this.productName})).then(res => {
            setTimeout(() => {
              this.loading = false;
            },1000)
            if(res.code === 200){
              let {data,...pagination} =  res.data;
              this.tableData = pagination;
              this.listData = res.data.data;          
            }
        }).catch(err => {
          this.loading = false;     
        })
      },
      //新建产品
      handleAdd() {
        this.$router.push("add-product");
      },
      //分页
     changePage(){
      
      this.getList()
    },
  },
};
</script>

<style lang="scss" scoped>
#product {
  position: relative;
  width: 100%;
  // height: 100%;
  padding: 20px;
}
.search_box{
  display: inline-block;
  margin-right: 20px;
}
</style>
