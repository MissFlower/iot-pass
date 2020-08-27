<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-21 15:03:28
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-27 10:15:28
-->
<template>
  <ElAutocomplete
    ref="measureAutocomplete"
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
      <div class="name">{{ item.metricShowName }}</div>
    </template>
  </ElAutocomplete>
</template>
<script>
import { getMetircsByProduct } from 'src/api/perspectives'
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
      measureList: [] // 度量list
    }
  },
  watch: {
    productKey: {
      handler(newKey, oldKey) {
        // 调用度量列表接口
        if (newKey && newKey !== oldKey) {
          this.getMetircsList()
        }
      }
    }
  },
  methods: {
    async getMetircsList() {
      try {
        const { data } = await getMetircsByProduct({
          productKey: this.productKey
        })
        this.measureList = data
        this.$refs.measureAutocomplete.focus()
      } catch (error) {
        this.$message.error(error)
      }
    },
    querySearchAsync(queryString, callback) {
      // 过滤列表
      const results = queryString ? this.measureList.filter(this.createFilter(queryString)) : this.measureList
      callback(results)
    },
    createFilter(queryString) {
      return (measure) => {
        return (measure.metricShowName.includes(queryString))
      }
    },
    handleSelect(data) {
      // 选择事件
      this.$emit('input', data.metricShowName)
      this.$emit('measureChange', data)
    }
  }
}
</script>
<style>
.product-autocomplete .el-autocomplete-suggestion__wrap {
  max-height: 200px;
}
</style>
