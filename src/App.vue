<template>
  <div id="app" v-loading="loading">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  mounted() {
    if (localStorage.getItem("info")) {
      this.$store.dispatch("setUserInfo", JSON.parse(localStorage.getItem("info")))
    }
    if (this.$cookie.getValue("access_token")) {
      this.$store.dispatch("setLoginStatus", true);
    } else {
      this.$store.dispatch("setLoginStatus", false);
    }
  },
  computed: {
    loading() {
      return this.$store.state.app.loading;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
