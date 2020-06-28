<template>
  <div>
    <div class="mt20 mb10 f14"><el-button type="primary" @click="customDialog">定义Topic类</el-button></div>
    <el-table
      :data="customData"
      style="width: 100%"
      :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
      <el-table-column
        prop="topicName"
        label="自定义topic">
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
        <template slot-scope="">
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>          
        </template>
      </el-table-column>

    </el-table>
    <!-- 定义or编辑 topic -->
    <el-dialog title="定义Topic类" :visible.sync="dialogFormVisible">
      <el-form :model="customForm" label-position="top" :rules="customRules">
         <el-form-item label="设备操作权限" prop="operationPermission">
          <el-select v-model="customForm.operationPermission" style="width:100%">
            <el-option label="发布" value="1"></el-option>
            <el-option label="订阅" value="2"></el-option>
            <el-option label="发布和订阅" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Topic类" prop="topicName">
          <div>/a1SYxvAR675/${deviceName}/user/</div>
          <el-input v-model="customForm.topicName" autocomplete="off"></el-input>
        </el-form-item>

         <el-form-item label="描述">           
          <el-input v-model="customForm.describe" autocomplete="off" type="textarea" rows="5" placeholder="请输入描述"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {   
    data() {
      return {
        dialogFormVisible: false,
        customForm: {
          operationPermission: '1',
          topicName: '',
          describe: ''
        },
        customRules: {
          operationPermission: [
            { required: true, message: '请选择设备操作权限', trigger: 'change' }
          ],
          topicName: [
            { required: true, message: '请输入您的Topic类名', trigger: 'blur' },
          ]
        },
        customData: [{
          topicName: '/ota/device/inform/a10LfCPxkMs/${deviceName}',
          pess: '发布',
          des: '撒娇的韩国萨'         
        }]
      
      };
    },   
    methods: {
      //定义topic
      customDialog(){
        this.dialogFormVisible = true;
      }
    }
  };
</script>