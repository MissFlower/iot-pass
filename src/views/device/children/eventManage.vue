<!--
 * @Description: 事件管理
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-11-11 17:58:12
-->

<template>
  <div class="event-manage-container" v-bind="$attrs">
    <div class="search-content">
      <!-- 搜索部分 -->
      <ElForm ref="form" :inline="true" :model="formInline" size="mini">
        <ElFormItem prop="identifier">
          <ElInput
            v-model="formInline.identifier"
            clearable
            prefix-icon="el-icon-search"
            placeholder="请输入事件标识符"
            @change="change"
          />
        </ElFormItem>

        <ElFormItem prop="eventType">
          <ElSelect v-model="formInline.eventType" placeholder="请选择" @change="change">
            <ElOption label="全部类型" :value="0" />
            <ElOption
              v-for="(item, index) in EVENT_TYPE_TEXT"
              :key="index"
              :label="item"
              :value="index"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem prop="timeRange">
          <ElSelect v-model="timeRange" placeholder="请选择" @change="chooseTime">
            <ElOption
              v-for="item in TIME_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem prop="curtomTime">
          <ElDatePicker
            v-if="timeRange === 0"
            v-model="curtomTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            popper-class="event-manage-custom-datepicker"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="dateChange"
          />
        </ElFormItem>
      </ElForm>
      <div class="icon-content">
        <div class="question-mark">
          <ElPopover
            placement="top-start"
            width="300"
            trigger="hover"
            popper-class="custom-runstate-popper"
            content="设备上报的事件记录，包括信息、告警、故障 3 种类型。"
          >
            <svg-icon slot="reference" icon-class="questionMark" />
          </ElPopover>
        </div>
        <ElTooltip
          content="刷新"
          placement="top"
          effect="light"
          popper-class="custom-tooltip-style"
          class="refresh-icon"
        >
          <i class="el-icon-refresh-right" @click="refreshHandler" />
        </ElTooltip>
      </div>
    </div>
    <!-- 列表 -->
    <div class="table-list-container">
      <ElTable v-loading="loading" :data="listData" border>
        <ElTableColumn label="时间" prop="time" width="200">
          <template slot-scope="{ row }">{{ row.time | parseMillTime }}</template>
        </ElTableColumn>

        <ElTableColumn label="标识符" prop="identifier" min-width="100" />

        <ElTableColumn label="事件名称" prop="name" min-width="100" />

        <ElTableColumn label="事件类型" prop="eventType" min-width="100">
          <template slot-scope="{ row }">{{ EVENT_TYPE_TEXT[row.eventType] }}</template>
        </ElTableColumn>

        <ElTableColumn label="输出参数" prop="outputData" min-width="300" show-overflow-tooltip />

        <div slot="empty" class="defalut-graph-box">
          <DeafultGraph icon-class="empty" text="暂无数据" />
        </div>
      </ElTable>
      <ElButton v-show="isShowLoadMoreBtn" class="load-more-button" @click="loadMore">加载更多</ElButton>
    </div>
  </div>
</template>

<script>
import { getEventForList } from '@/api/deviceRequest'
import { TIME_TYPE, EVENT_TYPE_TEXT } from '@/data/constants'
import { deepFreeze } from '@/utils'
import DeafultGraph from '@/components/DeafultGraph'
export default {
  name: 'EventManage',
  components: {
    DeafultGraph
  },
  data() {
    return {
      formInline: {
        identifier: '', // 查询标签
        eventType: 0 // 事件类型
      },
      timeRange: 1, // 时间范围
      listData: [], // table数据
      TIME_TYPE, // 时间范围类型
      EVENT_TYPE_TEXT, // 事件类型
      curtomTime: '', // 自定义时间
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      nextTime: '', // 下次接口请求结束时间
      loading: false, // loading状态
      isShowLoadMoreBtn: false // 是否展示加载数据
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
  created() {
    this.change()
  },
  methods: {
    // 获取事件管理列表
    getList(isLoadMore) {
      this.loading = true
      getEventForList({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName,
        startTime: this.startTime,
        endTime: isLoadMore ? this.nextTime : this.endTime,
        pageSize: 20,
        asc: 1,
        ...this.formInline
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            // 成功处理
            this.isShowLoadMoreBtn = res.data.nextValid
            this.nextTime = res.data.nextTime
            const data = res.data.eventInfo || []
            if (!isLoadMore) {
              // 不是加载更多，将表格数据清空
              this.listData = []
            }
            this.listData.push(...deepFreeze(data))
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    chooseTime(value) {
      // 选择时间范围 转换 startTime endTime 除自定义之外
      this.setStartEndTime()
      this.curtomTime = !value && [this.startTime, this.endTime]
      this.getList()
    },
    dateChange() {
      // 自定义时间
      this.startTime = this.curtomTime[0]
      this.endTime = this.curtomTime[1]
      this.getList()
    },
    loadMore() {
      // 加载更多
      this.getList(true)
    },
    setStartEndTime() {
      // 设置开始和结束时间  自定义的时候每次接口请求 最新事件不更改 非自定义每次获取最新时间
      this.endTime = this.timeRange ? new Date().getTime() : this.endTime
      this.startTime = (this.curtomTime && !this.timeRange) ? this.curtomTime[0] : this.endTime - (this.timeRange || 7 * 24) * 60 * 60 * 1000
    },
    change() {
      this.setStartEndTime()
      this.getList()
    },
    refreshHandler() {
      if (!this.timeRange) {
        // 自定义时间的刷新
        this.dateChange()
      } else {
        // 非自定义时间刷新
        this.setStartEndTime()
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.event-manage-container {
  padding-top: 10px;

  .search-content {
    display: flex;
    justify-content: space-between;
  }

  .icon-content {
    display: flex;
    justify-content: space-between;
    width: 70px;

    .refresh-icon,
    .question-mark {
      width: 32px;
      height: 32px;
      border: 1px solid #dcdfe6;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgb(136, 136, 136);
      transition: all ease-out 0.3s;

      &:hover {
        border-color: #737373;
      }
    }
    .refresh-icon {
      font-size: 20px;
      width: 30px;
      height: 30px;
    }
  }

  .table-list-container {
    text-align: center;
    padding-bottom: 20px;

    .load-more-button {
      margin-top: 5px;
    }
  }

  .defalut-graph-box {
    display: flex;
    justify-content: center;
    padding: 50px 0;
  }

  /deep/ .el-date-editor--datetimerange.el-input__inner {
    width: 350px;
  }
}
</style>
