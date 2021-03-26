<template>
  <div id="addProduct">
    <el-table :data="data" border v-loading="loading">
      <el-table-column label="产品信息" width="400">
        <template slot-scope="{row}">
          <div class="blue f14 hand mb10" @click="productDetail(row.productKey)">{{ row.productName }}</div>
          <div>
            <div>产品ID： {{ row.id }}</div>
            <div>产品key：{{ row.productKey }}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ID" prop="id"></el-table-column> -->
      <!-- <el-table-column label="产品KEY" prop="productKey"></el-table-column> -->
      <!-- <el-table-column label="产品名称" prop="productName"></el-table-column> -->
      <el-table-column label="节点类型" align="center">
        <template slot-scope="scope">{{ nodeTypeData(scope.row.nodeType) }}</template>
      </el-table-column>
      <el-table-column label="连网方式" align="center">
        <template slot-scope="scope">{{ netTypeData(scope.row.netType) }}</template>
      </el-table-column>
      <el-table-column label="数据格式" align="center">
        <template slot-scope="scope">{{ scope.row.dataFormat == 1 ? 'Json' : '透传/自定义' }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div :style="{'background-color': productStatusObj[scope.row.productStatus].color}" class="point"></div>
          {{ scope.row.productStatus == 1 ? '发布' : '开发中' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime_" width="150" align="center"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="productDetail(scope.row.productKey)">查看</el-button> -->
          <el-button type="text" @click="goEqu(scope.row.id)">设备管理</el-button>
          <el-button
            type="text"
            :disabled="scope.row.productStatus"
            @click="delProduct(scope.row.productKey)"
            v-show="authArr.indexOf('product_delete') > -1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { productStatusObj } from '@/data/constants' // 数据
import { delProduct } from '@/api/product'
import { nodeTypeData, netTypeData } from './transformation'
export default {
  name: 'ProductList',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      productStatusObj
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  methods: {
    nodeTypeData(val) {
      return nodeTypeData(val)
    },
    netTypeData(val) {
      return netTypeData(val)
    },
    // 设备管理
    goEqu(id) {
      this.$router.push(`/device/deviceManage?productId=${id}`)
    },
    // 产品详情
    productDetail(key) {
      this.$router.push({ path: `detail/${key}` })
    },
    // 删除产品
    delProduct(productKey) {
      this.$confirm('确定要删除产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProduct({ productKey }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$emit('getList')
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
