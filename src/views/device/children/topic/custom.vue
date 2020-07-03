<template>
  <div v-loading="loading">
    <div class="mt20 mb20 f14">自定义Topic</div>
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
  </div>
</template>

<script>
  import { topicCustomList } from '@/api/deviceRequest'
  import Pagination from "@/components/Pagination"
  export default { 
    props: ['deviceObj'],
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
    mounted() {
      this.customList()
    },
    methods: {
      //列表数据
      customList(){
        this.loading = true;
        topicCustomList(Object.assign(this.tableData, this.deviceObj)).then(res => {
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

      changePage(){
        this.customList();
      }
    }
  };
</script>