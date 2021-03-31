<template>
  <div id="version" v-loading="loading">
    <div class="topCon">
      <span>产品：</span>
      <el-select v-model="productKey" size="mini">
        <el-option
          v-for="item in productList"
          :key="item.productKey"
          :value="item.productKey"
          :label="item.productName"
        ></el-option>
      </el-select>
      <span class="ml20">产品型号：</span>
      <el-select v-model="productType" @change="changeSelectProdunctType">
        <el-option v-for="(item, index) in productTypeArr" :key="index" :label="item.productType" :value="item.productType"></el-option>
      </el-select>
      <span class="ml20">固件模块类型：</span>
      <el-select
        v-model="moduleType"
        placeholder="固件模块类型"
        :disabled="productType == ''"
        class="w200"
      >
        <el-option v-for="(value, index) in moduleTypeMap" :key="index" :label="value" :value="value"></el-option>
      </el-select>
      <div class="df mt10">
        <div class="item">
          <div class="titlt">固件版本分布</div>
          <div class="con">
            <div id="chart" class="chart" v-if="rightTableList.length > 0"></div>
            <empty-con v-else></empty-con>
          </div>
        </div>
        <div class="item">
          <div class="titlt">固件版本占比</div>
          <div class="con">
            <el-table :data="rightTableList">
              <empty-con slot="empty" class="mb20"></empty-con>
              <el-table-column label="版本号" prop="version"></el-table-column>
              <el-table-column label="固件类型" prop="moduleType"></el-table-column>
              <el-table-column label="设备数" prop="deviceCount"></el-table-column>
              <el-table-column label="占比数" prop="proportion"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="main mt20">
      <div class="f16 b mb20">设备列表</div>
      <el-input v-model="versionForm.deviceName" placeholder="请输入设备名称" class="w200 mr20 searchInput">
        <span slot="suffix">
          <i class="el-icon-search hand" @click="getDevice" />
          <i v-if="versionForm.deviceName != ''" class="el-icon-close hand" @click="clearFun" />
        </span>
      </el-input>
      <el-select v-model="version" @change="getDevice">
        <el-option value label="全部版本"></el-option>
        <el-option v-for="(ver, index) in versionList" :key="index" :label="ver" :value="ver"></el-option>
      </el-select>
      <el-table :data="list">
        <empty-con slot="empty" class="mb20"></empty-con>
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column label="固件版本" prop="version"></el-table-column>
        <el-table-column label="固件类型" prop="moduleType"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleChange"
        :current-page.sync="versionForm.pageNum"
        :page-size="versionForm.pageSize"
        layout="total, prev, pager, next"
        class="tr mt20"
        :total="versionTotal"
      ></el-pagination>
    </div>
    <!-- <div v-else class="noCon df jc_c">
      <img src="../../assets/imgs/fm_version.png" width="80px">
      <div class="ml20 f12">
        <div class="b">请选择固件所属产品</div>
        <div class="c9 mt5">选择后，您可随时从页面左上方选项进行切换</div>
        <el-select v-model="productKey" class="mt10" placeholder="请选择所属产品" filterable>
          <el-option
            v-for="item in productList"
            :key="item.productKey"
            :value="item.productKey"
            :label="item.productName"
          ></el-option>
        </el-select>
      </div>
    </div> -->
  </div>
</template>

