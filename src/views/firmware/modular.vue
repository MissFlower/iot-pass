<!--
文件作者：mawenjuan
创建日期：2021.1.20
文件说明：模块列表
 -->
<template>
  <div id="modular" v-loading="loading">
    <div>
      <el-button type="primary" size="mini" @click="addFun">添加模块</el-button>
      <!-- <el-input v-model="modular" placeholder="请输入模块名称" size="mini" class="w200 ml20 searchInput">
        <span slot="suffix">
          <i class="el-icon-search hand" @click="handleChange(1)" />
          <i v-if="modular != ''" class="el-icon-close hand" @click="clearFun" />
        </span>
      </el-input> -->
      <el-select v-model="formData.productKey" size="mini" class="ml20" @change="changeSelect">
        <el-option label="全部产品" value=""></el-option>
        <el-option
          v-for="item in productList"
          :key="item.productKey"
          :value="item.productKey"
          :label="item.productName"
        ></el-option>
      </el-select>
      <span class="ml20 f12">产品型号：</span>
      <el-select v-model="formData.productType" @change="changeSelectProdunctType" class="w120">
        <el-option v-for="(item, index) in productTypeArr" :key="index" :label="item.productType" :value="item.productType"></el-option>
      </el-select>
      <span class="ml20 f12">固件模块类型：</span>
      <el-select
        v-model="formData.moduleType"
        placeholder="固件模块类型"
        :disabled="formData.productType == ''"
        class="w120"
        @change="handleChange(1)"
      >
        <el-option v-for="(value, index) in moduleTypeArr" :key="index" :label="value" :value="value"></el-option>
      </el-select>
    </div>
    <el-table :data="list" border class="mt20">
      <el-table-column label="固件模块类型" prop="moduleType"></el-table-column>
      <!-- <el-table-column label="模块类型" prop="moduleType"></el-table-column> -->
      <el-table-column label="所属产品" prop="productName"></el-table-column>
      <el-table-column label="产品型号" prop="productType"></el-table-column>
      <el-table-column label="硬件版本" prop="hardwareVersion"></el-table-column>
      <el-table-column label="添加时间" prop="createTime"></el-table-column>
      <!-- <el-table-column label="模块描述"></el-table-column> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span class="hand blue" @click="handleEdit(scope.row)">编辑</span>
          <!-- <span class="hand red ml20">删除</span> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleChange"
      :current-page.sync="formData.pageNum"
      :page-size="formData.pageSize"
      layout="total, prev, pager, next"
      class="tr mt20"
      :total="total"
    ></el-pagination>
    <add-modular v-if="addFlag" :row="editRow" @close="closeFun"></add-modular>
  </div>
</template>

<script>
import addModular from './children/addModular'
import { getProducts, moudleList, getListModuleConfigByProductKey } from '@/api/fireware'
export default {
  components: { addModular },
  data() {
    return {
      loading: false,
      formData: {
        productKey: '',
        productType: '',
        moduleType: '',
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      productList: [],
      modular: '',
      list: [],
      addFlag: false,
      moduleTypeArr: [],
      productTypeArr: [],
      editRow: null
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    getModular() {
      this.loading = true
      this.list = []
      moudleList(this.formData).then(res => {
        if (res.code === 200) {
          this.list = res.data.data
          this.total = res.data.total
        }
        this.loading = false
      })
    },
    clearFun() {
      this.modular = ''
      this.handleChange(1)
    },
    getProductList() {
      this.loading = true
      this.productList = []
      this.formData.productKey = ''
      getProducts({
        pageNum: 1,
        pageSize: 1000,
        productName: ''
      }).then(res => {
        if (res.code === 200 && res.data.data) {
          this.productList = res.data.data
          // this.formData.productKey = this.productList[0].productKey
          this.handleChange(1)
        }
        this.loading = false
      })
    },
    changeSelect() {
      this.formData.productType = ''
      this.formData.moduleType = ''
      this.productTypeArr = []
      this.moduleTypeArr = []
      this.getProductType()
      this.handleChange(1)
    },
    addFun() {
      this.editRow = null
      this.addFlag = true
    },
    closeFun(bool) {
      this.addFlag = false
    },
    getProductType() {
      this.productTypeArr = []
      getListModuleConfigByProductKey(this.formData.productKey).then(res => {
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
      this.handleChange(1)
      this.formData.moduleType = ''
      for (let i = 0; i < this.productTypeArr.length; i++) {
        const row = this.productTypeArr[i]
        if (row.productType === this.formData.productType) {
          this.moduleTypeArr = row.moduleTypeList
          // if (this.moduleTypeArr.length > 0) {
          //   this.formData.moduleType = this.moduleTypeArr[0]
          //   // this.getData()
          // }
          break
        }
      }
    },
    handleEdit(row) {
      this.editRow = JSON.parse(JSON.stringify(row))
      this.addFlag = true
    },
    handleChange(num) {
      this.formData.pageNum = num
      this.getModular()
    }
  }
}
</script>
