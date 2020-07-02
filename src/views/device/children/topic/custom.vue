<template>
  <div v-loading="loading">
    <div class="mt20 mb10 f14"><el-button type="primary" @click="customDialog">定义Topic类</el-button></div>
    <el-table
      :data="customData"
      style="width: 100%"
      :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
      <el-table-column
        prop="topicName"
        label="自定义topic">
        <template slot-scope="scope">
          /{{scope.row.productKey}}/${deviceName}/user/{{scope.row.topicName}}
        </template>
      </el-table-column>

      <el-table-column
        prop="pess"
        label="操作权限"
        width="100">
      </el-table-column>

      <el-table-column
        prop="des"
        label="描述">
      </el-table-column>

       <el-table-column       
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editTopic(scope.row)" class="mr20">编辑</el-button>          
          <el-popconfirm
            title="确定要删除Topic类吗？>"
            @onConfirm="deleteTopic(scope.row.topicId)"
            >
            <el-button type="text" slot="reference">删除</el-button>    
            
          </el-popconfirm>       
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页-->
    <pagination :data="tableData" @pagination="changePage" class="tr"/>
    <!-- 定义or编辑 topic -->
    <el-dialog title="定义Topic类" :visible.sync="dialogFormVisible">
      <el-form ref="customDialog" :model="customForm" label-position="top" :rules="customRules">
         <el-form-item label="设备操作权限" prop="topicAccess">
          <el-select v-model="customForm.topicAccess" style="width:100%">
            <el-option label="发布" :value="1"></el-option>
            <el-option label="订阅" :value="2"></el-option>
            <el-option label="发布和订阅" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Topic类" prop="topicName">
          <div>/{{productKey}}/${deviceName}/user/</div>
          <el-input v-model="customForm.topicName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述">           
          <el-input v-model="customForm.topicDescribe" autocomplete="off" type="textarea" rows="5" placeholder="请输入描述"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomForm('customDialog')">取 消</el-button>
        <el-button type="primary" @click="submitTopic" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { topicCustomEdit, topicDelete, topicCustomList } from '@/api/deviceRequest'
  import Pagination from "@/components/Pagination"
  export default { 
    components: {
      Pagination
    },  
    data() {
      return {
        loading: false,
        submitTopicId: '',
        dialogFormVisible: false,
        productKey: this.$route.params.key,
        customForm: {
          topicAccess: 1,
          topicName: '',
          topicDescribe: ''
        },
        customData: [],
        customRules: {
          topicAccess: [
            { required: true, message: '请选择设备操作权限', trigger: 'change' }
          ],
          topicName: [
            { required: true, message: '请输入您的Topic类名', trigger: 'blur' },
          ]
        },       
         tableData:{        
          pageCount: 0, //总页数
          total: 0, // 总条数
          pageSize: 10, //一页大小
          pageNum: 1, // 第几页 从0开始        
        },
      
      };
    },   
    created() {
      this.customList()
    },
    methods: {
      //编辑topic
      editTopic(row){
        this.dialogFormVisible = true;
        console.log(row)
        this.customForm.topicAccess = row.topicAccess;
        this.customForm.topicName = row.topicName;
        this.customForm.topicDescribe = row.topicDescribe || '';
        this.submitTopicId = row.topicId;
      },
      //定义topic
      customDialog(){
        this.dialogFormVisible = true;
        this.submitTopicId = '';
        this.$nextTick(()=>{
          this.$refs['customDialog'].resetFields()
        })
      },
      //取消自定义弹窗
      cancelCustomForm(formName){
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields()
      },
      //删除topic
      deleteTopic(topicId){
        topicDelete({topicId, productKey: this.productKey}).then(res => {
            if(res.code === 200){
               this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.customList()
            }
        }).catch(err => {

        })
      },
      //列表数据
      customList(){
        this.loading = true;
        topicCustomList(Object.assign(this.tableData, {productKey: this.productKey})).then(res => {
          this.loading = false;
          if(res.code === 200){
            let {data,...pagination} =  res.data;
            this.tableData = pagination;
            this.customData = res.data.data;     
          }
        }).catch(err => {
          this.loading = false;
        })
      },
      //自定义topic新增、编辑
      submitTopic(id){
        var obj = {};
        console.log(this.submitTopicId)
        if(this.submitTopicId){
          obj = Object.assign({},obj,{topicId: this.submitTopicId})
        }
               
        this.$refs['customDialog'].validate((valid) => {                    
          if (valid) {               
              this.loading = true;            
              topicCustomEdit(Object.assign({},obj,{productKey: this.productKey},this.customForm)).then(res => {
                this.loading = false;
                if(res.code === 200){
                  this.customList();
                  this.dialogFormVisible = false;
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
       //分页
      changePage(){      
        this.customList()
      },
    }
  };
</script>