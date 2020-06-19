
<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="data.pageNum"
      :page-size.sync="data.pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="data.total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
  import { scrollTo } from '@/utils/scroll-to'

  export default {
    name: 'Pagination',
    props: {
      data: {        
        pageCount: 1, //总页数
        total: 0, // 总条数
        pageSize: 10, //一页大小
        pageNum: 0, // 第几页 从0开始        
      },

      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 50, 80, 100]
        }
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      },
      background: {
        type: Boolean,
        default: true
      },
      autoScroll: {
        type: Boolean,
        default: true
      },
      hidden: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /**
       * 一页大小
       * @param size
       */
      handleSizeChange(size) {
        this.data.pageSize = size
        this.$emit('pagination')
        if (this.autoScroll) {
          scrollTo(0, 800)
        }
      },
      /**
       * 页数跳转
       * @param page
       */
      handleCurrentChange(page) {       
        this.data.pageNum = page
        this.$emit('pagination')
        if (this.autoScroll) {
          scrollTo(0, 800)
        }
      }
    }
  }
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }

  .pagination-container.hidden {
    display: none;
  }
</style>
