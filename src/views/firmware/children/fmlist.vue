<!--
文件作者：mawenjuan
创建日期：2020.7.24
文件说明：固件列表
 -->
<template>
  <div id="fmList">
    <div class="df ai_c mb20">
      <el-button type="primary" @click="addItem">新增固件</el-button>
      <el-input
        v-model="form.fmName"
        placeholder="请输入固件名称"
        class="searchInput w180 ml20"
        @keyup.enter.native="searchList"
      >
        <span slot="suffix">
          <i class="el-icon-search hand" @click="searchList"></i>
          <i class="el-icon-close hand" v-if="form.fmName != ''" @click="clearFun"></i>
        </span>
      </el-input>
      <el-select
        v-model="form.productKey"
        class="w180 ml20"
        filterable
        :filter-method="userFilter"
        @change="changeSelect"
        clearable
      >
        <el-option label="全部产品" value></el-option>
        <el-option
          v-for="item in products"
          :key="item.id"
          :label="item.productName"
          :value="item.productKey"
        ></el-option>
      </el-select>
      <span class="ml20 f12">产品型号：</span>
      <el-select v-model="form.productType" @change="changeSelectProdunctType" class="w120">
        <el-option v-for="(item, index) in productTypeArr" :key="index" :label="item.productType" :value="item.productType"></el-option>
      </el-select>
      <span class="ml20 f12">固件模块类型：</span>
      <el-select
        v-model="form.moduleType"
        placeholder="固件模块类型"
        :disabled="form.productType == ''"
        class="w120"
        @change="searchList()"
      >
        <el-option v-for="(value, index) in moduleTypeArr" :key="index" :label="value" :value="value"></el-option>
      </el-select>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <!-- <el-table-column label="固件ID" prop="id"></el-table-column> -->
      <el-table-column label="固件名称" prop="fmName">
        <template slot-scope="scope">
          {{ scope.row.fmName }}
          <el-tooltip>
            <el-tag
              type="primary"
            >{{ scope.row.fmType == 1 ? '整包' : (scope.row.fmType == 2 ? '差分' : scope.row.fmType) }}</el-tag>
            <div slot="content">
              <div>{{ scope.row.fmName }} / {{ scope.row.fmType == 1 ? '整包' : (scope.row.fmType == 2 ? '差分' : scope.row.fmType) }}</div>
              <div>固件ID：{{ scope.row.id }}</div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="产品型号" prop="productType"></el-table-column>
      <el-table-column label="固件类型" prop="moduleType"></el-table-column>
      <el-table-column label="升级前版本" prop="srcVersion"></el-table-column>
      <el-table-column label="升级后版本" prop="destVersion"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="formatCreateTime"></el-table-column>
      <el-table-column label="固件状态" prop="fmStatus">
        <template slot-scope="scope">
          <div :style="{'background-color': fmStatusObj[scope.row.fmStatus].color}" class="point"></div>
          {{ fmStatusObj[scope.row.fmStatus].label }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a class="oprate_btn" @click="checkFm(scope.row)">验证固件</a>
          |
          <el-tooltip
            class="item"
            effect="dark"
            content="请先验证固件，再进行批量升级"
            placement="top"
            v-if="scope.row.fmStatus !== 2"
          >
            <a class="oprate_btn disabled">批量升级</a>
          </el-tooltip>
          <a v-else class="oprate_btn" @click="upgradeList(scope.row)">批量升级</a>
          |
          <a
            class="oprate_btn"
            @click="toDetails(scope.row.id, scope.row.productName, scope.row.srcVersion)"
          >查看</a>
          <span v-if="authArr.indexOf('firmware_del') > -1">
            <span> | </span>
            <a class="oprate_btn" @click="delItem(scope.row.id)"> 删除</a>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="form.pageNum"
      :page-size="form.pageSize"
      layout="total, prev, pager, next"
      :total="fmTotal"
      class="tr mt20"
    ></el-pagination>
    <!-- 新增固件 -->
    <AddFirmware
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      @changeVisible="changeVisible"
      @changeList="changeList"
    />
    <!-- 验证固件进程 -->
    <check-process
      v-if="checkProcessFlag"
      :status="checkStatus"
      @upgrade="upgradeProcess"
      @close="closeCheckProcess"
    ></check-process>
    <check-firmware
      v-if="checkFmVisible"
      :checkFmVisible="checkFmVisible"
      :checkInfo="checkInfo"
      :fmDeviceList="fmDeviceList"
      @checkVisible="checkVisible"
      @refreshList="fetchFmList"
    ></check-firmware>
    <upgrade-firmware
      v-if="upgradeFmVisible"
      :upgradeFmVisible="upgradeFmVisible"
      :checkInfo="checkInfo"
      @upgradeVisible="upgradeVisible"
    ></upgrade-firmware>
  </div>
</template>

<script>
import { fmStatusObj } from '@/data/constants' // 数据

import AddFirmware from './addFirmware'
import checkFirmware from './checkFirmware'
import upgradeFirmware from './upgradeFirmware'
import checkProcess from './checkProcess'

import { getFmList, deleteFm, getProducts, getVerifyFirmInfo, getListModuleConfigByProductKey } from '@/api/fireware'

export default {
  components: { AddFirmware, checkProcess, checkFirmware, upgradeFirmware },
  data() {
    return {
      loading: false,
      productsValue: '',
      form: {
        fmName: '',
        productKey: '',
        productType: '',
        moduleType: '',
        pageSize: 20,
        pageNum: 1
      },
      fmTotal: 0,
      list: [],
      productForm: {
        pageNum: 1,
        pageSize: 100,
        productName: ''
      },
      products: [],
      // 新增固件
      dialogFormVisible: false,
      checkFmId: '',
      checkStatus: '',
      checkInfo: null,
      checkProcessFlag: false, // 固件验证进程弹框
      checkFmVisible: false, // 固件验证弹框
      fmDeviceList: [],
      upgradeFmVisible: false, // 批量升级弹框
      fmStatusObj,
      moduleTypeArr: [],
      productTypeArr: []
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  mounted() {
    this.fetchFmList()
    this.getProductList()
  },
  methods: {
    // 获取固件列表
    fetchFmList() {
      this.loading = true
      getFmList(this.form).then(res => {
        if (res.code === 200) {
          this.list = res.data.data
          this.fmTotal = res.data.total
          this.loading = false
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      }).catch(error => {
        this.$message.error(error)
        this.loading = false
      })
    },
    // 获取产品列表
    getProductList() {
      getProducts(this.productForm).then(res => {
        this.products = res.data.data
        this.userFilter()
      })
    },
    // 筛选产品数据
    userFilter(query = '') {
      const arr = this.products.filter(item => {
        return item.productName.includes(query)
      })
      if (arr.length > 50) {
        this.products = arr.slice(0, 50)
      } else {
        this.products = arr
      }
    },
    changeSelect() {
      this.form.productType = ''
      this.form.moduleType = ''
      this.productTypeArr = []
      this.moduleTypeArr = []
      this.getProductType()
      this.searchList()
    },
    // 筛选函数
    searchList() {
      this.handleCurrentChange(1)
    },
    // 清空函数
    clearFun() {
      this.form.fmName = ''
      this.searchList()
    },
    // 分页函数
    handleCurrentChange(page) {
      this.form.pageNum = page
      this.fetchFmList()
    },
    // 创建时间转化函数
    formatCreateTime(row) {
      return row.createTime ? this.$fun.dateFormat(
        this.$fun.strFormatDate(row.createTime.replace(/-/g, '/')),
        'yyyy-MM-dd hh:mm:ss'
      ) : ''
    },
    // 新增固件弹框显示
    addItem() {
      this.dialogFormVisible = true
    },
    // 新增固件弹框关闭
    changeVisible() {
      this.dialogFormVisible = false
    },
    changeList() {
      this.fetchFmList()
    },
    // 验证固件
    checkFm(row) {
      // 未验证的固件进行验证，验证中或已验证的固件弹窗提示
      if (row.fmStatus === 0 || row.fmStatus === 3) {
        this.getVerifyFirmInfo(row)
        this.checkInfo = row
      } else {
        this.checkStatus = row.fmStatus
        this.checkInfo = row
        this.checkProcessFlag = true
      }
    },
    // 验证固件前校验是否存在设备
    getVerifyFirmInfo(row) {
      const data = {
        pageNum: 1,
        pageSize: 10,
        fmId: row.id,
        srcVersions: row.srcVersion,
        productType: row.productType
      }
      getVerifyFirmInfo(data).then(res => {
        if (res.code === 200) {
          this.fmDeviceList = res.data.data
          this.checkFmVisible = true
        } else if (res.code === 9003) {
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
            }
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 验证固件组件关闭
    checkVisible() {
      this.checkFmVisible = false
    },
    // 验证进程 关闭回调
    closeCheckProcess() {
      this.checkProcessFlag = false
    },
    // 验证进程 批量升级回调
    upgradeProcess() {
      this.closeCheckProcess()
      this.upgradeFmVisible = true
    },
    // 批量升级 弹框显示
    upgradeList(row) {
      if (row.fmStatus === 2) {
        this.checkInfo = row
        this.upgradeFmVisible = true
      }
    },
    upgradeVisible() {
      this.upgradeFmVisible = false
    },
    // 查看详情
    toDetails(id, productName, srcVersion) {
      this.$router.push({
        path: 'details',
        query: {
          id: id,
          productName: productName,
          srcVersion: srcVersion
        }
      })
    },
    // 删除固件
    deleteFm(fmId) {
      const formData = new FormData()
      formData.append('fmId', fmId)
      deleteFm(formData).then(res => {
        if (res.code === 200) {
          this.fetchFmList()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 删除固件
    delItem(fmId) {
      this.$confirm('您确定要删除此固件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFm(fmId)
      }).catch(error => {
        console.log(error)
      })
    },
    getProductType() {
      this.productTypeArr = []
      getListModuleConfigByProductKey(this.form.productKey).then(res => {
        if (res.code === 200) {
          this.productTypeArr = res.data ? res.data : []
          // if (this.productTypeArr.length > 0) {
          //   this.productType = this.productTypeArr[0].productType
          //   this.changeSelectProdunctType()
          // }
        }
      })
    },
    changeSelectProdunctType() {
      this.searchList()
      this.form.moduleType = ''
      for (let i = 0; i < this.productTypeArr.length; i++) {
        const row = this.productTypeArr[i]
        if (row.productType === this.form.productType) {
          this.moduleTypeArr = row.moduleTypeList
          // if (this.moduleTypeArr.length > 0) {
          //   this.form.moduleType = this.moduleTypeArr[0]
          //   // this.getData()
          // }
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$default: #409eff;
#fmList {
  .oprate_btn {
    color: $default;
    cursor: pointer;
  }
  .disabled {
    color: #999;
    cursor: text;
  }
}
</style>
