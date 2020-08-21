<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 15:03:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-21 18:36:30
-->
<template>
  <ElAutocomplete
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
      <div class="name">{{ item.name }}</div>
    </template>
  </ElAutocomplete>
</template>
<script>
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
  },
  methods: {
    querySearchAsync(queryString, callback) {
      // 过滤列表
      const results = queryString ? this.productList.filter(this.createFilter(queryString)) : this.productList
      callback(results)
    },
    createFilter(queryString) {
      return (product) => {
        return (product.name.includes(queryString))
      }
    },
    handleSelect(data) {
      // 选择事件
      this.$emit('input', data.name)
      this.$emit('change', data)
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
