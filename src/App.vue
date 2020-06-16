<template>
  <div id="app" v-loading="loading">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    if (this.$cookie.getValue("userName")) {
      this.$store.dispatch("setUserInfo", {
        userName: this.$cookie.getValue("userName")
      });
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
  }
};
</script>
