<template>
  <div id="layout">
    <paas-header></paas-header>
    <paas-main></paas-main>
  </div>
</template>

<script>
import paasHeader from './header'
import paasMain from './main'
export default {
  components: { paasHeader, paasMain }
}
</script>

<style lang="scss" scoped>
#layout {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
