<!--
 * @Description: 图表展示
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 11:28:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-17 15:04:23
-->
<template>
  <div id="echart" v-bind="$attrs" class="echart-container" />
  <!-- <div style="width: 100%;height:100%">
    <ElButton @click="restore">还原</ElButton>
  </div> -->

</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/dataZoom')
import resize from './mixins/resize'
export default {
  name: 'AttributedChart',
  mixins: [resize],
  props: {
    /**
     * @description: 图表数据 必传项
     * @type Object
     * @数据结构 {dataList: [], dateList: []}
     */
    chartData: {
      type: Object,
      required: true
    },
    /**
     * @description: 数据缩放 非必传项
     * @type Boolean
     * @参考值 true | false
     */
    dataZoom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      echartInstance: null
    }
  },
  watch: {
    chartData: {
      handler(newValue) {
        console.log(newValue)
        this.drawChart(newValue)
      },
      deep: true
    },
    dataZoom(newValue) {
      this.addAndRemoveDataZoom(newValue)
    }
  },
  mounted() {
    // console.log('初始化')
    this.initChart()
  },
  beforeDestroy() {
    if (!this.echartInstance) {
      return
    }
    this.echartInstance.dispose()
    this.echartInstance = null
  },
  methods: {
    initChart() {
      // 初始化echarts实例
      if (!this.echartInstance) {
        this.echartInstance = echarts.init(document.getElementById('echart'))
        this.echartInstance.setOption(this.getOptions({ dataList: [], dateList: [] }), true) // 默认为 false，即合并
        this.rewriteLengendHandler()
      }
    },
    drawChart({ dataList, dateList }) {
      // 渲染图表
      // this.echartInstance.clear()
      this.echartInstance.setOption({
        xAxis: [{
          data: dateList
        }],
        series: [{
          data: dataList
        }]
      }, false, true)
    },
    getOptions({ dataList, dateList }) {
      // 图表配置
      return {
        tooltip: {
          trigger: 'axis',
          // padding: 0,
          formatter: function(params) {
            const content = `
              <div style="padding:5px 10px;">
                <div>${params[0].data.timeLabel}</div>
                <div style="display:flex;justify-content:space-between;margin-top:5px;">
                  <div>
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span>
                    <span>value</span>
                  </div>
                  <span style="display:inline-block;margin-left:20px;">${params[0].value}</span>
                </div>
              </div>
            `
            return content
          }
        },
        legend: {
          data: [this.$attrs.lengend],
          orient: 'horizontal',
          x: 'center',
          y: 'bottom',
          textStyle: {
            color: '#000',
            lineHeight: 18,
            height: 18,
            padding: [3, 0, 0, 0]
          },
          icon: 'circle',
          itemWidth: 8, // icon的宽
          itemHeight: 12 // icon的高
        },
        toolbox: {
          show: true,
          itemSize: 0,
          showTitle: false,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: '10px',
          left: '14px',
          right: '36px',
          bottom: '30px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dateList
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          min: 15,
          max: 30
        },
        series: [
          {
            name: this.$attrs.lengend,
            type: 'line',
            data: dataList,
            // step: true,
            symbol: 'circle',
            symbolSize: 8,
            animation: true,
            smooth: false, // 是否平滑展示
            // sampling: 'average',
            lineStyle: {
              color: '#409EFF',
              width: 1
            },
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
    },
    rewriteLengendHandler() {
      // 重写echarts图例事件
      this.echartInstance.on('legendselectchanged', (params) => {
        this.echartInstance.setOption({
          legend: { selected: { [params.name]: true }}
        })
      })
    },
    addAndRemoveDataZoom(boolean) {
      // 添加或删除 dataZoom
      console.log(boolean)
      this.echartInstance.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: boolean
      })
      this.echartInstance.setOption({
        dataZoom: [{
          type: 'inside',
          xAxisIndex: 0,
          zoomOnMouseWheel: boolean
        }]
      })
    },
    restore() {
      this.echartInstance.dispatchAction({
        type: 'restore'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>
