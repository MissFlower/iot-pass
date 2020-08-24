<!--
 * @Description: 透视分析页面
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 14:26:58
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-24 19:34:45
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
            <ProductAutocomplete v-model="productName" placeholder="搜索产品" class="product-complete" @change="getProductKey" />
            <MeasureAutocomplete v-model="measureName" :product-key="productKey" placeholder="请选择" class="measure-complete" @change="getMeasure" />
          </div>
        </div>
        <div class="base-fliter-container fl">
          <FilterTag
            :tag-options="baseFilter.options"
            :show="false"
            :id="baseFilter.id"
            @change="getCheckedTagValue"
            @tagChange="computedFilterOptions"
          />
        </div>
        <div class="other-filter-container fl">
          <!-- <ElScrollbar ref="scroll" wrap-class="scrollbar-wrapper">
            <div class="other-filter-box">
              <FilterTag v-for="(item, index) in filterList" :key="item.createTime" :style="{'left': index * 216 +'px'}" :tag-options="item.options" class="filter-list" />
              <div class="add-filter-container" :style="{'left': (filterList.length * 216) +'px'}" @click="addFilter">
                <span>+</span>
              </div>
            </div>
          </ElScrollbar> -->
          <div ref="filterTags" class="other-filter-box">
            <FilterTag
              v-for="(item, index) in filterList"
              :key="item.id"
              :id="item.id"
              :tag-options="item.options"
              :style="{'left': index * 216 +'px'}"
              class="filter-list"
              @deleteFilter="deleteFilter"
              @change="getCheckedTagValue"
              @tagChange="computedFilterOptions"
            />
          </div>
        </div>
        <div ref="add" class="add-filter-container" :style="{'left': filterList.length * 216 + 616 +'px'}" @click="addFilter">
          <i class="el-icon-plus" />
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
      measureName: '', //  度量名称
      baseFilter: {
        id: 'base',
        checkedTag: '',
        options: []
      }, // 全部的tag
      filterList: [], // tag Filter list 下的各个不同filter (选过的不会再有)
      checkedFilterTagValue: {} // 用来存储用户创建的不同 Filter 下 选择的 value
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
      // 获取度量 请求接口 返回数据赋值给baseFilter
      this.initFilter = [
        {
          label: 'list1-tag1',
          value: 11,
          id: 1
        },
        {
          label: 'list1-tag2',
          value: 12,
          id: 2
        },
        {
          label: 'list1-tag3',
          value: 13,
          id: 3
        }
      ]
      this.baseFilter.options = [
        {
          label: 'list1-tag1',
          value: 11,
          id: 1
        },
        {
          label: 'list1-tag2',
          value: 12,
          id: 2
        },
        {
          label: 'list1-tag3',
          value: 13,
          id: 3
        }
      ]
    },
    getUsedFilterList() {
      // 获取已经被使用的tag filter
      const usedFilterIds = []
      for (const key in this.checkedFilterTagValue) {
        if (Object.prototype.hasOwnProperty.call(this.checkedFilterTagValue, key)) {
          usedFilterIds.push(this.checkedFilterTagValue[key].tag)
        }
      }
      // 获取没有被使用过的tag Filter列表
      this.unusedFilterList = this.initFilter.filter(item => !usedFilterIds.includes(item.id))
    },
    addFilter() {
      // 判断filter条件是否已经选择 给提示弹窗
      if (!this.baseFilter.checkedTag || this.filterList.some(item => item.checkedTag === '')) {
        this.$message({
          type: 'warning',
          message: '请完善Filter!'
        })
        return
      }
      // 创建tag Filter 已经被选过的tag再次创建Filter时 列表过滤
      const id = Date.now()
      this.getUsedFilterList()
      this.filterList.push({
        id,
        checkedTag: '',
        options: [...this.unusedFilterList]
      })
      // 创建tag Filter时 创建一个存储用户选中value的容器 每个Filter创建时 都独立生成唯一id 使用id作为键进行数据存储
      this.checkedFilterTagValue[id] = {
        tag: '', // tag 的 id
        value: []
      }
      this.$nextTick(() => {
        if (this.$refs.filterTags.offsetWidth < this.$refs.filterTags.scrollWidth) {
          this.$refs.add.style.left = ''
          this.$refs.add.style.right = 0
          this.$refs.add.style.borderLeft = '1px solid #999'
        }
      })
    },
    computedFilterOptions() {
      // 计算每个TAG FILTER下面的options
      this.getUsedFilterList()
      this.filterList.forEach(item => {
        item.options = [this.initFilter.find(i => i.id === item.checkedTag), ...this.unusedFilterList]
      })
      this.baseFilter.options = [this.initFilter.find(item => item.id === this.baseFilter.checkedTag), ...this.unusedFilterList]
    },
    deleteFilter(id) {
      // 删除filter
      console.log(id)
      const index = this.filterList.findIndex(item => item.id === id)
      this.filterList.splice(index, 1)
      // 删除filter的同时  需要将创建时给用户创建 的 存储容器 一并删除
      delete this.checkedFilterTagValue[id]
      // 删除filter 重新计算每个options的值
      this.computedFilterOptions()
    },
    getCheckedTagValue(id, data) {
      // 获取tag 和 value 更新 用户 存储的内容
      // console.log(data)
      this.checkedFilterTagValue[id] = data
      // 设置每个Filter选中的tag  存储的是id
      const index = this.filterList.findIndex(item => item.id === id)
      if (~index) {
        this.filterList[index].checkedTag = data.tag
        return
      }
      this.baseFilter.checkedTag = data.tag
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
      height: 262px;
      overflow: hidden;
      border-right: 1px solid #999;
      position: relative;

      .operation-from {
        display: inline-block;
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

      .product-complete {
        width: 186px;
      }

      .measure-complete {
        margin-left: 10px;
        width: 186px;
      }
    }

    .base-fliter-container {
      display: inline-block;
      height: 100%;
    }

    .other-filter-container {
      display: inline-block;
      width: calc(100% - 636px);
      height: 100%;
    }

    .other-filter-box {
      height: 262px;
      position: relative;
      overflow-x: auto;
      .filter-list {
        width: 216px;
        position: absolute;
        top: 0;
        // &:last-child {
        //   border-right: none;
        // }
      }
    }

    .add-filter-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 20px;
      position: absolute;
      top: 0;
      float: left;
      border: 1px solid #999;
      border-left: none;
      font-size: 18px;
      cursor: pointer;
      color: #999;
      &:hover {
        color: #000;
      }
    }
  }
  /deep/.el-scrollbar {
      width: 100%;
      overflow-y: hidden;
    }

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #fff;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #fff;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #f1f1f1;
  }
}
</style>
