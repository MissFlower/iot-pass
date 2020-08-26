<!--
 * @Description: 图表展示
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 11:28:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-26 20:45:39
-->
<template>
  <div>
    <ChartDownLoad :instance="echartInstance" />
    <div id="echart" v-bind="$attrs" class="echart-container" />
  </div>
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
import resize from '../mixins/resize'
import ChartDownLoad from '../ChartDownLoad'
export default {
  name: 'Chart',
  components: {
    ChartDownLoad
  },
  mixins: [resize],
  props: {
    /**
     * @description: 图表数据 必传项
     * @type Object
     * @数据结构 {dataList: [], dateList: []}
     */
    chartData: {
      // type: Object,
      type: Array,
      required: true
    },
    /**
     * @description: 图例 必传项
     * @type Boolean
     * @参考值 true | false
     */
    legend: {
      type: Array,
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
      echartInstance: null,
      operationTime: 0,
      operationLegend: ''
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
    // drawChart({ dataList, dateList }) {
    drawChart(datas) {
      // 渲染图表
      // this.echartInstance.clear()
      const handleDataList = datas.map(item => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          // step: true,
          symbol: 'circle',
          symbolSize: 8,
          animation: true,
          smooth: false, // 是否平滑展示
          // sampling: 'average',
          lineStyle: {
            // color: '#409EFF',
            width: 1
          },
          itemStyle: {
            // color: '#409EFF'
          }
        }
      })
      console.log(handleDataList)

      this.echartInstance.setOption({
        // xAxis: [{
        //   data: dateList
        // }],
        series: [...handleDataList]
      })
    },
    // getOptions({ dataList, dateList }) {
    getOptions({ dataList, dateList }) {
      // 图表配置
      console.log(111, this.legend)
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
          data: this.$attrs.legend,
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
          // type: 'category',
          type: 'time',
          boundaryGap: false
          // data: dateList
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: []
      }
    },
    rewriteLengendHandler() {
      // 重写echarts图例事件
      this.echartInstance.on('legendselectchanged', (params) => {
        // this.echartInstance.setOption({
        //   legend: { selected: { [params.name]: true }}
        // })
        const { selected, name } = params
        if (this.operationLegend === name && (Date.now() - this.operationTime) < 300) {
          // 双击
          console.log('当前Legend被双击了')
        }
        this.operationLegend = name
        this.operationTime = Date.now()
        // 点击的时候只有当前一个legend是被选中的话 开启全选
        Object.keys(selected).forEach(key => {
          console.log(key === name)
          selected[key] = key === name
        })
        // let first = true
        // if (first && selected) {
        //   Object.keys(selected).forEach(key => {
        //     selected[key] = key === name
        //   })
        //   first = false
        // } else {
        //   const open = selected[name]
        //   selected[name] = open
        // }
        // this.echartInstance.setOption({
        //   legend: {
        //     selected
        //   }
        // })
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
  height: calc(100% - 32px);
}
</style>
