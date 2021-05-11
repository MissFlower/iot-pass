<!--
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备列表
 -->
<template>
  <div v-loading="loading">
    <!-- <h2>设备管理</h2> -->
    <div class="mb20 df ai_c mt10">
      <el-select v-model="productId" class="w200" placeholder="请选择产品" @change="changeProductFun">
        <el-option
          v-for="(item,index) in productList"
          :key="index"
          :label="item.productName"
          :value="item.id"
        />
      </el-select>

      <div v-for="(obj,index) in deviceCountObj" :key="index" class="deviceCountView">
        <div class="df ai_c">
          <span v-if="index!=0" class="dib mr5" :style="{width:'8px', height:'8px', borderRadius:'4px', background: index==1?'#0A59C0':'#1D7F2F'}" />
          <span>{{ obj.title }}</span>
          <el-popover
            placement="top-start"
            width="160"
            trigger="hover"
            :content="obj.alert"
          >
            <span slot="reference" class="el-icon-question ml2 img" />
          </el-popover>
        </div>
        <div class="Count">{{ obj.count }}</div>
      </div>
    </div>

    <div class="mb20 df jc_sb">
      <div class="df">
        <el-input v-model="searchInputValue" placeholder="请输入名称" class="searchInput" @change="searchBtnTouch" style="width: 360px">
          <el-select
            slot="prepend"
            v-model="searchTypeSelect"
            class="w120"
            placeholder="请选择"
            @change="searchInputValue = ''"
          >
            <el-option label="设备名称" value="1" />
            <el-option label="备注名称" value="2" />
          </el-select>
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchBtnTouch" />
            <i v-if="searchInputValue != ''" class="el-icon-close hand" @click="clearFun('searchInputValue')" />
          </span>
        </el-input>
        <el-input v-model="fmVersionValue" class="ml10 mr10 w150 searchInput" placeholder="固件版本" @change="searchBtnTouch">
          <span slot="suffix">
            <i class="el-icon-search hand" @click="searchBtnTouch" />
            <i v-if="fmVersionValue != ''" class="el-icon-close hand" @click="clearFun('fmVersionValue')" />
          </span>
        </el-input>
        <el-select v-model="deviceStatus" placeholder="状态" @change="searchBtnTouch">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="未激活"></el-option>
          <el-option value="1" label="在线"></el-option>
          <el-option value="2" label="离线"></el-option>
        </el-select>
        <!-- <el-button icon="el-icon-search" @click="searchBtnTouch"></el-button> -->
      </div>
      <div>
        <el-button
          v-if="authArr.indexOf('device_new')>-1"
          type="primary"
          @click="toNewDevice(false)"
        >添加设备</el-button>
        <el-button
          v-if="authArr.indexOf('device_patchCreateDevice')>-1"
          type="primary"
          @click="toNewDevice(true)"
        >批量添加</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" :data="list" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column label="设备信息" width="300">
        <template slot-scope="{ row }">
          <div class="f14 blue hand mb10" @click="lookClick(row)">{{ row.deviceName }}</div>
          <!-- <div>所属产品：{{ row.productName }}</div> -->
          <div>设备ID：{{ row.id }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="id" label="ID" />
      <el-table-column prop="deviceName" label="设备名称" /> -->
      <el-table-column prop="productName" label="产品名称" align="center" />
      <el-table-column prop="nodeTypeStr" label="节点类型" align="center" />
      <el-table-column prop="nickName" label="备注名称" align="center" />
      <el-table-column prop="deviceStatus" label="状态/启用状态" align="center">
        <template v-slot="device">
          <span class="deviceStatusView"><div :style="{background: device.row.statusColor}" />{{ device.row.enableBool?device.row.deviceStatusStr:'已禁用' }}</span>
          <el-switch v-model="device.row.enableBool" :disabled="authArr.indexOf('device_enable')<0" @change="deviceEnable([device.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" align="center" width="95" />
      <el-table-column prop="lastLogoutTime" label="最后登出时间" align="center" width="95" />
      <el-table-column label="操作" align="center" width="80">
        <template v-slot="scope">
          <!-- <el-button type="text" size="small" >查看</el-button> -->
          <el-button v-if="authArr.indexOf('device_delete')>-1" type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pr">
      <div v-if="list.length" class="bottomSeleView">
        <el-checkbox v-if="authArr.indexOf('device_delete')>-1 || authArr.indexOf('device_enable')>-1" v-model="bottomSeleChecked" :disabled="bottomSeleDis" @change="bottomSeleChange" />
        <el-popconfirm v-if="authArr.indexOf('device_delete')>-1" :title="'确定要批量删除选中的'+deviceSelection.length+'个设备吗？'" class="ml10" @onConfirm="batchOperate(1)">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">删除</el-button>
        </el-popconfirm>
        <el-popconfirm v-if="authArr.indexOf('device_enable')>-1" :title="'确定要批量禁用选中的'+deviceSelection.length+'个设备吗？'" class="ml10" @onConfirm="batchOperate(2)">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">禁用</el-button>
        </el-popconfirm>
        <el-popconfirm v-if="authArr.indexOf('device_enable')>-1" :title="'确定要批量启用选中的'+deviceSelection.length+'个设备吗？'" class="ml10" @onConfirm="batchOperate(3)">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">启用</el-button>
        </el-popconfirm>
      </div>
      <!-- 分页-->
      <pagination :data="tableData" @pagination="handleCurrentChange" class="tr" />
    </div>
    <!-- 添加设备 -->
    <newDevice v-if="showNewDevice" :appoint-produck="selProduck" />
    <!-- 批量 -->
    <batchNewDevice v-if="showBatchNewDevice" :appoint-produck="selProduck" />
  </div>
</template>

<script>
import newDevice from './newDevice'
import batchNewDevice from './batchNewDevice'
import Pagination from '@/components/Pagination'
import { deviceList, deleteDevice, deviceBatchEnable, productList, deviceStatistics } from '@/api/deviceRequest'
export default {
  components: { newDevice, Pagination, batchNewDevice },
  data() {
    return {
      list: [],
      deviceCountObj: [
        { title: '设备总数', alert: '当前指定产品的设备总数', count: '' },
        { title: '激活设备', alert: '当前已激活的设备总数', count: '' },
        { title: '当前在线', alert: '当前在线的设备总数', count: '' }
      ],
      tableData: {
        pageCount: 0, // 总页数
        total: 0, // 总条数
        pageSize: 10, // 一页大小
        pageNum: 0 // 第几页 从0开始
      },
      // productSelIndex: 0,
      productId: '',
      productList: [{ productName: '全部产品' }],
      selProduck: '',
      searchTypeSelect: '1',
      searchInputValue: '',
      fmVersionValue: '',
      deviceStatus: '',
      showNewDevice: false,
      showBatchNewDevice: false,
      loading: false,
      deviceSelection: [],
      bottomSeleDis: true,
      bottomSeleChecked: false
    }
  },

  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  watch: {
    $route() {
      if (this.$route.meta.code === 'device') {
        if (this.$route.query.productId) {
          this.productId = this.$route.query.productId
          this.changeProductFun()
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.productId) {
      this.productId = this.$route.query.productId
    }
    // 获取产品列表
    this.getProductList()
    this.changeProductFun()
  },

  methods: {
    // 获取设备列表
    getDeviceList() {
      this.loading = true
      deviceList({
        deviceName: this.searchTypeSelect === '1' ? this.searchInputValue : '',
        nickName: this.searchTypeSelect === '2' ? this.searchInputValue : '',
        fmVersion: this.fmVersionValue,
        deviceStatus: this.deviceStatus,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.pageSize,
        productId: this.productId
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            const list = res.data.data
            // 设备状态
            const statusDict = { '0': '未激活', '1': '在线', '2': '离线' }
            // 节点类型
            const nodeTypeDict = { '1': '直连设备', '2': '网关子设备', '3': '网关设备' }
            var newList = list.map(function(value) {
              if (value.deviceStatus != null) {
                value.deviceStatusStr = statusDict[value.deviceStatus.toString()]
              }
              if (value.nodeType != null) {
                value.nodeTypeStr = nodeTypeDict[value.nodeType.toString()]
              }
              value.enableBool = value.enable === 0
              value.statusColor = !value.enableBool ? '#d93026' : value.deviceStatus === 1 ? '#1EA214' : '#ffc440'
              return value
            })
            this.list = newList

            const { ...pagination } = res.data
            this.tableData = pagination
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产品列表
    getProductList() {
      productList({
        pageNum: 1,
        pageSize: 100,
        productName: ''
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            var list = res.data.data
            list.unshift({ productName: '全部产品', id: '' })
            this.productList = list
          }
        }
      }).catch(() => {
      })
    },
    // 产品选择改变调用函数，也是初始函数化调用的函数
    changeProductFun() {
      this.tableData.pageNum = 1
      // 获取设备列表
      this.getDeviceList()
      // 获取指定产品设备统计
      this.getDeviceStatistics()
    },
    // 获取指定产品设备统计
    getDeviceStatistics() {
      deviceStatistics({
        productId: this.productId
      }).then(res => {
        if (res.code === 200) {
          if (res.data) {
            // 设备各种状态数量
            this.deviceCountObj[0].count = res.data.deviceCount
            this.deviceCountObj[1].count = res.data.activateCount
            this.deviceCountObj[2].count = res.data.onlineCount
          }
        }
      }).catch(() => {})
      // 清空设备名称、固件版本筛选条件
      this.searchInputValue = ''
      this.fmVersionValue = ''
    },
    // 清除按钮
    clearFun(key) {
      this[key] = ''
      this.getDeviceList()
    },
    // 搜索按钮
    searchBtnTouch() {
      this.tableData.pageNum = 1
      this.getDeviceList()
    },

    /*
    设备启、禁用
    devices  设备对象数组
    batchEnable  批量启用、禁用
    */
    deviceEnable(devices, batchEnable) {
      if (this.authArr.indexOf('device_enable') < 0) return
      this.loading = true
      if (!batchEnable) {
        const value = devices[0]
        batchEnable = value.enable === 0 ? '1' : '0'
      }
      const ids = devices.map(function(value) {
        return value.id
      })
      deviceBatchEnable({ ids: ids, enable: batchEnable }).then(res => {
        this.getDeviceList()
        this.$message({
          type: res.code === 200 ? 'success' : 'warning',
          message: res.message
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /*
    删除指定设备
    deviceObj  设备对象
    */
    deleteClick(deviceObj) {
      this.$confirm('确定要删除此设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDeviceRequest([deviceObj])
      }).catch(() => {})
    },

    /*
    设备删除请求
    devices  需要删除的设备数组
    */
    deleteDeviceRequest(devices) {
      this.loading = true
      var ids = []
      devices.map(function(value) {
        ids.push(value.id)
      })

      deleteDevice({ ids: ids }).then(res => {
        if (res.code === 200) {
          // 判断是否删除最后一页全部设备
          if (this.tableData.pageNum !== 1 && this.tableData.pageNum === this.tableData.pageCount && devices.length === this.tableData.total % this.tableData.pageSize) {
            this.tableData.pageNum--
          }
          // 获取设备统计信息
          this.getDeviceStatistics()
          // 获取指定产品设备列表
          this.getDeviceList()
        }
        this.$message({
          type: res.code === 200 ? 'success' : 'warning',
          message: res.message
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 设备选择
    handleSelectionChange(val) {
      this.deviceSelection = val
      if (val.length) {
        this.bottomSeleDis = false
        this.bottomSeleChecked = true
      } else {
        this.bottomSeleDis = true
        this.bottomSeleChecked = false
      }
    },

    /*
    批量操作设备
    type 1:删除  2:禁用  3:启用
    */
    batchOperate(type) {
      if (type === 1) {
        this.deleteDeviceRequest(this.deviceSelection)
      } else {
        const enable = type === 2 ? '1' : '0'
        this.deviceEnable(this.deviceSelection, enable)
      }
    },

    /*
    底部选择框点击变化
    res  选择框更新后的值
    */
    bottomSeleChange(res) {
      if (!res) {
        this.$refs.multipleTable.clearSelection()
      }
    },

    // 添加设备
    toNewDevice(batch) {
      for (let i = 0; i < this.productList.length; i++) {
        const item = this.productList[i]
        if (item.id === this.productId) {
          this.selProduck = item
          break
        }
      }
      // this.selProduck = this.productList[this.productSelIndex];

      if (batch) { // 批量添加
        this.showBatchNewDevice = true
      } else { // 单个添加
        this.showNewDevice = true
      }
    },

    /*
    新建设备窗口关闭
    updata  是否更新数据
    */
    newDeviceClose(updata) {
      this.showNewDevice = false
      this.showBatchNewDevice = false
      if (updata) {
        // 获取设备统计信息
        this.getDeviceStatistics()
        // 获取指定产品设备列表
        this.getDeviceList()
      }
    },

    /*
    查看设备
    deviceObj  设备对象
    */
    lookClick(deviceObj) {
      this.$router.push(`deviceInfo?id=${deviceObj.id}`)
    },

    // 列表翻页
    handleCurrentChange() {
      // this.tableData.pageNum = 1
      this.getDeviceList()
    }

  }
}
</script>

<style lang="scss" scoped>
.deviceCountView {
  height: 45px;
  margin-left: 100px;
  border-left: 1px solid #ebecec;
  padding-left: 20px;
  font-size: 13px;
  color: #888;
  .Count {
    color: #373d41;
    font-size: 24px;
    margin-top: 5px;
  }
  .img {
    opacity: 0.7;
  }
}

.deviceStatusView {
  display: inline-block;
  width: 60px;
  div {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: pink;
    border-radius: 4px;
    margin-right: 4px;
  }
}

.bottomSeleView {
  position: absolute;
  top: 30px;
  left: 10px;
}
</style>
