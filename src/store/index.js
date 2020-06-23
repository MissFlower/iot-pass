import Vue from "vue";
import Vuex from "vuex";
import getters from "./getter";
import collapse from "./modules/collapse";
import app from "./modules/app";
import router from "./modules/router"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    collapse,
    router
  },
  getters
});
