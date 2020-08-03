<!--
 * @Description: 
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-07-31 18:02:55
--> 
<template>
  <div id="noPath">
    <div class="df">
      <div>
        <svg-icon icon-class="404"></svg-icon>
      </div>
      <div class="lh20 ml10">
        <div class="b">您的访问出错了</div>
        <div class="c6">很抱歉，您访问的页面不存在，请检查您输入的地址是否正确</div>
        <el-button type="primary" class="mt20" @click="handleBack">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack () {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
#noPath {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  .svg-icon {
    width: 70px;
    height: 70px;
  }
}
</style>