<template>
  <div id="addProduct" v-loading="loading">
    <div class="f20 b pb20">
      <i class="el-icon-back" @click="goBack"></i>
      创建产品
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="ruleForm.productName"></el-input>
      </el-form-item>
      <el-form-item label="所属品类" prop="standardSelect" >
        <div class="pb10">           
          <el-radio-group v-model="ruleForm.category" @change="categoryChange">
            <el-radio label="标准品类"></el-radio>
            <el-radio label="自定义品类"></el-radio>
          </el-radio-group>
        </div>   
        <div @click="standardSelectDrawer = true">
          <el-input
            placeholder="请选择标准品类"
            suffix-icon="el-icon-arrow-down"
            v-show="standardSelectState"
            v-model="ruleForm.standardSelect"
            class="standardSelectInput"
            disabled
            >
          </el-input>
        </div>     
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

      <!-- <el-form-item label="固件版本">
        <el-input v-model="ruleForm.fmTypes"></el-input>
      </el-form-item> -->

      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" placeholder="请输入产品描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 选择品类 -->
    <el-drawer
      title="选择品类!"
      :visible.sync="standardSelectDrawer"
      direction="rtl"
      size="40%">
      <div>
         <el-select v-model="standardSelectValue" placeholder="请选择" >
            <el-option
              v-for="item in standardSelectOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
         <div class="standardSelectSearch_wrp">
            <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="standardSelectSearch"
            clearable
            @clear="queryProduct"
            @keyup.enter.native="queryProduct">
          </el-input>
         </div>
      </div>
      <div >
         <el-table :data="standardSelectTlData">          
          <el-table-column property="name" label="品类名称"></el-table-column>
          <el-table-column property="scene" label="所属场景"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button type="text"  @click="standardSelectBtn(scope.row)">选择</el-button>            
          </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <pagination :data="tableData" @pagination="changePage" class="tr"/>
      </div>
      <div class="demo-drawer__footer" style="margin-top: 20px;text-align: right;">
        <el-button @click="standardSelectDrawer = false">关 闭</el-button>        
      </div>     
    </el-drawer>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { productSave, domainList, categoryPage } from "@/api/product"
export default {
  components: { Pagination },
  props: ["info"],
  data() {
    return {     
      standardSelectSearch: '',
      standardSelectValue: '',
      standardSelectOption: [],
      standardSelectTlData: [],
      standardSelectDrawer: false,
      loading: false,
      standardSelectState: true,
      categoryId: '',
      tableData:{        
        pageCount: 0, //总页数
        total: 0, // 总条数
        pageSize: 10, //一页大小
        pageNum: 1, // 第几页 从0开始        
       
      },
      
      ruleForm: {
          productName: '',
          standardSelect: '',        
          netType: 1,
          category: '标准品类',
          nodeType: 1,
          dataFormat: 1,
          authType: 1,
          dynRegister: 1,
          description: '', 
          fmTypes: ''        
      },
      rules: {
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          standardSelect:[
            {required: true,message: '请选择标准品类',trigger: 'change'}
          ],
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
  watch: {
    standardSelectValue(val){
      this.getCategoryPage()
    }
  },
  created() {
    domainList().then(res => {
      if(res.code === 200){
          this.standardSelectOption = res.data;
          this.standardSelectOption.unshift({id:'',name:'全部领域'});
          this.standardSelectValue = ''          
      }else {
        this.$message.warning(res.message);
      }
    })
    this.getCategoryPage();
  },
  methods: {
    
    //选择品类
    standardSelectBtn(obj){     
      this.categoryId = obj.id;
      this.ruleForm.standardSelect = `${obj.domainName || ''}/${obj.scene}/${obj.name}`;
      this.standardSelectDrawer = false;
    },
    //搜索品类
    queryProduct(){
      this.tableData.pageNum = 1;
      this.getCategoryPage()
    },
    //分页
     changePage(){      
      this.getCategoryPage()
    },
    getCategoryPage(){
      categoryPage(Object.assign(this.tableData,{domainId: this.standardSelectValue,name: this.standardSelectSearch})).then(res => {
          if(res.code === 200){
            let {data,...pagination} =  res.data;
            this.tableData = pagination;
            this.standardSelectTlData = res.data.data
          }else {
            this.$message.warning(res.message);
          }
      }).catch(err => {
            this.$message.error(err); 
      })
    },
    //提交表单
    submitForm(formName) {        
        var categoryId = null;        
        if(this.ruleForm.category === '标准品类'){           
            categoryId =  this.categoryId;
            this.rules.standardSelect = [
            {required: true,message: '请选择标准品类',trigger: 'change'}
          ]           
        }else{                  
          this.$refs[formName].clearValidate(['standardSelect']); 
          this.rules.standardSelect=[];      
        } 
        this.$refs[formName].validate((valid) => {                    
          if (valid) {               
              this.loading = true;            
              productSave(Object.assign({},this.ruleForm,{categoryId})).then(res => {
                this.loading = false;
                if(res.code === 200){
                  this.$router.push({path: `detail/${res.data.productKey}`})
                }else {
                  this.$message.warning(res.message);
                }
              }).catch(err => {
                this.loading = false;
                this.$message.error(err);  
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
        this.$refs['ruleForm'].clearValidate(['standardSelect']);                 
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
::v-deep .el-drawer{
  outline: none;
  min-width: 510px;
  .el-drawer__header span{
    outline: none;
  }
}


::v-deep .el-drawer__body {
    padding: 20px;
}


.standardSelectInput{
  cursor: pointer;
  ::v-deep input{
    background: #fff!important;
    cursor: pointer !important;
  }
  ::v-deep.el-input__icon{
    cursor: pointer !important;
  }
}


.standardSelectSearch_wrp{
  width: 180px;
  display: inline-block;
  margin-left: 20px;
}


#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
