<template>
  <div>
    <el-drawer
      ref="drawer"
      title="请选择设备"
      :visible.sync="drawerVisible"
      :direction="direction"
      class="selectDevice"
      size="500"
      :before-close="handleClose">
      <div class="con">
        <div class="df pb10 bb1">
          <el-select v-model="formData.srcVersions" class="w100" placeholder="版本筛选"></el-select>
          <el-input
            v-model.trim="formData.deviceName"
            placeholder="请输入设备名称"
            class="w180 ml10 mr20 searchInput"
            @keyup.enter.native="searchNameFun"
          >
            <span slot="suffix">
              <i class="el-icon-search hand" @click="searchNameFun"></i>
              <i class="el-icon-close hand" v-if="formData.deviceName != ''"></i>
            </span>
          </el-input>
          <el-radio-group v-model="radio1">
            <el-radio-button label="1">全部</el-radio-button>
            <el-radio-button label="0">已选择</el-radio-button>
          </el-radio-group>
        </div>
        <el-table :data="list">
          <div slot="empty" class="emptyTable tc">
            <svg-icon icon-class="empty1" class="empty"></svg-icon>
            <div class="lh20">暂无数据</div>
          </div>
          <el-table-column label="DeviceName"></el-table-column>
          <el-table-column label="ProductKey"></el-table-column>
          <el-table-column label="版本号"></el-table-column>
        </el-table>
      </div>
      <div class="drawer__footer f14 df ai_c">
        <div class="flex1">
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
        <span>已选择 {{selectList.length}} 个设备</span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getDirectedUpgradeList } from '@/api/fireware'
export default {
  data () {
    return { 
      loading: false,
      drawerVisible: true,
      direction: 'rtl',
      formData: {
        deviceName: '',
        srcVersions: ''
      },
      radio1: '1',
      list: [],
      selectList: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      getDirectedUpgradeList(this.formData).then(res => {
        console.log(res)
      })
    },
    handleClose () {
      console.log('-------')
      this.$emit('close')
    },
    searchNameFun () {},
    cancelForm () {}
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