<template>
  <div id="app" v-loading="loading">
    <keep-alive :exclude="excludeStr">
      <router-view v-if="isRouterAlive" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      excludeStr: 'Breadcrumb, Register, EmailBand, PhoneBand, SedCodeVerify, Verify'
    }
  },
  computed: {
    loading() {
      return this.$store.state.app.loading
    }
  },
  mounted() {
    if (localStorage.getItem('info')) {
      this.$store.dispatch(
        'setUserInfo',
        JSON.parse(localStorage.getItem('info'))
      )
    }
    if (this.$cookie.getValue('access_token')) {
      this.$store.dispatch('setLoginStatus', true)
    } else {
      this.$store.dispatch('setLoginStatus', false)
    }
  },
  methods: {
    reload(flag) {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
        // 刷新 重新获取用户权限  通过flag控制
        if (flag) {
          this.getUserPower()
        }
      })
    },
    async getUserPower() {
      const list = await this.$store.dispatch('getUserInfo')
      const asyncList = await this.$store.dispatch('setRouters', list)
      if (asyncList) {
        this.$router.addRoutes(asyncList)
      }
    }
  }
}
</script>
