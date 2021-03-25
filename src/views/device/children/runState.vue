<!--
 * @Description: 运行状态
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-03-25 19:32:21
-->
<template>
  <div v-loading="loading">
    <div class="filter-container">
      <ElInput
        v-model="filterValue"
        prefix-icon="el-icon-search"
        placeholder="请输入属性名称"
        class="filter-input"
        @change="filterValueChange"
      />

      <div class="menu-box">
        <ElSwitch
          v-model="realTimeRefresh"
          inactive-text="实时刷新"
          class="real-time-switch"
          @change="realTimeHandler"
        />
        <ElRadioGroup v-model="showType" class="menu-type">
          <ElRadioButton label="card">
            <i class="el-icon-menu" />
          </ElRadioButton>
          <ElRadioButton label="table">
            <svg-icon icon-class="table" />
          </ElRadioButton>
        </ElRadioGroup>
        <div class="question-mark">
          <ElPopover
            placement="top-start"
            width="300"
            trigger="hover"
            popper-class="custom-runstate-popper"
            content="设备数据上报的最新属性值，点击“查看数据”可以查看指定属性的历史数据"
          >
            <svg-icon slot="reference" icon-class="questionMark" />
          </ElPopover>
        </div>
      </div>
    </div>
    <!-- 卡片结构 -->
    <div v-if="showType === 'card'" class="runstate-card-container">
      <RunStateCard
        v-for="(item, index) in tableData"
        :key="index"
        :card-data="item"
      />
    </div>
    <!-- 表格结构 -->
    <div v-else class="runstate-table-container">
      <ElTable :data="tableData" border style="width: 100%">
        <ElTableColumn prop="name" label="属性名称" min-width="200" />

        <ElTableColumn prop="dataType" label="数据类型" min-width="120" />

        <ElTableColumn prop="time" label="更新时间" min-width="150">
          <template slot-scope="{ row }">
            {{ !row.time ? "—" : row.time | parseMillTime }}
          </template>
        </ElTableColumn>

        <ElTableColumn prop="value" label="最新值" show-overflow-tooltip />

        <!-- <ElTableColumn prop="expectedValue" label="期望值">
          <template slot-scope="{ row }">{{ row.updateValue ? row.updateValue : "--" }}</template>
        </ElTableColumn> -->

        <ElTableColumn label="操作" width="100">
          <template slot-scope="{ row }">
            <span class="view-data-text" @click="viewDataHandler(row)">
              查看数据
            </span>
          </template>
        </ElTableColumn>

        <div slot="empty" class="defalut-graph-box">
          <DeafultGraph icon-class="empty1" text="暂无数据" />
        </div>
      </ElTable>
    </div>
    <!-- 查看数据 -->
    <RunStateDialog
      v-if="runStateDialogVisible"
      v-bind="$attrs"
      title="查看数据"
      :visible.sync="runStateDialogVisible"
      :is-show-chart="showChart"
      :identifier="currentId"
      :lengend="lengend"
    />
  </div>
</template>

