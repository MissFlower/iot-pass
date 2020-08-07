// 解析节点类型数据
export function nodeTypeData(val) {
  var str = ''
  switch (val) {
    case 1:
      str = '直连设备'
      break
    case 2:
      str = '网关子设备'
      break
    default:
      str = '网关设备'
      break
  }
  return str
}

// 解析认证方式数据
export function authTypeData(val) {
  var str = ''
  switch (val) {
    case 1:
      str = '直连设备'
      break
    case 2:
      str = '网关子设备'
      break
    default:
      str = '网关设备'
      break
  }
  return str
}

// 解析连网方式数据
export function netTypeData(val) {
  var str = ''
  switch (val) {
    case 1:
      str = 'wifi'
      break
    case 2:
      str = '蜂窝数据'
      break
    case 3:
      str = '以太网'
      break
    case 4:
      str = 'LoRaWAN'
      break
    default:
      str = '其他'
      break
  }
  return str
}
