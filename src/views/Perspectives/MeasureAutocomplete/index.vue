<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 15:03:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-21 16:47:31
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
  props: {
    productKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      measureList: [
        {
          name: '度量1'
        },
        {
          name: '度量2'
        },
        {
          name: '度量3'
        },
        {
          name: '度量4'
        },
        {
          name: '度量5'
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
      const results = queryString ? this.measureList.filter(this.createFilter(queryString)) : this.measureList
      callback(results)
    },
    createFilter(queryString) {
      return (measure) => {
        return (measure.name.includes(queryString))
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
</style>
