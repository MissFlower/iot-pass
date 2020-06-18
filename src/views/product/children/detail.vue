<template>
  <div id="addProduct" >
    <div class="f20 b pb20 title_wrp">
      <div>
        <i class="el-icon-back" @click="goBack"></i><span style="margin-left:15px">{{productName}}</span>         
      </div>
      <el-button :type="btnType">{{btnType ? '发布' : '撤销发布'}}</el-button>
    </div>
    <div class="p_key">
      <span>产品密钥:</span>
      <span class="key">{{productKey}}</span>
       <el-link :underline="false" type="primary">复制</el-link>
    </div>
    <div class="tab_wrp mt20" >
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange" >
        <el-tab-pane label="产品信息" name="product">
          <product-info />
        </el-tab-pane>
        <el-tab-pane label="功能定义" name="second"></el-tab-pane>
       
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { findSecret, getProduct } from "@/api/product"
import productInfo from './info'
export default { 
  components: {
    productInfo
  },
  data() {
    return {
      activeName: 'product',
      standardSelectState:true, 
      btnType: 'primary',
      productKey:'',
      productName: '',
      loading: false  
    };
  },
  created() {
    this.getProDetail()
    //获取产品密钥    
    findSecret({productKey: this.$route.params.key}).then(res => {
        if(res.code === 200){
          this.productKey = res.data
        }
    })
  },
  methods: {
    //返回上层页面
    goBack(){
      this.$router.go(-1)
    },
    //切换tab
    tabChange(val){

    },
    //获取产品详情数据
    getProDetail(){
      this.loading = true
      getProduct({productKey: this.$route.params.key}).then(res => {
        setTimeout(() => {
          this.loading = false;
        },1000)
        if(res.code === 200){
          this.productName = res.data.productName
        }
      }).catch(err => {
        this.loading = false
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.title_wrp{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p_key{
  color: #888;
  font-size: 14px;
  .key{
    margin-left:35px;
    margin-right: 5px; 
  }
}



#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
