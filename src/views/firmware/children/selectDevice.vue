<template>
  <div>
    <el-drawer
      ref="drawer"
      title="请选择设备"
      :visible.sync="drawerVisible"
      :direction="direction"
      class="selectDevice"
      size="45%"
      v-loading="loading"
      :before-close="handleClose"
    >
      <div class="con">
        <div class="df pb10 bb1 ai_c">
          <div class="flex1">
            <el-select
              v-model="srcVersions"
              multiple
              class="w120"
              placeholder="版本筛选"
              :disabled="allFlag == 0"
              @change="scopeTypeChange"
            >
              <el-option
                v-for="version in srcVersionList"
                :key="version"
                :label="version"
                :value="version"
              ></el-option>
            </el-select>
            <el-input
              v-model.trim="formData.deviceName"
              placeholder="请输入设备名称"
              class="w150 ml10 mr20 searchInput"
              @keyup.enter.native="searchNameFun"
              :disabled="allFlag == 0"
            >
              <span slot="suffix">
                <i class="el-icon-search hand" @click="getData()"></i>
                <i class="el-icon-close hand" v-if="formData.deviceName != ''" @click="resetFun"></i>
              </span>
            </el-input>
            <el-select v-model="formData.status" class="w80" placeholder="状态" @change="getData()">
              <el-option value="" label="全部"></el-option>
              <el-option value="1" label="在线"></el-option>
              <el-option value="0" label="离线"></el-option>
            </el-select>
          </div>
          <el-radio-group v-model="allFlag">
            <el-radio-button label="1">全部</el-radio-button>
            <el-radio-button label="0">已选择</el-radio-button>
          </el-radio-group>
        </div>
        <el-table
          ref="table"
          :data="tableList"
          :max-height="tableHeight"
          @select="handleSelect"
          @select-all="handleSelectAll"
          v-loading="loading"
        >
          <div slot="empty" class="emptyTable tc">
            <svg-icon icon-class="empty1" class="empty"></svg-icon>
            <div class="lh20">暂无数据</div>
          </div>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="DeviceName" prop="deviceName"></el-table-column>
          <el-table-column label="ProductKey" prop="productKey"></el-table-column>
          <el-table-column label="版本号" prop="version"></el-table-column>
        </el-table>
        <pagination v-if="allFlag == 1" :data="pageInfo" :layout="`prev, pager, next`" small @pagination="getData()"></pagination>
      </div>
      <div class="drawer__footer f14 df ai_c">
        <div class="flex1">
          <el-button type="primary" @click="handleSubmit">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
        <span>已选择 <span class="red b">{{ selectList.length }}</span> 个设备</span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getDirectedUpgradeList, getSrcVersionList } from '@/api/fireware'

