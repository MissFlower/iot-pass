<template>
  <div id="version">
    <div class="topCon">
      <span>产品：</span>
      <el-select v-model="productId"></el-select>
      <div class="df mt10">
        <div class="item">
          <div class="titlt">固件版本分布</div>
          <div class="con">
            <div id="chart" class="chart"></div>
          </div>
        </div>
        <div class="item">
          <div class="titlt">固件版本占比</div>
          <div class="con">
            <el-table :data="rightTableList">
              <el-table-column label="版本号"></el-table-column>
              <el-table-column label="设备数"></el-table-column>
              <el-table-column label="占比数"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="main mt20">
      <div class="f16 b mb20">设备列表</div>
      <el-select v-model="version">
        <el-option value="" label="全部版本"></el-option>
      </el-select>
      <el-table :data="list">
        <el-table-column label="设备名称"></el-table-column>
        <el-table-column label="固件版本"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import drawEcharts from '@/data/echartDrawFun.js'
export default {
  data () {
    return {
      productId: '',
      rightTableList: [],
      version: '',
      list: []
    }
  },
  mounted () {
    console.log('1111')
    drawEcharts.barChart('chart')
  }
}
</script>

<style lang="scss" scoped>
#version {
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
        height: 400px;
        width: 100%;
        position: relative;
        .chart {
          width: 100%;
          height: 100%;
        }
      }
    }
    .item + .item {
      margin-right: 16px;
    }
  }
}
</style>