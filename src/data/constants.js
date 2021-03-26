/*
 * @Description: 公共常量 魔法字符
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-03 16:31:10
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-06 10:25:31
 */

// 事件类型
export const EVENT_TYPE = Object.freeze({
  info: '信息',
  warn: '告警',
  fault: '故障'
})
export const EVENT_TYPE1 = Object.freeze({
  INFO: 1,
  WARN: 2,
  FAULT: 3
})
// 事件文案
export const EVENT_TYPE_TEXT = Object.freeze({
  [EVENT_TYPE1.INFO]: '信息',
  [EVENT_TYPE1.WARN]: '告警',
  [EVENT_TYPE1.FAULT]: '故障'
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

export const abilityTypeObj = {
  '1': '属性',
  '2': '服务',
  '3': '事件'
}
export const typeObj = {
  '1': '标准',
  '2': '自定义'
}
export const dataTypeObj = {
  'int': '0',
  'float': '1',
  'double': '2',
  'enum': '3',
  'bool': '4',
  'text': '5',
  'date': '6',
  'struct': '7',
  'array': '8'
}
export const dataTypeNumObj = {
  '0': 'int',
  '1': 'float',
  '2': 'double',
  '3': 'enum',
  '4': 'bool',
  '5': 'text',
  '6': 'date',
  '7': 'struct',
  '8': 'array'
}
export const dataTypeTextObj = {
  'int': 'int32 (整数型)',
  'float': 'float (单精度浮点型)',
  'double': 'double (双精度浮点型)',
  'enum': 'enum (枚举型)',
  'bool': 'bool (布尔型)',
  'text': 'text (字符串)',
  'date': 'date (时间型)',
  'struct': 'struct (结构体)',
  '7': 'struct (结构体)',
  'array': 'array (数组)'
}
// 固件的升级过程状态
export const upgradeStatusObj = {
  0: {
    label: '待推送',
    color: '#888'
  },
  1: {
    label: '待推送',
    color: '#888'
  },
  2: {
    label: '已推送',
    color: '#ffc440'
  },
  3: {
    label: '升级中',
    color: '#0070cc'
  },
  4: {
    label: '成功',
    color: '#1e8e3e'
  },
  5: {
    label: '失败',
    color: '#d93026'
  }
}
// 固件升级任务状态
export const taskStatusObj = {
  0: {
    label: '待升级',
    color: '#888'
  },
  1: {
    label: '升级中',
    color: '#0070cc'
  },
  2: {
    label: '升级完成',
    color: '#1e8e3e'
  },
  3: {
    label: '已取消',
    color: '#888'
  }
}
export const scopeTypeObj = {
  0: '全部',
  1: '定向',
  2: '区域',
  3: '灰度'
}
export const fmStatusObj = { // 固件验证状态
  0: {
    label: '未验证',
    color: '#888'
  },
  1: {
    label: '验证中',
    color: '#0070cc'
  },
  2: {
    label: '已验证',
    color: '#1e8e3e'
  },
  3: {
    label: '验证失败',
    color: '#d93026'
  }
}
export const productStatusObj = { // 产品状态
  0: {
    label: '发布中',
    color: '#0070cc'
  },
  1: {
    label: '已发布',
    color: '#1e8e3e'
  }
}
