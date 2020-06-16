import axios from "axios";
import Vue from "vue";
import cookie from "@/utils/cookie.js";
import md5 from "md5";
import fun from "@/utils/common.js";

const vue = new Vue();

// http请求拦截器
// let loadinginstace

axios.interceptors.request.use(
  config => {
    if (cookie.getValue("access_token")) {
      config.headers["tk"] = cookie.getValue("access_token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    const res = response.data ? response.data : {};
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

Vue.prototype.$event = vue;
Vue.prototype.$http = axios;
Vue.prototype.$cookie = cookie;
Vue.prototype.$md5 = md5;
Vue.prototype.$fun = fun;
