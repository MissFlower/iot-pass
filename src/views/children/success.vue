<template>
  <div id="success">
    <div v-if="flag == 1" class="con df ai_c">
      <div>
        <svg-icon icon-class="success"></svg-icon>
      </div>
      <div>
        <div class="f16 c3">修改成功，maw****3@163.com可作为您的辅助邮箱</div>
        <div class="f12 c9">
          该邮箱不能作为登录名使用，仅用于安全校验及必要时的紧急联系
        </div>
        <div class="f12">返回 <span class="red">首页</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: 1
    };
  },
  mounted() {
    // this.flag = this.$route.query.id;
  }
};
</script>

<style lang="scss" scoped>
#success {
  position: relative;
  width: 100%;
  height: 100%;
  .con {
    margin: 0 auto;
    padding: 30px 0;
    width: 990px;
    height: auto;
    border: 1px solid #e1e1ca;
    background: #edfed0;
    position: relative;
    zoom: 1;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