<script>
import drawEcharts from '@/data/echartDrawFun.js'
import emptyCon from '@/components/empty'
import { getProducts, getFmVers, getDeviceByVersiob, getVersionByProductId, getListModuleConfigByProductKey } from '@/api/fireware'
export default {
  components: { emptyCon },
  data() {
    return {
      loading: false,
      productKey: '',
      hardwareVersion: '',
      moduleType: '',
      rightTableList: [],
      version: '',
      versionList: [],
      list: [],
      productList: [],
      versionForm: {
        version: '',
        pageNum: 1,
        pageSize: 10,
        productKey: '',
        productType: '',
        moduleType: '',
        deviceName: ''
      },
      versionTotal: 0,
      productType: '',
      productTypeArr: [],
      moduleTypeMap: []
    }
  },
  watch: {
    productKey: function() {
      this.productType = ''
      this.moduleType = ''
      this.productTypeArr = []
      this.moduleTypeMap = []
      this.versionForm.version = ''
      this.getVersion()
      this.getProductType()
    },
    moduleType: function() {
      this.version = ''
      this.versionForm.pageNum = 1
      this.getData()
      if (this.moduleType !== '') {
        this.getVersion()
        this.getDevice()
      } else {
        this.versionList = ''
        this.list = []
      }
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    getData() {
      this.loading = true
      this.rightTableList = []
      getFmVers({
        productKey: this.productKey,
        pageNum: 1,
        pageSize: 200,
        productType: this.productType,
        moduleType: this.moduleType
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            const obj = {}
            const setVersion = new Set()
            const setModuleType = new Set()
            this.rightTableList = res.data
            res.data.forEach(item => {
              setVersion.add(item.version)
              setModuleType.add(item.moduleType)
              if (!obj[item.version]) {
                obj[item.version] = {}
              }
              const row = obj[item.version]
              if (!row[item.moduleType]) {
                row[item.moduleType] = {}
              }
              row[item.moduleType] = item
            })
            this.drawFun(obj, setVersion, setModuleType)
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    drawFun(obj, setVersion, setModuleType) {
      const versionArr = [...setVersion].reverse()
      const moduleTypeArr = [...setModuleType]
      const reObj = {}
      moduleTypeArr.forEach(type => {
        reObj[type] = { counts: [], proportions: [] }
        const row = reObj[type]
        versionArr.forEach(ver => {
          const item = obj[ver]
          if (item[type]) {
            row.counts.push(item[type].deviceCount)
            row.proportions.push(item[type].proportion)
          } else {
            row.counts.push(0)
            row.proportions.push(0)
          }
        })
      })
      this.$nextTick(() => {
        drawEcharts.barChart2('chart', { reObj, versionArr })
      })
    },
    getProductList() {
      this.loading = true
      this.productList = []
      getProducts({
        pageNum: 1,
        pageSize: 1000,
        productName: ''
      }).then(res => {
        if (res.code === 200) {
          this.productList = res.data.data
          if (this.productList.length > 0) {
            this.productKey = this.productList[0].productKey
          }
        }
        this.loading = false
      })
    },
    getDevice() {
      this.loading = true
      this.list = []
      this.versionForm.version = this.version
      this.versionForm.productKey = this.productKey
      this.versionForm.moduleType = this.moduleType
      this.versionForm.productType = this.productType
      getDeviceByVersiob(this.versionForm).then(res => {
        if (res.code === 200) {
          this.list = res.data.data ? res.data.data : []
          this.versionTotal = res.data.total
        }
        this.loading = false
      })
    },
    clearFun() {
      this.versionForm.deviceName = ''
      this.getDevice()
    },
    handleChange(page) {
      this.versionForm.pageNum = page
      this.getDevice()
    },
    getVersion() {
      this.versionList = []
      this.loading = true
      getVersionByProductId({
        productKey: this.productKey,
        moduleType: this.moduleType,
        productType: this.productType
      }).then(res => {
        if (res.code === 200) {
          this.versionList = res.data
        }
        this.loading = false
      })
    },
    getProductType() {
      this.productTypeArr = []
      getListModuleConfigByProductKey(this.productKey).then(res => {
        if (res.code === 200) {
          this.productTypeArr = res.data ? res.data : []
          if (this.productTypeArr.length > 0) {
            this.productType = this.productTypeArr[0].productType
            this.changeSelectProdunctType()
          }
        }
      })
    },
    changeSelectProdunctType() {
      for (let i = 0; i < this.productTypeArr.length; i++) {
        const row = this.productTypeArr[i]
        if (row.productType === this.productType) {
          this.moduleTypeMap = row.moduleTypeList
          if (this.moduleTypeMap.length > 0 && this.moduleTypeMap.indexOf(this.moduleType) > -1) {
            this.getData()
          } else {
            this.moduleType = this.moduleTypeMap[0]
          }
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#version {
  font-size: 14px;
  .topCon {
    .item {
      position: relative;
      padding: 20px;
      background: #fff;
      flex: 1;
      border: 1px solid rgb(222, 222, 222);
      .title {
        font-size: 16px;
        font-weight: 700;
        color: #373d41;
      }
      .con {
        height: 300px;
        width: 100%;
        position: relative;
        overflow: auto;
        .chart {
          width: 100%;
          height: 100%;
        }
      }
    }
    .item + .item {
      margin-left: 16px;
    }
  }
  .noCon {
    padding: 60px 0;
    .svg-icon {
      width: 60px!important;
      height: 60px!important;
    }
  }
}
</style>
