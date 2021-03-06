import Vue from 'vue'
import cookie from '@/utils/cookie.js'
import md5 from 'md5'
import fun from '@/utils/common.js'
import axios from 'axios'

const vue = new Vue()

Vue.prototype.$axios = axios
Vue.prototype.$event = vue
Vue.prototype.$cookie = cookie
Vue.prototype.$md5 = md5
Vue.prototype.$fun = fun
