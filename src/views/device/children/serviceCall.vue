<!--
 * @Description: 服务调用
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-18 19:02:16
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
            placeholder="请输入服务标识符"
            @change="change"
          />
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
            content="云端下发给设备的远程指令，包括属性设置（set）和服务调用的记录。"
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
        <ElTableColumn label="时间" prop="time">
          <template slot-scope="{ row }">{{ row.time | parseMillTime }}</template>
        </ElTableColumn>

        <ElTableColumn label="标识符" prop="identifier" />

        <ElTableColumn label="服务名称" prop="name" />

        <ElTableColumn label="输入参数" prop="inputData" show-overflow-tooltip />

        <ElTableColumn label="输出参数" prop="outputData" show-overflow-tooltip />

        <div slot="empty" class="defalut-graph-box">
          <DeafultGraph icon-class="empty1" text="暂无数据" />
        </div>
      </ElTable>
      <ElButton v-if="isShowLoadMoreBtn" class="load-more-button" @click="loadMore">加载更多</ElButton>
    </div>
  </div>
</template>

<script>
import { getServiceForList } from '@/api/deviceRequest'
import { TIME_TYPE } from '@/data/constants'
import { deepFreeze } from '@/utils'
import DeafultGraph from '@/components/DeafultGraph'

export default {
  name: 'ServiceCall',
  components: {
    DeafultGraph
  },
  data() {
    return {
      formInline: {
        identifier: '' // 查询标签
      },
      timeRange: 1, // 时间范围
      TIME_TYPE, // 时间范围类型
      listData: [], // table数据
      curtomTime: '', // 自定义时间
      startTime: '', // 开始时间
      endTime: '', // 结束时间
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
    // console.log(this.$attrs['device-info'])
    this.change()
  },
  methods: {
    // 获取服务调用列表
    getList(isLoadMore) {
      this.loading = true
      getServiceForList({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName,
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: 20,
        asc: 1,
        ...this.formInline
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            // 成功处理
            this.isShowLoadMoreBtn = res.nextValid
            this.endTime = res.nextTime
            const data = res.data.serviceInfo ? res.data.serviceInfo : []
            if (!isLoadMore) {
              // 不是加载更多，将表格数据清空
              this.listData = []
            }
            this.listData.push(...deepFreeze(data))
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    chooseTime(value) {
      // 选择时间范围 转换 startTime endTime 除自定义之外
      // console.log(value)
      this.setStartEndTime()
      if (!value) {
        this.curtomTime = [this.startTime, this.endTime]
      }
      this.getList()
    },
    dateChange() {
      this.startTime = this.curtomTime[0]
      this.endTime = this.curtomTime[1]
      this.getList()
    },
    loadMore() {
      // 加载更多
      this.getList(true)
    },
    setStartEndTime() {
      // 设置开始和结束时间
      this.endTime = new Date().getTime()
      this.startTime = this.endTime - (this.timeRange * 60 * 60 * 1000)
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
