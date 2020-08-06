/*
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 14:26:58
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-04 15:59:34
 */
import Cookies from 'js-cookie'
// import api from "@/data/api"

export default {
  getValue(str) {
    return Cookies.get(str)
  },
  setValue(str, val) {
    Cookies.set(str, val)
  },
  removeValue(str) {
    Cookies.remove(str)
  }
}
