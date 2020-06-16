<template>
  <div id="layout_i">
    <paas-header></paas-header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import paasHeader from "./header";
export default {
  components: { paasHeader }
};
</script>

<style lang="scss" scoped>
#layout_i {
  position: relative;
  width: 100%;
  height: 100%;
  .main {
    padding-top: 61px;
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>
