import axios from "axios";
import cookie from "@/utils/cookie.js";
import {Message} from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 500000
  // crossDomain: true //设置cross跨域
});

service.interceptors.request.use(
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

service.interceptors.response.use(
  response => {
    const res = response.data ? response.data : {};
    if (res.code === 200) {
      return res
    }     
     //错误提示
     let message = res.message || res.msg || 'Error'
     Message({
       message: message,
       type: 'error',
       duration: 5 * 1000
     })
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
