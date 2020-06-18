<template>
  <div id="addProduct">
    <div class="f20 b pb20">
      <i class="el-icon-back" @click="goBack"></i>
      创建产品
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="ruleForm.productName"></el-input>
      </el-form-item>
      <el-form-item label="所属品类" prop="standardSelect">
        <div class="pb10">
          <el-radio-group v-model="ruleForm.category" @change="categoryChange">
            <el-radio label="标准品类"></el-radio>
            <el-radio label="自定义品类"></el-radio>
          </el-radio-group>
        </div>
        <el-select v-model="ruleForm.standardSelect" filterable  placeholder="请选择标准品类" v-show="standardSelectState">
          <el-option label="WiFi模板" :value="1"></el-option>
          <el-option label="4G模板" :value="2"></el-option>
        </el-select>
      </el-form-item>
     
     <el-form-item label="节点类型" prop="nodeType">        
        <el-radio-group v-model="ruleForm.nodeType" @change="nodeTypeChange">
          <el-radio :label="1">直连设备</el-radio>
          <el-radio :label="2">网关子设备</el-radio>
          <el-radio :label="3">网关设备</el-radio>          
        </el-radio-group>             
      </el-form-item>
     
       <el-form-item label="连网方式" prop="netType">        
        <el-select v-model="ruleForm.netType" placeholder="请选择">
          <el-option
            v-for="item in networkModeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>            
      </el-form-item>

      <el-form-item label="数据格式" prop="dataFormat">
        <el-select v-model="ruleForm.dataFormat" filterable  placeholder="请选择数据格式">
          <el-option label="Json" :value="1"></el-option>
          <el-option label="透传/自定义" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="认证方式" prop="authType">
        <el-select v-model="ruleForm.authType" filterable  placeholder="请选择认证方式">
          <el-option label="设备秘钥" :value="1"></el-option>
          <el-option label="ID²" :value="2"></el-option>
          <el-option label="X.509证书" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="注册开关" prop="dynRegister">
        <el-switch v-model="ruleForm.dynRegister" active-text="开" inactive-text="关" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" placeholder="请输入产品描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { productSave } from "@/api/product"
export default {
  props: ["info"],
  data() {
    return {
      standardSelectState:true,
      ruleForm: {
          productName: '',
          standardSelect: '',        
          netType:1,
          category:'标准品类',
          nodeType: 1,
          dataFormat: 1,
          authType: 1,
          dynRegister: 1,
          description: ''
      },
      rules: {
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          // standardSelect:[
          //   {required: true,message: '请选择标准品类',trigger: 'change'}
          // ],
          nodeType:[
            {required: true,message: '请选择所节点类型',trigger: 'change'}
          ],
       
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          
        },
        networkModeOptions:[
          {
            value: 1,
            label: 'wifi',
            disabled:false            
          },
          {
            value: 2,
            label: '蜂窝数据',
            disabled:false           
          },
          {
            value: 3,
            label: '以太网',
            disabled:false             
          },
          {
            value: 4,
            label: 'LoRaWAN',
            disabled:false             
          },
          {
            value: 5,
            label: '其他',
            disabled:false             
          },
        ]
    };
  },
  methods: {
    //提交表单
    submitForm(formName) {
        var categoryId = null;
        this.$refs[formName].validate((valid) => {
           if(this.ruleForm.category === '标准品类'){
                // categoryId = {categoryId: this.standardSelect}
            }else{              
              // this.$refs['ruleForm'].clearValidate('standardSelect') 
            }          
          if (valid) {                   
            productSave(Object.assign({},this.ruleForm,{categoryId})).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
          } else {            
            return false;
          }
        });
    },
    //返回上层页面
    goBack(){
      this.$router.go(-1)
    },
    //所属品类选择
    categoryChange(val){
      if(val === '标准品类'){
        this.standardSelectState = true
      }else{
        this.standardSelectState = false;  
        // this.$refs['ruleForm'].clearValidate('standardSelect')             
      }
    },
    //节点类型选择
    nodeTypeChange(val){
      if(val === 2){
        this.ruleForm.netType = 5;
        this.networkModeOptions.map(v => {
          if(v.value != 5){
              v.disabled = true;              
          }
        })
      }else{       
        this.networkModeOptions.map(v => {                   
            v.disabled = false;
              
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