import pagination from '@/components/Pagination'
export default {
  components: { pagination },
  props: {
    srcVersion: {
      type: Array,
      default: () => []
    },
    checkInfo: {
      type: Object,
      default: () => {}
    },
    selectDeviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      drawerVisible: true,
      direction: 'rtl',
      formData: {
        deviceName: '',
        srcVersions: '',
        fmId: '',
        status: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100,
        total: 0
      },
      allFlag: '1',
      list: [],
      selectList: [],
      srcVersionList: [],
      srcVersions: [],
      tableList: [],
      allSelectFlag: false,
      tableHeight: window.innerHeight - 240
    }
  },
  watch: {
    allFlag: function() {
      this.dealListFun()
    }
  },
  mounted() {
    if (this.srcVersion && this.srcVersion.length > 0) {
      this.srcVersions = JSON.parse(JSON.stringify(this.srcVersion))
    }
    let str = null
    if (this.selectDeviceList && this.selectDeviceList.length > 0) {
      this.selectList = this.selectDeviceList
      this.allFlag = '0'
      str = '0'
    }
    this.formData.fmId = this.checkInfo.id
    this.scopeTypeChange(str)
    this.getVersionList()
  },
  methods: {
    dealListFun() {
      const selectList_ = JSON.parse(JSON.stringify(this.selectList))
      if (this.allFlag * 1 === 1) {
        this.tableList = this.list
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.toggleSelection(selectList_)
        })
      } else {
        this.tableList = this.selectList
        this.$nextTick(() => {
          this.$refs.table.toggleAllSelection()
        })
      }
    },
    getVersionList() {
      this.loading = true
      getSrcVersionList({
        productKey: this.checkInfo.productKey,
        moduleType: this.checkInfo.moduleType,
        destVersion: this.checkInfo.destVersion,
        productType: this.checkInfo.productType
      }).then(res => {
        if (res.code === 200) {
          this.srcVersionList = res.data
        }
        // this.loading = false
      }).catch(() => {
        // this.loading = false
      })
    },
    resetFun() {
      this.formData.deviceName = ''
      this.getData()
    },
    getData(val) {
      this.loading = true
      this.list = []
      const obj = Object.assign(this.formData, this.pageInfo)
      getDirectedUpgradeList(obj).then(res => {
        if (res.code === 200) {
          this.list = res.data.data.filter(item => {
            return item.version !== this.checkInfo.destVersion
          })
          this.pageInfo.total = res.data.total
          console.log(this.list)
          console.log(!val)
          if (!val) {
            this.tableList = this.list
          }
          if (this.selectList.length > 0) {
            const selectList_ = JSON.parse(JSON.stringify(this.selectList))
            this.$nextTick(() => {
              this.toggleSelection(selectList_)
            })
          }
        }
        this.$nextTick(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    scopeTypeChange() {
      this.formData.srcVersions = this.srcVersions.join(',')
      this.getData()
    },
    handleSelect(selection, row) {
      if (this.selectList.length > 0) {
        if (row) {
          let index = -1
          if (selection.length > 0) {
            index = selection.findIndex((item, index) => {
              return item.deviceName === row.deviceName
            })
          }
          const index1 = this.selectList.findIndex((item, index) => {
            return item.deviceName === row.deviceName
          })
          if (index === -1 && index1 > -1) {
            this.selectList.splice(index1, 1)
          }
        }
        if (selection.length > 0) {
          const nameSet = new Set()
          this.selectList.forEach(item => {
            nameSet.add(item.deviceName)
          })
          const nameArr = [...nameSet]
          selection.forEach(item => {
            if (nameArr.indexOf(item.deviceName) === -1) {
              this.selectList.push(item)
            }
          })
        }
      } else {
        this.selectList = selection
      }
    },
    handleSelectAll(selection) {
      if (selection.length > 0) {
        this.handleSelect(selection)
      } else {
        // 表示清除本页选择
        const nameSet = new Set()
        this.tableList.forEach(item => {
          nameSet.add(item.deviceName)
        })
        const nameArr = [...nameSet]
        const list = []
        this.selectList.forEach(item => {
          if (nameArr.indexOf(item.deviceName) === -1) {
            list.push(item)
          }
        })
        this.selectList = list
      }
      // this.selectList = selection
    },
    toggleSelection(rows) {
      if (rows && rows.length > 0) {
        const nameSet = new Set()
        this.tableList.forEach(item => {
          nameSet.add(item.deviceName)
        })
        const nameArr = [...nameSet]
        rows.forEach(row => {
          const len = nameArr.indexOf(row.deviceName)
          if (len > -1) {
            this.$refs.table.toggleRowSelection(this.tableList[len], true)
          }
        })
      }
    },
    handleClose() {
      this.$emit('close')
    },
    searchNameFun() {
      this.getData()
    },
    cancelForm() {
      this.$refs.drawer.closeDrawer()
      this.$emit('close')
    },
    handleSubmit() {
      if (this.selectList.length > 5000) {
        this.$message.error('选择的设备数量过大')
      } else {
        this.$refs.drawer.closeDrawer()
        this.$emit('success', this.selectList, this.srcVersions)
      }
    }
  }
}
</script>

<style lang="scss">
.selectDevice {
  .el-drawer__header {
    border-bottom: 1px solid #efefef;
    font-size: 14px;
    margin: 0;
    padding: 12px 20px;
  }
  .el-drawer__body {
    display: flex;
    flex-direction: column;
  }
  .con {
    padding: 22px;
    margin-bottom: -15px;
    flex: 1;
    overflow: auto;
    .emptyTable {
      margin: 100px 0;
    }
  }
  .drawer__footer {
    bottom: 0px;
    padding: 16px;
  }
  .el-table th {
    background-color: #fafafa;
  }
  .svg-icon {
    width: 50px!important;
    height: 50px!important;
  }
}
</style>
