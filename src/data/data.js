/**
 * 项目用到的常量
 * 
 */

 export  default {
  abilityTypeObj: {
    '1': '属性',
    '2': '服务',
    '3': '事件'
  },
  typeObj: {
    '1': '标准',
    '2': '自定义'
  },
  dataTypeObj: {
    'int': '0',
    'float': '1',
    'double': '2',
    'enum': '3',
    'bool': '4',
    'text': '5',
    'date': '6',
    'struct': '7',
    'array': '8',
  },
  dataTypeNumObj: {
    '0': 'int',
    '1': 'float',
    '2': 'double',
    '3': 'enum',
    '4': 'bool',
    '5': 'text',
    '6': 'date',
    '7': 'struct',
    '8': 'array'
  },
  dataTypeTextObj: {
    'int': 'int32 (整数型)',
    'float': 'float (单精度浮点型)',
    'double': 'double (双精度浮点型)',
    'enum': 'enum (枚举型)',
    'bool': 'bool (布尔型)',
    'text': 'text (字符串)',
    'date': 'date (时间型)',
    'struct': 'struct (结构体)',
    '7': 'struct (结构体)',
    'array': 'array (数组)',
  },
  // 固件的升级过程状态
  upgradeStatusObj: {
    0: '待推送',
    1: '待推送',
    2: '已推送',
    3: '升级中',
    4: '成功',
    5: '失败'
  },
  // 固件升级任务状态
  taskStatusObj: {
    0: '待升级',
    1: '升级中',
    2: '升级完成',
    3: '已取消' 
  },
  scopeTypeObj: {
    0: '全部',
    1: '定向',
    2: '区域',
    3: '灰度' 
  },
  fmStatusObj: {
    0: '未验证',
    1: '验证中',
    2: '已验证',
    3: '验证失败' 
  }
 }