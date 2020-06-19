<!--
  文件作者：chenxueshan
  创建日期：2020.6.19
  文件说明：日志管理
 -->
<template>
  <div id="log" >
    <!-- 搜索部分 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input
          placeholder="请输入产品key查询"
          prefix-icon="el-icon-search"
          v-model.lazy="productKey">
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
        type="date"
        placeholder="开始时间"
        v-model="startTime">
        </el-date-picker>
      </el-col>
    </el-row>
    <!-- 日志列表 -->
    <log-list v-if="flag == 0" :data="listData" :loading="loading" @getList="getList"></log-list>
    <!-- 分页-->
    <pagination :data="tableData" @pagination="changePage"/>
  </div>
</template>

<script>
  import logList from "./children/list";
  import Pagination from "@/components/Pagination"
  import { tableList } from "@/api/log"

  export default {
    components: { logList , Pagination},
    data() {
      return {
        productKey:'', //产品key
        logType:1,    //日志类型：1:设备行为分析 2:物模型数据分析 3:上行消息分析 4:下行消息分析
        deviceName:'', //设备名称
        keyword:'',    //关键字
        startTime:'',  //开始时间
        endTime:'',    //截止时间
        messageId:'',  //消息id
        status:'',     //上下行状态 1:成功 2:失败
        flag: 0,
        listData:[],
        tableData:{
          pageCount: 0,  //总页数
          total: 0,      //总条数
          pageSize: 10,  //每页条数
          pageNum: 1,    //页码 从0开始
        },
        loading:false
      }
    },
    watch: {
      productKey: function(key) {
        console.log(key);
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //获取日志列表
      getList(){
        this.loading = true;
        tableList(Object.assign(this.tableData, {
          productKey:this.productKey,
          logType:this.logType,
          deviceName:this.deviceName,
          keyword:this.keyword,
          startTime:this.startTime,
          endTime:this.endTime,
          messageId:this.messageId,
          status:this.status
        }))
        .then(res => {
          setTimeout(() => { this.loading = false; },1000);
          if(res.code === 200){
            let {data,...pagination} =  res.data;
            this.tableData = pagination;
            this.listData = res.data.list;
          }else{
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error('获取日志列表失败！');
        })
      },
      //分页
      changePage(){
        this.getList()
      }
    }
  };
</script>

<style lang="scss" scoped>
   #log { padding: 20px; }
  .search_box{
    display: inline-block;
    margin-right: 20px;
  }


   .el-col {
     border-radius: 4px;
   }
   .bg-purple-dark {
     background: #99a9bf;
   }
   .bg-purple {
     background: #d3dce6;
   }
   .bg-purple-light {
     background: #e5e9f2;
   }
   .grid-content {
     border-radius: 4px;
     min-height: 36px;
   }
</style>
