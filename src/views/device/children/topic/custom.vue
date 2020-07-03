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
        prop="topicAccessStr"
        label="设备具有的权限"
        width="200">
      </el-table-column>

      <el-table-column
        prop="topicDescribe"
        label="描述">
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
    props: ['customObj'],
    components: {
      Pagination
    },  
    data() {
      return {
        loading: false,
        productKey: this.$route.params.key,
        customData: [],    
        tableData:{        
          pageCount: 0, //总页数
          total: 0, // 总条数
          pageSize: 10, //一页大小
          pageNum: 1, // 第几页 从0开始        
        },
      };
    },   

    watch: {
      customObj(obj){
        this.customList();
      }
    }, 
    methods: {
      //列表数据
      customList(){
        this.loading = true;
        topicCustomList(Object.assign(this.tableData, this.customObj)).then(res => {
          this.loading = false;
          if(res.code === 200){
            let {data,...pagination} =  res.data;
            this.tableData = pagination;
            var list = res.data.data;

            //topic权限
            let topicAccessDict = {'1':'订阅','2':'发布','3':'订阅+发布'};
            var newList = list.map(function(value) {
              if(value.topicAccess != null){
                value.topicAccessStr = topicAccessDict[value.topicAccess.toString()];
              }
              return value;
            });

            this.customData = newList;   
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