<script>
import RunStateCard from './runState/card'
import RunStateDialog from './runState/runStateDialog'
import { getAllProperties, getPropertyStatus } from '@/api/deviceRequest'
import { deepFreeze } from 'src/utils'
import DeafultGraph from '@/components/DeafultGraph'
export default {
  name: 'RunState',
  components: {
    RunStateCard,
    RunStateDialog,
    DeafultGraph
  },
  data() {
    return {
      filterValue: '', // 过滤字段
      realTimeRefresh: false, // 实时刷新
      showType: 'card', // 展示方式 可选值：card、table
      showChart: false, // 是否展示dialog中chart选项 默认false
      tableData: [], // 属性列表 完整数据
      runStateDialogVisible: false, // 运行状态dialog状态
      timer: null, // 定时器
      timeInterval: 3000, // 轮询时间间隔
      loading: false, // loading状态
      identifierList: [], // 属性的id列表
      propertyData: [], // 属性列表 不包含最新值
      currentId: '', // 当前操作的属性id
      lengend: '' //  当前操作的属性title
    }
  },
  mounted() {
    this.getAllProperties()
  },
  activated() {
    if (this.realTimeRefresh) {
      this.realTimeHandler(this.realTimeRefresh)
    }
  },
  deactivated() {
    // clearTimeout(this.timer)
    // this.timer = null
    // console.log('runState组件即将被销毁')
  },
  methods: {
    getAllProperties() {
      // 获取设备物模型属性列表
      this.loading = true
      getAllProperties({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName
      })
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            // 成功处理
            this.identifierList = []
            this.propertyData = []
            res.data.propertyInfo.map(item => {
              this.identifierList.push(deepFreeze(item.identifier))
              this.propertyData.push(deepFreeze({
                name: item.name,
                unit: item.unit,
                dataType: item.dataType,
                value: '',
                time: '',
                identifier: item.identifier
              }))
            })
            this.getPropertyStatus()
          }
          // this.$message({
          //   type: res.code === 200 ? 'success' : 'warning',
          //   message: res.message
          // })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getPropertyStatus() {
      // 获取属性实时状态
      getPropertyStatus({
        productKey: this.$attrs['device-info'].productKey,
        deviceName: this.$attrs['device-info'].deviceName,
        identifierList: this.identifierList
      })
        .then(res => {
          if (res.code === 200) {
            // 成功处理
            const data = res.data.propertyStatusInfo
            // const temp = []
            const result = this.propertyData.map((item, index) => {
              const temp = {
                ...item
              }
              const existItem = data.find(i => i.identifier === item.identifier)
              if (existItem) {
                temp.value = existItem.value
                temp.time = existItem.time
              }
              return temp
            })
            this.tableData = deepFreeze([...result])
            // console.log(111, this.tableData)
            this.freezeTableData = deepFreeze(result)
          }
          // this.$message({
          //   type: res.code === 200 ? 'success' : 'warning',
          //   message: res.message
          // })
        })
    },
    filterValueChange(value) {
      // 根据属性值过滤
      if (!value) {
        // 为空时 将冻结的请求数据重新赋给 tableData
        this.tableData = deepFreeze([...this.freezeTableData])
      }
      // 非空时 进行过滤
      const res = this.freezeTableData.filter(item => {
        return item.name.includes(value)
      })
      this.tableData = deepFreeze([...res])
    },
    interval(fn, wait) {
      const interv = () => {
        fn.call()
        this.timer = setTimeout(interv, wait)
      }
      this.timer = setTimeout(interv, wait)
    },
    realTimeHandler(flag) {
      // 实时刷新功能
      if (!flag) {
        clearTimeout(this.timer)
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.interval(this.getPropertyStatus, this.timeInterval)
      this.$once('hook:deactivated', () => {
        clearTimeout(this.timer)
        this.timer = null
      })
    },
    viewDataHandler({ identifier, name }) {
      // 查看数据
      // console.log(identifier, name)
      this.currentId = identifier
      this.lengend = name
      this.runStateDialogVisible = true
      const dataType = this.tableData.find(item => item.identifier === identifier).dataType
      this.showChart = !(dataType === 'int' || dataType === 'double' || dataType === 'float')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .filter-input {
    width: 285px;
  }
  .menu-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .real-time-switch {
      margin: 16px 20px 16px 0;
    }

    .question-mark {
      width: 44px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      cursor: pointer;
      color: rgb(136, 136, 136);
      transition: all ease-out 0.3s;

      &:hover {
        border-color: #737373;
      }
    }
  }
}
.runstate-card-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.view-data-text {
  color: #0070cc;
  cursor: pointer;
}
.runstate-table-container {
  margin-bottom: 20px;
}
</style>
<style>
.custom-runstate-popper {
  padding: 8px 20px;
  color: #111;
  font-size: 12px;
}
</style>
