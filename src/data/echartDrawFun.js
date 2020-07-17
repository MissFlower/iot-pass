
// import echarts from 'echarts'
// / 文件路径 @/lib/echarts.js 自行配置
// 加载echarts，注意引入文件的路径
import echarts from 'echarts/lib/echarts'
// 再引入你需要使用的图表类型，标题，提示信息等
import 'echarts/lib/chart/bar'

// function getDpr () {
//   let log = document.documentElement
//   let dpr = log.getAttribute('data-dpr')
//   return dpr
// }
export default {
  barChart: (id) => {
    let chartBar = echarts.init(document.getElementById(id))
    let  color = ['#3398DB', '#33981B', '#FFA02D']
    const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          show: false
        }
      }
    ],
    xAxis: [
      {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '直接访问',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
        itemStyle: {
          normal: {
            color: function (params) {
              return color[params.dataIndex % 3]
            }
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: function (params) {
            return params.value > 0 ? params.value + '%' : ''
          }
        }
      }
    ]
};
    chartBar.setOption(option, true)
  }
}
