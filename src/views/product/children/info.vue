<template>
  <div id="main" v-loading="loading">    
      <div class="edit_product">
          <span class="title">产品信息</span>
          <el-link icon="el-icon-edit" v-show="btnType" @click="dialogProEditBtn">编辑</el-link>
      </div>
      <div class="grid_wrp">
        <el-row style="display: flex;flex-wrap: wrap">
          <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  产品名称
                </div>
                <div class="grid_col grid_right">
                  {{productData.productName}}
                </div>
              </div>
          </el-col>
          
           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  节点类型
                </div>
                <div class="grid_col grid_right">
                  {{nodeTypeData(productData.nodeType)}}
                </div>
              </div>
          </el-col>

           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left" style="word-break: break-all;">
                  创建时间
                </div>
                <div class="grid_col grid_right">
                  {{productData.createTime}}
                </div>
              </div>
          </el-col>

           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  所属品类
                </div>
                <div class="grid_col grid_right">
                  {{productData.categoryName || '-'}}
                </div>
              </div>
          </el-col>

          <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  数据格式
                </div>
                <div class="grid_col grid_right">
                  {{productData.dataFormat === 1 ? 'Json' : '透传/自定义'}}
                </div>
              </div>
          </el-col>

           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  认证方式
                </div>
                <div class="grid_col grid_right">
                  {{authTypeData(productData.authType)}}
                </div>
              </div>
          </el-col>

           <el-col :span="8" v-show="btnType">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  动态注册
                </div>
                <div class="grid_col grid_right">
                  <el-switch
                    v-model="productData.dynRegister"
                    active-text="开启"
                    inactive-text="关闭"
                    :active-value="1" 
                    :inactive-value="0"
                    @change="dynRegisterChange">
                  </el-switch>
                </div>
              </div>
          </el-col>

           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  状态
                </div>
                <div class="grid_col grid_right">
                  {{btnType === '' ?  '发布' : '开发中'}}
                </div>
              </div>
          </el-col>

           <el-col :span="8">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  连网协议
                </div>
                <div class="grid_col grid_right">
                  {{netTypeData(productData.netType)}}
                </div>
              </div>
          </el-col>


           <el-col :span="btnType=='' ? 8 : 24">
              <div class="grid-content ">
                <div class="grid_col grid_left">
                  产品描述
                </div>
                <div class="grid_col grid_right">
                  {{productData.description || '-'}}
                </div>
              </div>
          </el-col>
        </el-row>
      </div>
      <!-- 产品编辑弹窗 -->
      <el-dialog title="编辑产品信息" :visible.sync="dialogProEdit" width="30%" class="dialogProEdit">
        <el-form :model="dialogProEditForm" label-position="top" :rules="dialogProEditRole" ref="dialogProEditForm">
          <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName">
            <el-input v-model="dialogProEditForm.productName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="节点类型" :label-width="formLabelWidth">
            <el-input v-model="dialogProEditForm.nodeType" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="数据格式" :label-width="formLabelWidth">
            <el-input v-model="dialogProEditForm.dataFormat" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="所属品类" :label-width="formLabelWidth">
            <el-input v-model="dialogProEditForm.categoryName" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="连网协议" :label-width="formLabelWidth">
            <el-input v-model="dialogProEditForm.netType" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          
          <el-form-item label="产品描述" :label-width="formLabelWidth">
            <el-input v-model="dialogProEditForm.description" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProEdit = false">取 消</el-button>
          <el-button type="primary" @click="dialogProEditSave('dialogProEditForm')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { findSecret, getProduct, dynamicRegisterSwitch, productEdit} from "@/api/product"
import {nodeTypeData, netTypeData, authTypeData } from "./transformation"
export default {
  props: {
    productData: {
      type: Object      
    },    
    btnType: {
      type: String      
    }
  },
  data() {
    return {
      loading: false,
      formLabelWidth: '120px',
      dialogProEdit: false,
      dialogProEditForm: {
        productName: '',
        nodeType: '',
        dataFormat: '',
        categoryName: '',
        netType: '',
        description: ''        
      },
      dialogProEditRole:{
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    };
  },
 
  methods: {
    nodeTypeData(val){
      return nodeTypeData(val)
    },
    netTypeData(val){
      return netTypeData(val)
    },
    authTypeData(val){
      return authTypeData(val)
    },
    //产品编辑
    dialogProEditBtn(){
      this.dialogProEdit = true;
      this.dialogProEditData();
    },
    //保存产品编辑
    dialogProEditSave(formName){      
      var id = this.productData.id;
      var productName = this.dialogProEditForm.productName;
      var dynRegister = 1;
      var description = this.dialogProEditForm.description;
      this.$refs[formName].validate((valid) => {                    
          if (valid) {               
              this.loading = true;            
              productEdit({id, productName, dynRegister, description}).then(res => {
                  this.loading = false;
                  if(res.code === 200){
                    this.dialogProEdit = false;
                    this.productData.description = this.dialogProEditForm.description;
                    this.productData.productName = this.dialogProEditForm.productName;
                    this.$emit('changeProName',this.dialogProEditForm.productName)
                  }
              }).catch(err => {
                  this.loading = false;
              })
          } else {            
              return false;
          }
      });
      
    },
    //产品编辑数据转换
    dialogProEditData(){     
      this.dialogProEditForm.productName = this.productData.productName;
      this.dialogProEditForm.nodeType = nodeTypeData(this.productData.nodeTyp);
      this.dialogProEditForm.dataFormat = (this.productData.dataFormat == 1 ? 'Json' : '透传/自定义');
      this.dialogProEditForm.categoryName = this.productData.categoryName;
      this.dialogProEditForm.netType = netTypeData(this.productData.netType);
      this.dialogProEditForm.description = this.productData.description;      
    },
    //动态注册开关
    dynRegisterChange(val){
      this.loading = true;
      dynamicRegisterSwitch({registerSwitch: val, productKey: this.$route.params.key}).then(res => {
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        if(val === 0){
          this.productData.dynRegister = 1;
        }else{
          this.productData.dynRegister = 0;
        }
      })  
    }
  },
};
</script>

<style lang="scss" scoped>
.dialogProEdit{
  /deep/.el-form-item__label{
   padding-bottom: 0;
  }
}
.edit_product{
  .title{
    font-weight: 900;
    font-size: 14px;
    margin-right: 15px;
  }
}
.grid_wrp{

  margin-top: 25px;
  border-right: 1px solid #ecedee; 
  border-bottom: 1px solid #ecedee; 
}
.grid-content {   
    font-size: 12px; 
    display: flex;  
    border-top:  1px solid #ecedee; 
    height: 100%;
    .grid_col{
      display: flex;
      align-items: center;
      padding: 10px; 
      
    }
    .grid_left{
      background: #fbfbfc;
      border-right: 1px solid #ecedee;
      border-left: 1px solid #ecedee;
      color: #73777a;
      width: 90px;
    }
    .grid_right{
        flex: 2;
    }
  }

#main {
  position: relative;
  width: 100%;
  height: 100%;  
}
</style>
