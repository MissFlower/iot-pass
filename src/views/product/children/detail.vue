<template>
  <div id="addProduct" v-loading="mainLoading">
    <div class="f20 b pb20 title_wrp">
      <div>
        <i class="el-icon-back" @click="goBack"></i><span style="margin-left:15px">{{productName}}</span>         
      </div>
      <el-button :type="btnType" @click="releaseProduct" v-if="authArr.indexOf('product_release') > -1">{{btnType ? '发布' : '撤销发布'}}</el-button>
    </div>
    <div class="p_key">
      <div>
          <span>ProductKey:</span>
          <span class="key">{{productKey}}</span>
          <el-link :underline="false" type="primary" @click="copyContent(productKey)">复制</el-link>
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
        <el-link :underline="false" type="primary" @click="goEqu">前往管理</el-link>       
    </div>
    <div class="tab_wrp mt20" >
      <el-tabs v-model="activeName" type="card" @tab-click="tabChange" >
        <el-tab-pane label="产品信息" name="product">
          <product-info :product-data="productData" :btn-type="btnType" @changeProName="changeProName"/>
        </el-tab-pane>

        <el-tab-pane label="Topic类列表" name="topic">
          <product-topic  :productId="productData.id" :productStatus="productData.productStatus"/>
        </el-tab-pane>

        <el-tab-pane label="功能定义" name="second">
          <product-ability v-if="productData.productKey && activeName == 'second'" :productKey="productData.productKey" :productStatus="productData.productStatus"></product-ability>
        </el-tab-pane>
       
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
        <el-link :underline="false" type="primary" @click="copyContent(productSecret)">复制</el-link>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>        
      </span>
    </el-dialog>
    <div id="copy_content_wrp">
       <input type="text" id="copy_content"/>
    </div>   
  </div>
</template>

<script>
import { findSecret, getProduct, cancelRelease, release } from "@/api/product"
import productInfo from './info'
import productTopic from './topic/topic'
import productAbility from '@/views/model/modelTab'
export default { 
  components: {
    productInfo,
    productTopic,
    productAbility
  },
  data() {
    return {
      mainLoading: false,
      productKey: this.$route.params.key,
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
    findSecret({productKey: this.productKey}).then(res => {
        if(res.code === 200){
          this.productSecret = res.data
        }
    })
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr;
    }
  },
  mounted () {
    if (this.$route.query.activetab) {
      this.activeName = this.$route.query.activetab
    }
  },
  methods: {
    //复制文本内容
     copyContent(text){         
         var inputElement =  document.getElementById("copy_content");         
         inputElement.value = text;         
         inputElement.select();          
         document.execCommand("Copy");         
         this.$message({
          message: '复制成功',
          type: 'success'
        });       
     },
     //设备管理
     goEqu(){
       this.$router.push(`/device/deviceManage?productId=${this.productData.id}`)
     },
    //修改产品名称
    changeProName(name){
      this.productName = name
    },
    //产品发布、取消
    releaseProduct(){            
      if(this.btnType === ''){
        this.$confirm('确认要将产品撤销发布吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mainLoading = true
          cancelRelease({productKey: this.productKey}).then(res => {
            this.mainLoading = false;
            if(res.code === 200){
              this.btnType = 'primary';
              this.$message({
                type: 'success',
                message: '撤销发布成功！'
              });
            }else {
              this.$message.warning(res.message);
            }
          }).catch(err => {
            this.mainLoading = false;
            this.$message.error(err);  
          })          
        })
        
      }else{
        this.$confirm('请确认产品的各项基本信息准确无误，产品发布后将无法再做修改和删除。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mainLoading = true
          release({productKey: this.productKey}).then(res => {
            this.mainLoading = false;
            if(res.code === 200){
              this.btnType = '';
              this.$message({
                type: 'success',
                message: '发布成功!'
              });
            }else {
              this.$message.warning(res.message);
            }
          }).catch(err => {
            this.mainLoading = false;
            this.$message.error(err);  
          })
          
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
      getProduct({productKey: this.productKey}).then(res => {        
        this.loading = false;        
        if(res.code === 200){        
          this.productName = res.data.productName;  
          this.productData = res.data;
          if(res.data.productStatus === 0){
              this.btnType = 'primary'
          }else{
              this.btnType = ''
          }
        }else {
          this.$message.warning(res.message);
        }
      }).catch(err => {
        this.loading = false;
        this.$message.error(err); 
      })
    }
  },
};
</script>

<style lang="scss" scoped>
#copy_content_wrp{
  position: relative;
  overflow: hidden;
}

#copy_content{
  position: absolute;
  left: -10000px;
  opacity: 0;
}
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
