<template>
  <div id="version" v-loading="loading">
    <div v-if="productId">
      <div class="topCon">
        <span>产品：</span>
        <el-select v-model="productId">
          <el-option v-for="item in productList" :key="item.id" :value="item.id" :label="item.productName"></el-option>
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
        <el-select v-model="version" @change="getDevice">
          <el-option value="" label="全部版本"></el-option>
          <el-option v-for="(ver, index) in versionList" :key="index" :label="ver" :value="ver"></el-option>
        </el-select>
        <el-table :data="list">
          <empty-con slot="empty" class="mb20"></empty-con>
          <el-table-column label="设备名称" prop="deviceName"></el-table-column>
          <el-table-column label="固件版本" prop="version"></el-table-column>
          <el-table-column label="固件类型" prop="moduleType"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="noCon df jc_c">
      <svg-icon icon-class="noVersion"></svg-icon>
      <div class="ml20 f12">
        <div class="b">请选择固件所属产品</div>
        <div class="c9 mt5">选择后，您可随时从页面左上方选项进行切换</div>
        <el-select v-model="productId" size="mini" class="mt10" placeholder="请选择所属产品" filterable>
          <el-option v-for="item in productList" :key="item.id" :value="item.id" :label="item.productName"></el-option>
        </el-select>
      </div>
    </div>
    
  </div>
</template>

<script>
import drawEcharts from '@/data/echartDrawFun.js'
import emptyCon from '@/components/empty'
import { getProducts, getFmVers, getDeviceByVersiob, getVersionByProductId } from '@/api/fireware'
export default {
  components: {emptyCon},
  data () {
    return {
      loading: false,
      productId: '',
      rightTableList: [],
      version: '',
      versionList: [],
      list: [],
      productList: []
    }
  },
  watch: {
    productId: function () {
      this.getData()
      this.getVersion()
    }
  },
  mounted () {
    this.getProductList()
  },
  methods: {
    getData () {
      this.loading = true
      this.rightTableList = []
      getFmVers({
        productId: this.productId,
        pageNum: 1,
        pageSize: 200
      }).then(res => {
        // console.log(res)
        if (res.code === 200) {
          if (res.data.data.length > 0) {
            let obj = {}
            let setVersion = new Set()
            const setModuleType = new Set()
            this.rightTableList = res.data.data
            res.data.data.forEach(item => {
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
      })
    },
    drawFun (obj, setVersion, setModuleType) {
      const versionArr = [...setVersion]
      const moduleTypeArr = [...setModuleType]
      const reObj = {}
      moduleTypeArr.forEach(type => {
        reObj[type] = {counts: [], proportions: []}
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
        drawEcharts.barChart2('chart', {reObj, versionArr})
      })
    },
    getProductList () {
      this.loading = true
      this.productList = []
      getProducts({
        pageNum: 1,
        pageSize: 1000,
        productName: ''
      }).then(res => {
        if (res.code === 200) {
          this.productList = res.data.data
          // if (res.data.data && res.data.data.length > 0) {
          //   this.productId = res.data.data[0].id
          // }
        }
        this.loading = false
      })
    },
    getDevice () {
      this.loading = true
      this.list = []
      getDeviceByVersiob({
        version: this.version,
        pageNum: 1,
        pageSize: 200,
        productId: this.productId
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.data
        }
        this.loading = false
      })
    },
    getVersion () {
      this.versionList = []
      this.loading = true
      getVersionByProductId({
        productId: this.productId
      }).then(res => {
        if (res.code === 200) {
          this.versionList = res.data
          this.getDevice()
        }
        this.loading = false
      })
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
    .svg-icon{
      width: 60px;
      height: 60px;
    }
  }
}
</style>