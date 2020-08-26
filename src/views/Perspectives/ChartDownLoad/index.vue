<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-26 13:18:31
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-26 14:30:58
-->
<template>
  <ElButton :disabled="!instance" type="primary" class="download-chart" @click="handleDownload">图表下载</ElButton>
</template>
<script>
export default {
  name: 'ChartDownLoad',
  props: {
    instance: {
      type: Object,
      default: null
    },
    fileName: {
      type: String,
      default: '图表'
    }
  },
  data() {
    const tagA = document.createElement('a')
    return {
      tagA
    }
  },
  methods: {
    handleDownload() {
      this.tagA.setAttribute('download', this.fileName)

      this.tagA.setAttribute('href', this.instance.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      }))

      this.tagA.click()
    }
  }
}
</script>
<style lang="scss" scoped>
  .download-chart {
    color: #fff;
  }
</style>
