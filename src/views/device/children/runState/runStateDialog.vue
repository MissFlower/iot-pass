<!--
 * @Description: 运行状态dialog
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 10:46:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-07 18:52:21
-->
<template>
  <ElDialog v-bind="$attrs" width="50%" :before-close="closeDialog">
    <div>
      <div class="dialog-body-header">
        <ElSelect v-model="timeRange" placeholder="请选择" class="dialog-select" @change="chooseTime">
          <ElOption
            v-for="item in TIME_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElDatePicker
          v-if="timeRange === 0"
          v-model="customTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :clearable="false"
          class="dialog-date"
          @change="getCustomTime"
        />
        <ElRadioGroup v-model="showType" class="dialog-menu-type" @change="typeChange">
          <ElRadioButton label="chart" :disabled="isShowChart">
            图表
          </ElRadioButton>
          <ElRadioButton label="table">
            表格
          </ElRadioButton>
        </ElRadioGroup>
      </div>
      <div v-loading="loading" class="dialog-body-content">
        <!-- 图表 -->
        <AttributedChart
          v-if="showType === 'chart'"
          :data="{dataList, dateList}"
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
            style="width: 100%"
          >
            <ElTableColumn
              prop="time"
              label="时间"
              width="200"
            />
            <ElTableColumn
              prop="value"
              label="原始值"
            />
          </ElTable>
          <ElButton v-if="isShowLoadMoreBtn" class="load-more-button" @click="loadMore">加载更多</ElButton>
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
import { getTableData } from '@/api/deviceRequest'
import { parseTime } from '@/utils'
export default {
  name: 'RunStateDialog',
  components: {
    AttributedChart
  },
  props: {
    isShowChart: {
      type: Boolean,
      default: false
    },
    identifier: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      TIME_TYPE,
      timeRange: 1,
      showType: this.isShowChart ? 'table' : 'chart', // 展示类型chart、table 默认值chart图表展示
      customTime: '', // 自定义时间
      tableData: [
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        },
        {
          time: '2020-8-3',
          originalValue: '100'
        },
        {
          time: '2020-8-2',
          originalValue: '150'
        }
      ],
      loading: false, // loading 状态
      isShowLoadMoreBtn: false, // loadMore按钮状态
      dataList: [], // 图表数据list
      dateList: [], // 图表时间list
      startTime: '', // 开始时间
      tmpEndTime: '' // 表格每次请求后的时间
    }
  },
  mounted() {
    this.chooseTime(this.timeRange)
  },
  methods: {
    chooseTime(value) {
      // 选择时间范围 转换 startTime endTime 除自定义之外
      this.initData()
      const endTime = new Date().getTime()
      this.startTime = endTime - ((value || 7 * 24) * 60 * 60 * 1000)
      if (!value) {
        this.customTime = [this.startTime, endTime]
      }
      this.getTableData({
        startTime: this.startTime,
        endTime
      })
    },
    getTableData({ startTime, endTime }) {
      const data = {
        'nextValid': true,
        'nextTime': '1596526007139',
        'propertyInfo': [{
          'value': '10',
          'time': '1596526007139'
        }, {
          'value': '20',
          'time': '1596536007139'
        }, {
          'value': '15',
          'time': '1596546007139'
        }, {
          'value': '25',
          'time': '1596556007139'
        }]
      }
      if (this.showType === 'chart') {
        // 图表数据处理
        data.propertyInfo.forEach(item => {
          this.dataList.push(item.value)
          this.dateList.push(parseTime(item.time, '{m}/{d} {h}:{i}'))
        })
      } else {
        // table表格
        const tmp = []
        data.propertyInfo.forEach(item => {
          const newTime = item.time.substring(0, 10) + '000'
          tmp.push({
            time: parseTime(newTime) + '.' + item.time.slice(-3),
            value: item.value
          })
        })
        this.tableData.push(...tmp)
      }
      // 获取表格图表数据
      this.loading = true
      getTableData({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName,
        identifier: this.identifier,
        startTime,
        endTime,
        pageSize: this.showType === 'chart' ? 100 : 20
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            // 成功处理
            if (this.showType === 'chart') {
              // 图表数据处理
              res.data.propertyInfo.forEach(item => {
                this.dataList.push(item.value)
                this.dateList.push(parseTime(item.time))
              })
              if (res.data.nextValid) {
              // 再次调用
                this.getTableData({
                  startTime,
                  endTime: res.data.nextTime
                })
              }
            } else {
              // table表格
              const tmp = []
              data.propertyInfo.forEach(item => {
                const newTime = item.time.substring(0, 10) + '000'
                tmp.push({
                  time: parseTime(newTime) + '.' + item.time.slice(-3),
                  value: item.value
                })
              })
              this.tableData.push(...tmp)
              this.isShowLoadMoreBtn = !!res.data.nextValid
              this.tmpEndTime = res.data.nextTime
            }
          }
          this.$message({
            type: res.code === 200 ? 'success' : 'warning',
            message: res.message
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getCustomTime() {
      // 自定义时间处理
      console.log(this.customTime)
      this.initData()
      this.getTableData({
        startTime: this.customTime[0],
        endTime: this.customTime[1]
      })
    },
    typeChange() {
      // 图表和表格切换事件处理 初始化值
      this.initData()
      this.chooseTime(this.timeRange)
    },
    initData() {
      // 初始化数据
      this.dataList = []
      this.dateList = []
      this.tableData = []
      this.startTime = ''
      this.tmpEndTime = ''
    },
    loadMore() {
      // 表格加载更多
      this.getTableData({
        startTime: this.startTime,
        endTime: this.tmpEndTime
      })
    },
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

  .runstate-table-container {
    text-align: center;
  }

  .load-more-button {
    margin-top: 5px;
  }
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
