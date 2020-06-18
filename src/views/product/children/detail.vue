<template>
  <div id="addProduct">
    <div class="f20 b pb20">
      <i class="el-icon-back" @click="handle"></i>
      产品详情
    </div>
  
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
        var categoryId = '';
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
    handle(){
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
