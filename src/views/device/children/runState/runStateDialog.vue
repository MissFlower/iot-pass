<!--
 * @Description: 运行状态dialog
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 10:46:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-03 17:29:00
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
            v-for="item in TIME_TYPE"
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
        />
        <ElRadioGroup v-model="showType" class="dialog-menu-type">
          <ElRadioButton label="chart" :disabled="isShowChart">
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
import { TIME_TYPE } from '@/data/constants'
export default {
  name: 'RunStateDialog',
  components: {
    AttributedChart
  },
  props: {
    isShowChart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TIME_TYPE,
      timeRange: 1,
      showType: this.isShowChart ? 'table' : 'chart', // 展示类型chart、table 默认值chart图表展示
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
