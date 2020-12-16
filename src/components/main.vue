<template>
  <main>
    <div class="left">
      <paas-menu></paas-menu>
    </div>
    <div class="right">
      <breadcrumb></breadcrumb>
      <!-- <div class="right-main"> -->
      <router-view />
      <!-- </div> -->
    </div>
  </main>
</template>

<script>
import paasMenu from './children/menu'
import breadcrumb from './breadcrumb'
export default {
  components: { paasMenu, breadcrumb },
  computed: {
    flag() {
      if (this.$route.path === '/home') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  padding-top: 61px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .left {
    position: relative;
    width: 240px;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    overflow: auto;
  }
  .right {
    position: relative;
    width: calc(100% - 200px);
    height: 100%;
    overflow: auto;
    padding-top: 45px;
    .right-main {
      position: relative;
      width: 100%;
      margin-top: 40px;
    }
  }
}
</style>
