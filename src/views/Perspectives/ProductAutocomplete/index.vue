<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 15:03:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-25 17:45:11
-->
<template>
  <ElAutocomplete
    ref="productAutocomplete"
    v-bind="$attrs"
    :fetch-suggestions="querySearchAsync"
    popper-class="product-autocomplete"
    v-on="$listeners"
    @select="handleSelect"
  >
    <i
      class="el-icon-search product-search"
      slot="suffix"
    />
    <template slot-scope="{ item }">
      <div class="name">{{ item.productName }}</div>
    </template>
  </ElAutocomplete>
</template>
<script>
import { tableList } from '@/api/product'
export default {
  name: 'ProductAutocomplete',
  data() {
    return {
      productList: [
        {
          name: '产品1'
        },
        {
          name: '产品2'
        },
        {
          name: '产品3'
        },
        {
          name: '产品4'
        },
        {
          name: '产品5'
        },
        {
          name: '产品1'
        },
        {
          name: '产品2'
        },
        {
          name: '产品3'
        },
        {
          name: '产品4'
        },
        {
          name: '产品5'
        }
      ]
    }
  },
  created() {
    // 调用产品列表接口
    this.getProductList()
  },
  methods: {
    async getProductList() {
      try {
        const { data } = await tableList({
          pageSize: 999,
          pageNum: 1,
          productName: ''
        })
        this.productList = data.data
        this.$refs.productAutocomplete.focus()
      } catch (error) {
        this.$message.error(error)
      }
    },
    querySearchAsync(queryString, callback) {
      // 过滤列表
      const results = queryString ? this.productList.filter(this.createFilter(queryString)) : this.productList
      callback(results)
    },
    createFilter(queryString) {
      return (product) => {
        return (product.productName.includes(queryString))
      }
    },
    handleSelect(data) {
      // 选择事件
      console.log(1)
      this.$emit('input', data.productName)
      this.$emit('productChange', data)
    }
  }
}
</script>
<style>
.product-autocomplete .el-autocomplete-suggestion__wrap {
  max-height: 200px;
}
.operation-from-content .el-input__prefix, .el-input__suffix {
  display: flex;
  align-items: center;
}
</style>
