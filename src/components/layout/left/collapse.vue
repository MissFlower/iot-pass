<template>
  <div class="collapse" @click.stop="setCollapse">
    <i class="collapse-icon" :class="collapse ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
  </div>
</template>

<script>
export default {
  computed: {
    collapse() {
      return this.$store.state.collapse.opened
    }
  },
  methods: {
    setCollapse() {
      this.$store.dispatch('setOpened', !this.collapse)
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse {
    position: absolute;
    top: 50%;
    left: 100%;
    height: 60px;
    z-index: 1;
    transform: translateY(-50%);
    border: 9px solid transparent;
    border-left: 20px solid #eeeff1;
    cursor: pointer;
    color: #eeeff1;
    .collapse-icon {
      position: absolute;
      left: -17px;
      color: #aaa;
      line-height: 40px;
    }
  }
</style>
