<template>
  <div id="product">
    <product-list v-if="flag == 0" :product-infos="tableData.productInfos" :loading="loading"></product-list>
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
      flag: 0,
      tableData:{
        last: true,// 是否最后一页
        totalPages: 0, //总页数
        totalElements: 0, // 总条数
        size: 10, //一页大小
        page: 0, // 第几页 从0开始
        numberOfElements: 0,//当前页元素数
        first: true, // 是否第一页
        empty: true, //返回是否空
        required: true,
        type: Object,
        productInfos:[]
      },
      loading:false,  
    }
  },
  created() {    
    
    tableList(this.tableData).then(res => {
        this.loading = true;
        console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
     changePage(){
      console.log(this.tableData)
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
</style>
