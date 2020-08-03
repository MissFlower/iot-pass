<!--
 * @Description: 运行状态
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-03 10:56:24
--> 
<template>
  <div>
    <div class="clearfix">
      <ElSwitch
        v-model="realTimeRefresh"
        inactive-text="实时刷新"
        class="real-time-switch fl"
      />
      
      <div class="fr menu-box">
        <ElRadioGroup v-model="showType" class="menu-type">
          <ElRadioButton label="card">
            <i class="el-icon-menu" />
          </ElRadioButton>
          <ElRadioButton label="table">
            <svg-icon icon-class="table" />
          </ElRadioButton>
        </ElRadioGroup>
        <div class="question-mark">
           <el-popover
              placement="top-start"
              width="300"
              trigger="hover"
              popper-class="custom-runstate-popper"
              content="设备数据上报的最新属性值，点击“查看数据”可以查看指定属性的历史数据">
              <svg-icon icon-class="questionMark" slot="reference" />
            </el-popover>
        </div>
      </div>
    </div>
    <!-- 卡片结构 -->
    <div v-if="showType === 'card'" class="runstate-card-container">
      <RunStateCard v-for="item in 5" :key="item" />
    </div>
    <!-- 表格结构 -->
    <div v-else class="runstate-table-container">
      <ElTable
        :data="tableData"
        border
        style="width: 100%">
        <ElTableColumn
          prop="name"
          label="属性名称"
        />
        <ElTableColumn
          prop="type"
          label="数据类型"
        />
        <ElTableColumn
          prop="updateTime"
          label="更新时间">
          <template slot-scope="{ row }">
            {{ row.updateTime ? row.updateTime : '—'}}
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="updateValue"
          label="更新值"
        />
        <ElTableColumn
          prop="expectedValue"
          label="期望值">
          <template slot-scope="{ row }">
            {{ row.updateValue ? row.updateValue : '--'}}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="操作"
          width="120"
        >
          <template>
            <span class="view-data-text">查看数据</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <!-- 查看数据 -->
    <RunStateDialog
      title="查看数据"
      :visible.sync="runStateDialogVisible"
    />
  </div>
</template>


<script>
  import RunStateCard from './runState/card'
  import RunStateDialog from './runState/runStateDialog'
  export default {
    name:'runState',
    components: {
      RunStateCard,
      RunStateDialog
    },
    data() {
      return {
        realTimeRefresh: false,
        showType: 'card', // 展示方式 可选值：card、table
        tableData: [
          {
            name: '自定义属性',
            type: 'int',
            updateTime: '2020-8-3',
            updateValue: '100',
            expectedValue: '1000'
          },
          
          {
            name: '自定义属性',
            type: 'int',
            updateTime: '',
            updateValue: '',
            expectedValue: ''
          }
        ],
        runStateDialogVisible: false, // 运行状态dialog状态
      }
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<style lang="scss" scoped>
.real-time-switch {
  margin: 16px 0;
}
.menu-box {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .question-mark {
    width: 44px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    cursor: pointer;
    color: rgb(136, 136, 136);
    transition: all ease-out 0.3s;

    &:hover {
      border-color: #737373;
    }

  }
}
.runstate-card-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.view-data-text {
  color: #0070cc;
  cursor: pointer;
} 
</style>
<style>
.custom-runstate-popper {
  padding: 8px 20px;
  color: #111;
  font-size: 12px;
}
</style>
