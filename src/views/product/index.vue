
<!--
文件作者：zhaoyifeng
创建日期：2020.6.17
文件说明：产品管理
-->
<template>
  <div id="product">
    <div class="mb20">
      <div class="search_box">
        <el-input
          placeholder="请输入产品名称查询"
          v-model.trim="productName"
          class="searchInput"
          @keyup.enter.native="queryProduct"
        >
          <span slot="suffix">
            <i class="el-icon-search hand" @click="queryProduct"></i>
            <i class="el-icon-close hand" v-if="productName != ''" @click="clearFun"></i>
          </span>
        </el-input>
      </div>

      <el-button class="fr" type="primary" @click="handleAdd" v-if="authArr.indexOf('add_product') > -1">新建产品</el-button>
    </div>
    <product-list v-if="flag == 0" :data="listData" :loading="loading" @getList="getList"></product-list>
    <!-- 分页 -->
    <pagination :data="tableData" @pagination="changePage" class="tr" />
  </div>
</template>

<script>
import productList from './children/list'
import Pagination from '@/components/Pagination'
import { tableList } from '@/api/product'

export default {
  components: { productList, Pagination },
  data() {
    return {
      productName: '',
      flag: 0,
      listData: [],
      tableData: {
        pageCount: 0, // 总页数
        total: 0, // 总条数
        pageSize: 10, // 一页大小
        pageNum: 1 // 第几页 从0开始
      },
      loading: false
    }
  },
  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    }
  },
  watch: {
    productName: function(newVal, oldVal) {
      if (newVal === '' && oldVal !== '') {
        this.queryProduct()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clearFun() {
      this.productName = ''
      this.queryProduct()
    },
    queryProduct() {
      // 产品名称搜索
      this.tableData.pageNum = 1
      this.getList()
    },
    // 产品列表
    getList() {
      this.loading = true
      tableList({
        pageSize: this.tableData.pageSize,
        pageNum: this.tableData.pageNum,
        productName: this.productName
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          const { ...pagination } = res.data
          this.tableData = pagination
          if (res.data && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              item.createTime_ = item.createTime
                ? this.$fun.dateFormat(this.$fun.strFormatDate(item.createTime.replace(/-/g, '/')), 'yyyy-MM-dd hh:mm:ss')
                : ''
            })
          }
          this.listData = res.data.data
          this.tableData.total = res.data.total
        } else {
          this.$message.warning(res.message)
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err)
      })
    },
    // 新建产品
    handleAdd() {
      this.$router.push('add-product')
    },
    // 分页
    changePage() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
#product {
  position: relative;
  width: 100%;
  // height: 100%;
  padding: 20px;
}
.search_box {
  display: inline-block;
  margin-right: 20px;
}
</style>
