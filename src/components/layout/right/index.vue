<template>
  <div id="right">
    <navBar />
    <div class="show-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import navBar from './navbar'
export default {
  components: { navBar }
}
</script>

<style lang="scss" scoped>
#right {
  position: relative;
  height: 100%;
  flex: 1;
  overflow: auto;
  .show-main {
    position: relative;
    height: calc(100% - 45px);
    overflow: auto;
    margin-left: 20px;
  }
}
</style>
