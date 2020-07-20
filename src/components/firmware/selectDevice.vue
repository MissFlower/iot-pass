<template>
  <div>
    <el-drawer
      ref="drawer"
      title="请选择设备"
      :visible.sync="drawerVisible"
      :direction="direction"
      class="selectDevice"
      size="40%"
      v-loading="loading"
      :before-close="handleClose">
      <div class="con">
        <div class="df pb10 bb1">
          <div class="flex1">
            <el-select v-model="formData.srcVersions" class="w100" placeholder="版本筛选" @change="getData">
              <el-option v-for="srcVersion in srcVersionList" :key="srcVersion" :label="srcVersion" :value="srcVersion"></el-option>
            </el-select>
            <el-input
              v-model.trim="formData.deviceName"
              placeholder="请输入设备名称"
              class="w180 ml10 mr20 searchInput"
              @keyup.enter.native="searchNameFun"
            >
              <span slot="suffix">
                <i class="el-icon-search hand" @click="getData"></i>
                <i class="el-icon-close hand" v-if="formData.deviceName != ''" @click="getData"></i>
              </span>
            </el-input>
          </div>
          <el-radio-group v-model="allFlag">
            <el-radio-button label="1">全部</el-radio-button>
            <el-radio-button label="0">已选择</el-radio-button>
          </el-radio-group>
        </div>
        <el-table ref="table" :data="tableList" @select="handleSelect" @select-all="handleSelectAll">
          <div slot="empty" class="emptyTable tc">
            <svg-icon icon-class="empty1" class="empty"></svg-icon>
            <div class="lh20">暂无数据</div>
          </div>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="DeviceName" prop="deviceName"></el-table-column>
          <el-table-column label="ProductKey" prop="productKey"></el-table-column>
          <el-table-column label="版本号" prop="version"></el-table-column>
        </el-table>
      </div>
      <div class="drawer__footer f14 df ai_c">
        <div class="flex1">
          <el-button type="primary" @click="handleSubmit">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
        <span>已选择 {{selectList.length}} 个设备</span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getDirectedUpgradeList, getSrcVersionList } from '@/api/fireware'
export default {
  props: ['productId', 'moduleType', 'fmId', 'destVersion'],
  data () {
    return { 
      loading: false,
      drawerVisible: true,
      direction: 'rtl',
      formData: {
        deviceName: '',
        srcVersions: '',
        fmId: '',
        pageNum: 1,
        pageSize: 100
      },
      allFlag: '1',
      list: [],
      selectList: [],
      srcVersionList: [],
      tableList: [],
      allSelectFlag: false
    }
  },
  watch: {
    allFlag: function () {
      this.dealListFun()
    }
  },
  mounted () {
    this.formData.fmId = this.fmId
    this.getData()
    this.getVersionList()
  },
  methods: {
    dealListFun () {
      const selectList_ = JSON.parse(JSON.stringify(this.selectList))
      if (this.allFlag * 1 === 1) {
        this.tableList = this.list
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.toggleSelection(selectList_)
        })
      } else {
        this.tableList = this.selectList
        this.$refs.table.toggleAllSelection()
      }
    },
    getVersionList () {
      this.loading = true
      getSrcVersionList({
        productId: this.productId + '',
        moduleType: this.moduleType
      }).then(res => {
        if (res.code === 200) {
          this.srcVersionList = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getData () {
      this.loading = true
      this.list = []
      getDirectedUpgradeList(this.formData).then(res => {
        if (res.code == 200) {
          this.list = res.data.data.filter(item => {
            return item.version !== this.destVersion
          })
          this.tableList = this.list
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelect (selection, row) {
      this.selectList = selection
      if (this.allFlag * 1 === 0) {
        this.dealListFun()
      }
    },
    handleSelectAll (selection) {
      this.selectList = selection
    },
    toggleSelection(rows) {
      if (rows && rows.length > 0) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(this.tableList.find(item => {
            return row.deviceId == item.deviceId  // 注意这里寻找的字段要唯一，示例仅参考
          }), true)
        })
      }
    },
    handleClose () {
      this.$emit('close')
    },
    searchNameFun () {},
    cancelForm () {},
    handleSubmit () {
      this.$refs.drawer.closeDrawer()
      this.$emit('success', this.selectList)
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
    margin-bottom: 60px;
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
    width: 50px;
    height: 50px;
  }
}
</style>