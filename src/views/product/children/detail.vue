<template>
  <div id="addProduct" v-loading="mainLoading">
    <div class="f20 b pb20 title_wrp">
      <div>
        <i class="el-icon-back" @click="goBack"></i><span style="margin-left:15px">{{productName}}</span>         
      </div>
      <el-button :type="btnType" @click="releaseProduct">{{btnType ? '发布' : '撤销发布'}}</el-button>
    </div>
    <div class="p_key">
      <div>
          <span>ProductKey:</span>
          <span class="key">{{this.$route.params.key}}</span>
          <el-link :underline="false" type="primary">复制</el-link>
      </div>
      <div>
          <span>ProductSecret:</span>
          <span class="key">*******</span>
          <el-link :underline="false" type="primary" @click="seeSecret">查看</el-link>
      </div>     
    </div>
     <div class="deviceCount">
        <span class="text">设备数:</span>
        <span class="key">{{productData.deviceCount}}</span>   
        <el-link :underline="false" type="primary" @click="seeSecret">前往管理</el-link>       
    </div>
    <div class="tab_wrp mt20" >
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange" >
        <el-tab-pane label="产品信息" name="product">
          <product-info :product-data="productData" :btn-type="btnType"/>
        </el-tab-pane>
        <el-tab-pane label="功能定义" name="second"></el-tab-pane>
       
      </el-tabs>
    </div>
    <el-dialog
      title="产品证书"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <div class="dialogSecret">
        <span class="text">ProductSecret</span>
        <span class="secret">{{productSecret}}</span>
        <el-link :underline="false" type="primary">复制</el-link>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>        
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findSecret, getProduct, cancelRelease, release } from "@/api/product"
import productInfo from './info'
export default { 
  components: {
    productInfo
  },
  data() {
    return {
      mainLoading: false,
      dialogVisible: false,
      activeName: 'product',
      standardSelectState:true, 
      btnType: 'primary',      
      productName: '',
      loading: false,
      productSecret: '',
      productData: {}
    };
  },
  created() {
    this.getProDetail()
    //获取产品密钥    
    findSecret({productKey: this.$route.params.key}).then(res => {
        if(res.code === 200){
          this.productSecret = res.data
        }
    })
  },
  methods: {
    //产品发布、取消
    releaseProduct(){
      this.mainLoading = true
      if(this.btnType === ''){
        cancelRelease({productKey: this.$route.params.key}).then(res => {
          this.mainLoading = false;
          if(res.code === 200){
            this.btnType = 'primary'
          }
        }).catch(err => {
          this.mainLoading = false;
        })
      }else{
        release({productKey: this.$route.params.key}).then(res => {
          this.mainLoading = false;
          if(res.code === 200){
            this.btnType = ''
          }
        }).catch(err => {
          this.mainLoading = false;
        })
      }
    },
    //查看密钥
    seeSecret(){
      this.dialogVisible = true;

    },
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
          this.productName = res.data.productName;
          this.productData = res.data;
          if(res.data.productStatus === 0){
              this.btnType = 'primary'
          }else{
              this.btnType = ''
          }
        }
      }).catch(err => {
        this.loading = false
      })
    }
  },
};
</script>

<style lang="scss" scoped>

.deviceCount{
  margin-top: 15px;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  .key{
    margin-left: 25px;
    margin-right: 5px;
  }
}

.title_wrp{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p_key{
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .key{
    margin-left:35px;
    margin-right: 5px; 
  }
}

.dialogSecret{
  border: 1px solid #ecedee;
  height: 36px; 
  display: flex;
  align-items: stretch; 
  span{
    display: flex;
    align-items: center;
    
    padding: 5px;
  }
  .text{
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
  }
}

#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
