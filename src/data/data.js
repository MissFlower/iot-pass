/**
 * 项目用到的常量
 * 
 */
 export default {
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
  },
  // 固件升级任务状态
  taskStatusObj: {
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
  },
  scopeTypeObj: {
    0: '全部',
    1: '定向',
    2: '区域',
    3: '灰度' 
  },
  fmStatusObj: {
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
  },
  eventType: {
    'alert': '信息',
    'warn': '告警',
    'error': '故障'
  },
  timeType: [
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
  ]
 }