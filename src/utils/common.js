export default {
  trim: str => {
    if (typeof str === 'string') {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    } else {
      return str
    }
  },
  dateFormat: (date, fmt) => {
    if (typeof date === 'string' || !date) {
      return date
    }
    fmt = fmt || 'yyyy-MM-dd'
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  strFormatDate: (date) => {
    if (!date) {
      return
    }
    if (date.indexOf('T') > -1) {
      if (date.indexOf('+')) {
        let str = date.split('+')[1]
        if (str) {
          str = str.split(':')[0] * 1
        } else {
          str = 0
        }
        date = date.replace('Z', '')
        date = date.replace('T', ' ')
        date = date.split('+')[0]
      }
    }
    return new Date(date)
  },
  // strFormatDateStr (date) {
  //   if (date) {
  //     let da = new Date(date)
  //     item.time_ = da.getFullYear() + '-' + (da.getMonth() + 1) + '-' + da.getDate() + ' ' + da.getHours() + ':' + da.getMinutes() + ':' + da.getSeconds()
  //   }
  // },
  debounce: (func, wait, immediate) => {
    let timeout, args, context, timestamp, result
    const later = function () {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
      // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
    return function (...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
      return result
    }
  }
}
