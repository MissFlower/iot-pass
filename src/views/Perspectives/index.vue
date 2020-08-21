<!--
 * @Description: 透视分析页面
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 14:26:58
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-21 18:31:42
-->
<template>
  <div class="perspective-container">
    <!-- 图表区域 -->
    <div class="chart-container">
      <!-- 图表组件 -->
      <Chart :chart-data="chartData" class="chart-content" />
    </div>
    <!-- 功能操作区域 -->
    <div class="operation-container">
      <div class="operation-header">
        <div class="operation-header-left">
          <ElSelect v-model="timeRange" placeholder="请选择" class="time-range">
            <ElOption
              v-for="item in TIME_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </ElOption>
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
            class="custom-date"
            :picker-options="pickerOptions"
            @change="getCustomTime"
          />
          <div class="time-interval-content">
            <span class="operation-header-text">采样间隔:</span>
            <ElSelect v-model="timeInterval" placeholder="请选择">
              <ElOption
                v-for="item in TIME_INTERVAL_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </ElOption>
            </ElSelect>
          </div>
          <div class="algorithm-content">
            <span class="operation-header-text">算法:</span>
            <ElSelect v-model="algorithm" placeholder="请选择">
              <ElOption
                v-for="item in ALFORITHM_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </ElOption>
            </ElSelect>
          </div>
        </div>
        <div class="operation-header-right">
          <ElButton type="primary">Submit</ElButton>
          <ElButton type="primary">更新SQL</ElButton>
        </div>
      </div>
      <div class="operation-content clearfix">
        <div class="operation-from fl">
          <span class="operation-text">FROM</span>
          <div class="operation-from-content">
            <ProductAutocomplete v-model="productName" placeholder="搜索产品" @change="getProductKey" />
            <MeasureAutocomplete v-model="measureName" :product-key="productKey" placeholder="请选择" class="measure-complete" @change="getMeasure" />
          </div>
        </div>
        <div class="operation-filter-container fl">
          <FilterTag />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from './Chart'
import ProductAutocomplete from './ProductAutocomplete'
import MeasureAutocomplete from './MeasureAutocomplete'
import FilterTag from './FilterTag'
import { deepFreeze } from 'src/utils'
// 时间范围options
const TIME_OPTIONS = deepFreeze([
  {
    label: '自定义',
    value: 0
  },
  {
    label: '5分钟',
    value: 5
  },
  {
    label: '15分钟',
    value: 15
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '6小时',
    value: 360
  },
  {
    label: '12小时',
    value: 720
  },
  {
    label: '24小时',
    value: 1440
  },
  {
    label: '2天',
    value: 2880
  },
  {
    label: '7天',
    value: 10080
  },
  {
    label: '30天',
    value: 43200
  }
])
// 时间间隔options
const TIME_INTERVAL_OPTIONS = deepFreeze([
  {
    label: '5s',
    value: 5
  },
  {
    label: '10s',
    value: 10
  },
  {
    label: '15s',
    value: 15
  },
  {
    label: '20s',
    value: 20
  },
  {
    label: '1min',
    value: 60
  },
  {
    label: '5min',
    value: 300
  },
  {
    label: '15min',
    value: 900
  },
  {
    label: '1h',
    value: 3600
  },
  {
    label: '6h',
    value: 21600
  }
])
// 算法options
const ALFORITHM_OPTIONS = deepFreeze([
  {
    label: '最大值',
    value: 'max'
  },
  {
    label: '最小值',
    value: 'min'
  },
  {
    label: '总和',
    value: 'sum'
  },
  {
    label: '均值',
    value: 'average'
  },
  {
    label: 'None',
    value: 'none'
  }
])
export default {
  name: 'Perspectives',
  components: {
    Chart,
    ProductAutocomplete,
    MeasureAutocomplete,
    FilterTag
  },
  data() {
    return {
      chartData: { // 图表数据
        dataList: [],
        dateList: []
      },
      timeRange: 5, // 选择的事件范围 unit(minute)
      TIME_OPTIONS, // 可供选择的时间范围options
      timeInterval: 5, // 选择的采样间隔 unit(second)
      TIME_INTERVAL_OPTIONS, // 时间间隔options
      algorithm: 'none', // 选择的算法值 默认值 none
      ALFORITHM_OPTIONS, // 算法options
      startTime: '', // 开始时间
      endTime: '', //  结束时间
      productName: '', // 选择的产品name
      productKey: '123', // 选择的产品key
      measureName: '' //  度量名称
    }
  },
  methods: {
    getCustomTime() {
      // 获取自定义时间
    },
    getProductKey() {
      // 获取prodectKey
    },
    getMeasure() {
      // 获取度量
    }
  }
}
</script>
<style lang="scss" scoped>
.perspective-container {
  min-width: 1200px;
  height: 100%;
  padding: 20px;

  .chart-container {
    width: 100%;
    height: calc(100% - 290px);
    min-height: 300px;
  }

  .operation-container {
    width: 100%;
    height: 300px;
    border-top: 1px solid #f1f1f1;

    .operation-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &-left {
        width: calc(100% - 180px);
        display: flex;
      }

      &-right {
        width: 180px;
        display: flex;
        justify-content: flex-end;
      }

      &-text {
        padding-right: 10px;
      }

      .time-interval-content,
      .algorithm-content {
        margin-left: 16px;
        min-width: 280px;
      }

      .custom-date {
        margin-left: 16px;
      }
    }

    .operation-content {
      width: 100%;
      margin-top: 6px;
      overflow-x: auto;
      height: calc(100% - 38px);

      .operation-from {
        width: 400px;
        padding: 8px;
        border: 1px solid #999;
        height: 100%;
      }

      .operation-text {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
      }

      .operation-from-content {
        display: flex;
        justify-content: space-between;
      }

      .measure-complete {
        margin-left: 10px;
      }
    }

    .operation-filter-container {
      height: 100%;
    }
  }
}
</style>
