<!--
 * @Description: 运行状态dialog
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 10:46:51
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-18 18:23:50
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
          :picker-options="pickerOptions"
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
      <div class="dialog-body-content">
        <!-- 图表 -->
        <AttributedChart
          v-show="showType === 'chart' && showHideNoData"
          ref="chart"
          v-bind="$attrs"
          :chart-data="echartData"
          :data-zoom="dataZoom"
        />
        <!-- 表格 -->
        <div
          v-show="showType === 'table' && showHideNoData"
          class="runstate-table-container"
        >
          <ElTable
            :data="tableData"
            border
            height="330"
            width="100%"
            style="width: 100%"
          >
            <ElTableColumn
              prop="time"
              label="时间"
              width="200"
            >
              <template slot-scope="{ row }">
                {{ !row.time ? "—" : row.time | parseMillTime }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="value"
              label="原始值"
            />

          </ElTable>
          <div class="load-more-container">
            <ElButton v-show="isShowLoadMoreBtn" @click="loadMore">加载更多</ElButton>
          </div>
        </div>

        <div v-show="!showHideNoData" class="defalut-graph-box">
          <DeafultGraph icon-class="empty1" text="暂无数据" />
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
import { parseTime, deepFreeze } from '@/utils'
import DeafultGraph from '@/components/DeafultGraph'
export default {
  name: 'RunStateDialog',
  components: {
    AttributedChart,
    DeafultGraph
  },
  props: {
    /**
     * @description: 图表功能是否可用 非必传项
     * @type Boolean
     * @参考值 true | false
     */
    isShowChart: {
      type: Boolean,
      default: false
    },
    /**
     * @description: 唯一标识 必传项
     * @type String
     * @参考值 xxxxx
     */
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
      tableData: [],
      loading: false, // loading 状态
      isShowLoadMoreBtn: false, // loadMore按钮状态
      echartData: {
        dataList: [], // 图表数据list
        dateList: [] // 图表时间list
      },
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      // tmpEndTime: '', // 表格每次请求后的时间
      showHideNoData: true, // 是否有数据
      chartCount: 0, // 统计chart请求次数
      dataZoom: false // 是否使用dataZoom
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (date) => {
          const nowDate = new Date()
          const day = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0).getDate()
          return (date.getTime() < Date.now() - day * 24 * 60 * 60 * 1000) || (date.getTime() > Date.now())
        }
      }
    }
  },
  beforeDestroy() {
    this.getTableData = null
  },
  mounted() {
    this.chooseTime(this.timeRange)
  },
  methods: {
    chooseTime(value) {
      // 选择时间范围 转换 startTime endTime 除自定义之外
      this.initData()
      this.endTime = new Date().getTime()
      this.startTime = this.endTime - ((value || 7 * 24) * 60 * 60 * 1000)
      if (!value) {
        this.customTime = [this.startTime, this.endTime]
      }
      this.getTableData()
    },
    getTableData(isLoadMore) {
      // 获取表格图表数据
      this.loading = true
      getTableData({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName,
        identifier: this.identifier,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.showType === 'chart' ? 100 : 20
      })
        .then(res => {
          if (res.code === 200) {
            // 成功处理
            const data = res.data.propertyInfo
            this.showHideNoData = !!data
            if (!this.showHideNoData) {
              return
            }
            if (this.showType === 'chart') {
              // 图表数据处理
              this.chartCount += 1
              this.dataZoom = !!(this.chartCount > 2)
              // console.log(this.chartCount)
              const dataList = []
              const dateList = []
              data.forEach(item => {
                dataList.unshift({
                  value: item.value,
                  timeLabel: parseTime(item.timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
                })
                dateList.unshift(parseTime(item.timestamp, '{m}/{d} {h}:{i}'))
                // this.echartData.dataList.push(item.value)
                // this.echartData.dateList.push(parseTime(item.timestamp, '{m}/{d} {h}:{i}'))
              })
              this.echartData.dataList.unshift(...dataList)
              this.echartData.dateList.unshift(...dateList)
              // console.log('调用画图')
              // this.$refs.chart.drawChart(this.echartData)
              if (res.data.nextValid) {
              // 再次调用
                this.endTime = res.data.nextTime
                this.getTableData()
              }
            } else {
              // table表格
              if (!isLoadMore) {
                this.tableData = []
              }
              data.map(item => {
                // console.log(item)
                this.tableData.push(deepFreeze({
                  time: item.timestamp,
                  value: item.value
                }))
              })
              this.isShowLoadMoreBtn = !!res.data.nextValid
              this.endTime = res.data.nextTime
            }
            this.loading = false
          } else {
            this.showHideNoData = false
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getCustomTime() {
      // 自定义时间处理
      // console.log(this.customTime)
      if (!this.loading) {
        this.initData()
        this.startTime = this.customTime[0]
        this.endTime = this.customTime[1]
        this.getTableData()
      }
    },
    typeChange() {
      // 图表和表格切换事件处理 初始化值
      this.initData()
      this.chooseTime(this.timeRange)
    },
    initData() {
      // 初始化数据
      this.tableData = []
      this.echartData = {
        dataList: [],
        dateList: []
      }
      this.startTime = ''
      this.endTime = ''
      this.chartCount = 0
    },
    loadMore() {
      // 表格加载更多
      this.getTableData(true)
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
  display: flex;
  justify-content: center;
  align-items: center;

  .runstate-table-container {
    width: 100%;
    text-align: center;
  }

  .load-more-container {
    margin-top: 5px;
    height: 32px;
  }
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
