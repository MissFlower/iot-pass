<template>
  <div id="layout">
    <lHeader />
    <div id="main" :class="collapse ? 'openSidebar' : 'hideSidebar'">
      <lLeft></lLeft>
      <lRight></lRight>
    </div>
  </div>
</template>

<script>
import lHeader from './header'
import lLeft from './left'
import lRight from './right'
export default {
  components: { lHeader, lLeft, lRight },
  computed: {
    collapse() {
      return this.$store.state.collapse.opened
    }
  }
}
</script>

<style lang="scss" scoped>
#layout {
  position: relative;
  width: 100%;
  height: 100%;
  #main {
    position: relative;
    width: 100%;
    margin-top: 1px;
    height: calc(100% - 60px);
    display: flex;
  }
}
</style>
