import axios from "axios";
import cookie from "@/utils/cookie.js";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000
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
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
