<!--
  文件作者：chenxueshan
  创建日期：2020.6.19
  文件说明：日志管理
 -->
<template>
  <div id="log" >
    <!-- 搜索部分 -->
    <el-form :inline="true" :model="formInline" size="mini">
      <el-form-item>
        <el-input v-model="formInline.productKey" class="searchInput" placeholder="产品key查询">
          <span slot="suffix">
            <i class="el-icon-search hand" @click="search"></i>
            <i class="el-icon-close hand" v-if="formInline.productKey != ''" @click="clearFun('productKey')"></i>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.logType" placeholder="日志类型">
          <el-option label="设备行为分析" value="1"></el-option>
          <el-option label="物模型数据分析" value="2"></el-option>
          <el-option label="上行消息分析" value="3"></el-option>
          <el-option label="下行消息分析" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.deviceName" class="searchInput" placeholder="设备名称">
          <span slot="suffix">
            <i class="el-icon-search hand" @click="search"></i>
            <i class="el-icon-close hand" v-if="formInline.deviceName != ''" @click="clearFun('deviceName')"></i>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.keyword" class="searchInput" placeholder="关键字">
          <span slot="suffix">
            <i class="el-icon-search hand" @click="search"></i>
            <i class="el-icon-close hand" v-if="formInline.keyword != ''" @click="clearFun('keyword')"></i>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker type="datetime" v-model="formInline.startTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker type="datetime" v-model="formInline.endTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="截止时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.messageId" class="searchInput" placeholder="消息id">
          <span slot="suffix">
            <i class="el-icon-search hand" @click="search"></i>
            <i class="el-icon-close hand" v-if="formInline.messageId != ''" @click="clearFun('messageId')"></i>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" placeholder="上下行状态">
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 日志列表 -->
    <log-list v-if="flag == 0" :data="listData" :loading="loading" @getList="getList"></log-list>
    <!-- 分页 -->
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
        formInline:{
          productKey:'', //产品key
          logType:'1',   //日志类型：1:设备行为分析 2:物模型数据分析 3:上行消息分析 4:下行消息分析
          deviceName:'', //设备名称
          keyword:'',    //关键字
          startTime:'',  //开始时间
          endTime:'',    //截止时间
          messageId:'',  //消息id
          status:''      //上下行状态 1:成功 2:失败
        },
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
    created() {
      this.getList();
    },
    methods: {
      //获取日志列表
      getList(){
        this.loading = true;
        tableList(Object.assign(this.tableData, this.formInline))
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
            this.$message.error('获取日志列表失败！');
          })
      },
      //分页
      changePage(){
        this.getList()
      },
      clearFun (key) {
        this.formInline[key] = ''
        this.search()
      },
      //搜索
      search(event){
        this.tableData.pageNum = 1;
        this.getList();
      },
      //重置
      reset(event){
        for (var key in this.formInline) {
          this.formInline[key] = key == "logType" ? "1" : "";
        }
        this.search();
      }
    }
  };
</script>

<style lang="scss" scoped>
  #log { padding: 20px; }
</style>
