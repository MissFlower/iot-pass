/*
 * @Description: 过滤方法
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-06 14:25:46
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-18 10:22:41
 */
// import parseTime, formatTime 用于 filter
export { parseTime, formatTime } from '@/utils'
import { parseTime } from '@/utils'
/**
 * @description: 将日期格式转为带毫秒的格式 2020-08-06 12:33:55.168
 * @param {(string|number)} // time时间戳
 * @return {string | null}
 * @author: AiDongYang
 */
export function parseMillTime(time, cFormat) {
  if (!(/^[0-9]+$/.test(time))) {
    return time
  }
  const timeStr = time.toString()
  const formatTime = timeStr.substring(0, 10).padEnd(3, '0')
  const time_str = parseTime(formatTime, cFormat) + '.' + timeStr.slice(-3)
  return time_str
}
