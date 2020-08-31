<template>
  <div id="header">
    <div class="con">
      <img class="logo hand" src="../assets/logo.png" @click.stop="gotoIndex" />
      <span class="title b ml10">IOT管理系统</span>
      <div class="flex1 control f16">
        <span>文档</span>
        <span>控制台</span>
        <span class="link_success hand">登录</span>
        <span class="btn_success hand">注册</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#header {
  position: fixed;
  height: 60px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) !important;
  line-height: 60px;
  background-color: #fff;
  z-index: 1;
  .con {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .logo {
      height: 30px;
    }
    .title {
      color: #434343;
      font-size: 24px;
    }
    .control {
      text-align: right;
      span + span {
        margin-left: 10px;
      }
      .link_success {
        color: #39AF59;
      }
      .btn_success {
        padding: 5px 12px;
        background-color: #39AF59;
        color: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
