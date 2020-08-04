/*
 * @Description: 公共常量 魔法字符
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 16:31:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-03 16:59:08
 */ 

// 事件类型
export const EVENT_TYPE = Object.freeze({
  'alert': '信息',
  'warn': '告警',
  'error': '故障'
})
// 时间类型
export const TIME_TYPE = Object.freeze([
  {
    label: '1小时',
    value: 1
  },
  {
    label: '24小时',
    value: 24
  },
  {
    label: '7天',
    value: 168
  },
  {
    label: '自定义',
    value: 0
  }
])