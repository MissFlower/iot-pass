import axios from 'axios'
import cookie from '@/utils/cookie.js'
// import { Message } from "element-ui";
// import router from '@/router'
// import { clearLoginInfo } from '@/data/fun'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 500000
  // crossDomain: true //设置cross跨域
})

service.interceptors.request.use(
  config => {
    if (cookie.getValue('access_token')) {
      config.headers['tk'] = cookie.getValue('access_token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data ? response.data : {}
    if (res.code === 401) {
      // Message.error(res.message)
      // router.push("/login")
      // clearLoginInfo()
      // router.push("/login")
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
