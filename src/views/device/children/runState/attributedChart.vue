<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 11:28:30
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-05 17:26:07
-->
<template>
  <div id="echart" class="echart-container" />
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
import resize from './mixins/resize'
export default {
  name: 'AttributedChart',
  mixins: [resize],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      echartInstance: null
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        console.log(newValue)
        if (newValue) {
          // 调用后台接口函数
          console.log(newValue)
          this.initChart(newValue)
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.echartInstance) {
      return
    }
    this.echartInstance.dispose()
    this.echartInstance = null
  },
  methods: {
    initChart(data) {
      // 初始化echarts实例
      if (!this.echartInstance) {
        this.echartInstance = echarts.init(document.getElementById('echart'))
        this.rewriteLengendHandler()
      }
      this.drawChart(data)
    },
    drawChart(data) {
      // 渲染图表
      this.echartInstance.setOption(this.getOptions(data), true)
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
                <div>${params[0].name}</div>
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
          data: ['邮件营销'],
          orient: 'horizontal',
          x: 'center',
          y: 'bottom',
          textStyle: {
            color: '#000'
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
          }
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: dataList,
            lineStyle: {
              color: '#409EFF'
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
