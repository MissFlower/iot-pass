<!-- 
  文件作者：chenxueshan
  创建日期：2020.6.28
  文件说明：物模型数据-事件管理
 -->
<template>
  <div style="padding-top: 10px;">
    <!-- 搜索部分 -->
    <el-form :inline="true" :model="formInline" size="mini">
      <el-form-item>
        <el-input v-model="formInline.tags" clearable prefix-icon="el-icon-search" placeholder="请输入查询标签"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.fileds" clearable prefix-icon="el-icon-search" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker type="datetime" v-model="formInline.startTime" value-format="timestamp" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker type="datetime" v-model="formInline.endTime" value-format="timestamp" placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="listData" border v-loading="loading">
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="标识符" prop="time"></el-table-column>
      <el-table-column label="事件名称" prop="time"></el-table-column>
      <el-table-column label="事件类型" prop="time"></el-table-column>
      <el-table-column label="输出参数" prop="time"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :data="tableData" @pagination="changePage"/>
  </div>
</template>


<script>
  import Pagination from "@/components/Pagination"
  import { eventManage } from "@/api/deviceRequest"

  export default {
    name:'eventManage',
    components: { Pagination },
    data() {
      return {
        formInline: {
          tags:'',      //查询标签
          fileds:'',    //关键字
          startTime:'', //开始时间
          endTime:''    //截止时间
        },
        listData:[],
        tableData:{
          pageCount: 0,  //总页数
          total: 0,      //总条数
          pageSize: 10,  //每页条数
          pageNum: 1,    //页码 从0开始
        },
        loading:false
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      //获取事件管理列表
      getList(){
        this.loading = true;
        eventManage(Object.assign(this.tableData, this.formInline))
          .then(res => {
            this.loading = false;
            if(res.code === 200){
              this.tableData.pageNum = res.data.pageNum;
              this.tableData.total = res.data.total;
              res.data.pageSize !== 0 && (this.tableData.pageSize = res.data.pageSize);
              this.listData = res.data.list;
            }else{
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.error('获取事件管理失败！');
          })
      },
      //分页
      changePage(){
        this.getList()
      },
      //搜索
      search(event){
        this.tableData.pageNum = 1;
        this.getList();
      },
      //重置
      reset(event){
        for (var key in this.formInline) {
          this.formInline[key] = "";
        }
        this.search();
      }
    }
  };
</script>
