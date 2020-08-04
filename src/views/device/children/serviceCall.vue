<!--
 * @Description: 服务调用
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-03 17:58:08
--> 

<template>
  <div style="padding-top: 10px;">
    <!-- 搜索部分 -->
    <ElForm
      ref="form"
      :inline="true"
      :model="formInline"
      size="mini"
    >
      <ElFormItem prop="tags">
        <ElInput
          v-model="formInline.tags"
          clearable
          prefix-icon="el-icon-search"
          placeholder="请输入服务标识符"
        />
      </ElFormItem>
      <ElFormItem prop="timeRange">
        <ElSelect
          v-model="formInline.timeRange"
          placeholder="请选择"
          class="dialog-select"
        >
          <ElOption
            v-for="item in TIME_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="timeRange">
        <ElDatePicker
          v-if="formInline.timeRange === 0"
          v-model="formInline.curtomTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="dialog-date"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="search">查询</ElButton>
        <ElButton @click="reset">重置</ElButton>
      </ElFormItem>
    </ElForm>
    <!-- 列表 -->
    <ElTable 
      :data="listData"
      border
      v-loading="loading"
    >
      <ElTableColumn
        label="时间"
        prop="time"
      >
      </ElTableColumn>
      <ElTableColumn
        label="标识符"
        prop="time"
      >
      </ElTableColumn>
      <ElTableColumn
        label="服务名称"
        prop="time"
      >
      </ElTableColumn>
      <ElTableColumn
        label="输入参数"
        prop="time"
      >
      </ElTableColumn>
      <ElTableColumn
        label="输出参数"
        prop="time"
      >
      </ElTableColumn>
    </ElTable>
    <!-- 分页 -->
    <pagination
      :data="tableData"
      @pagination="changePage"
    />
  </div>
</template>


<script>
import Pagination from "@/components/Pagination"
import { serviceCall } from "@/api/deviceRequest"
import { TIME_TYPE } from '@/data/constants'

export default {
  name:'serviceCall',
  components: {
    Pagination
  },
  data() {
    return {
      formInline: {
        tags:'',      // 查询标签
        timeRange: 1,  // 时间范围
        curtomTime: '', // 自定义时间
      },
      TIME_TYPE, // 时间范围类型
      listData: [],
      tableData: {
        pageCount: 0,  // 总页数
        total: 0,      // 总条数
        pageSize: 10,  // 每页条数
        pageNum: 1,    // 页码 从0开始
      },
      loading: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取服务调用列表
    getList(){
      this.loading = true;
      serviceCall(Object.assign(this.tableData, this.formInline))
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
          this.$message.error('获取服务调用失败！');
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
      this.$refs['form'] .resetFields()
      this.search();
    }
  }
}
</script>
