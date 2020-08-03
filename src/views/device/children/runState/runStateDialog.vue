<!--
 * @Description: 运行状态dialog
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 10:46:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-03 14:29:25
--> 
<template>
  <ElDialog
    v-bind="$attrs"
    width="50%"
    :before-close="closeDialog"
  >
    <div>
      <div class="dialog-body-header">
        <ElSelect v-model="timeRange" placeholder="请选择" class="dialog-select">
          <ElOption
            v-for="item in timeType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </ElOption>
        </ElSelect>
        <ElDatePicker
          v-if="timeRange === 0"
          v-model="curtomTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="dialog-date"
        >
        </ElDatePicker>
        <ElRadioGroup v-model="showType" class="dialog-menu-type">
          <ElRadioButton label="chart">
            图表
          </ElRadioButton>
          <ElRadioButton label="table">
            表格
          </ElRadioButton>
        </ElRadioGroup>
      </div>
      <div class="dialog-body-content">
        <!-- 图表 -->
        <AttributedChart
          v-if="showType === 'chart'"
          :params="timeRange"
        />
        <!-- 表格 -->
        <div
          v-else
          class="runstate-table-container"
        >
          <ElTable
            :data="tableData"
            border
            height="350"
            style="width: 100%">
            <ElTableColumn
              prop="time"
              label="时间"
              width="200"
            />
            <ElTableColumn
              prop="originalValue"
              label="原始值"
            />
          </ElTable>
        </div>
      </div>
    </div>
    <span slot="footer">
      <ElButton @click="closeDialog">关 闭</ElButton>
    </span>
  </ElDialog>

</template>

<script>
import AttributedChart from './attributedChart'
const timeType = [
  {
    label: '1小时',
    value: 1
  },
  {
    label: '24小时',
    value: 24
  },
  {
    label: '7天',
    value: 168
  },
  {
    label: '自定义',
    value: 0
  }
]
export default {
  name: 'RunStateDialog',
  components: {
    AttributedChart
  },
  data() {
    return {
      timeType,
      timeRange: 1,
      showType: 'chart', // 展示类型chart、table 默认值chart图表展示
      curtomTime: '', // 自定义时间
      tableData: [
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
        {
          time: '2020-8-3',
          originalValue: '100',
        },
        {
          time: '2020-8-2',
          originalValue: '150',
        },
      ]
    }
  },
  mounted() {
    console.log(111)
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-body-header {
  display: flex;
  justify-content: space-between;
  .dialog-select {
    width: 150px;
  }
  .dialog-date {
    flex: 1;
    margin-left: 10px;
    margin-right: 50px;
  }
  .dialog-menu-type {
    width: 120px;
  }
}
.dialog-body-content {
  height: 350px;
  margin-top: 20px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
