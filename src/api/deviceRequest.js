import request from '@/utils/request'
// import Qs from 'qs'

// const headerFrom = {
//   'Content-Type': 'application/x-www-form-urlencoded'
// }
const headerFrom_json = {
  'Content-Type': 'application/json'
}
const headerFrom_Get = {
  'Content-Type': 'application/json;charset=UTF-8'
}
export function deviceList(data) {
  // 设备列表
  return request({
    url: '/device/listByPage',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function deleteDevice(data) {
  // 设备删除
  return request({
    url: '/device/delete',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function productList(data) {
  // 产品列表
  return request({
    url: '/product/list',
    method: 'get',
    headers: headerFrom_Get,
    params: data
  })
}

export function createDevice(data) {
  // 添加设备
  return request({
    url: '/device/createDevice',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function batchCreateDevice(data) {
  // 批量添加设备
  return request({
    url: '/device/patchCreateDevice',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function deviceInfo(data) {
  // 设备详情
  return request({
    url: '/device/getDevice',
    method: 'get',
    headers: headerFrom_Get,
    params: data
  })
}

export function deviceUpdate(data) {
  // 设备编辑
  return request({
    url: '/device/updateDevice',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function deviceBatchEnable(data) {
  // 设备启、禁用
  return request({
    url: '/device/batchEnable',
    method: 'post',
    headers: headerFrom_json,
    data: data
  })
}

export function deviceStatistics(data) {
  // 指定产品设备统计
  return request({
    url: '/device/statistics',
    method: 'get',
    headers: headerFrom_Get,
    params: data
  })
}

export function topicList(data) {
  // 获取topic列表
  return request({
    url: '/device/sysTopic',
    method: 'get',
    headers: headerFrom_Get,
    params: data
  })
}

export function topicCustomList(data) {
  return request({
    url: 'topic/customDeviceList',
    method: 'get',
    params: data
  })
}

/**
 * @description: 事件管理接口
 * @param { productKey: 产品key, deviceName: 设备名称, identifier: 物模型中的属性标识符 }
 * @param { startTime: 开始时间, endTime: 结束时间, pageSize: 表格默认20条|图表默认100条 }
 * @param { eventType: 事件类型, asc: 排序规则 }
 * @return {type}
 * @author: AiDongYang
 */
export function getEventForList(params) {
  // 物模型数据-事件管理
  return request({
    url: '/device/getEventForList',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 服务调用接口
 * @param { productKey: 产品key, deviceName: 设备名称, identifier: 物模型中的属性标识符 }
 * @param { startTime: 开始时间, endTime: 结束时间, pageSize: 表格默认20条|图表默认100条 }
 * @param { asc: 排序规则 }
 * @return {type}
 * @author: AiDongYang
 */
export function getServiceForList(params) {
  // 物模型数据-服务调用
  return request({
    url: '/device/getServiceForList',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 设备物模型属性列表
 * @param {productKey: 产品key, deviceName: 设备名称}
 * @return {type}
 * @author: AiDongYang | WangHongWei
 */
export function getAllProperties(params) {
  return request({
    url: '/device/getAllProperties',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 获取属性最新状态
 * @param {productKey: 产品key, deviceName: 设备名称, identifierList: 属性标识符列表}
 * @return {type}
 * @author: AiDongYang | WangHongWei
 */
export function getPropertyStatus(params) {
  return request({
    url: '/device/getPropertyStatus',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 查看数据 表格图表 接口
 * @param { productKey: 产品key, deviceName: 设备名称, identifier: 物模型中的属性标识符 }
 * @param { startTime: 开始时间, endTime: 结束时间, pageSize: 表格默认20条|图表默认100条 }
 * @return {type}
 * @author: AiDongYang | WangHongWei
 */
export function getTableData(params) {
  return request({
    url: '/device/getTableData',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 下发日志上传指令
 * @param { productKey: 产品key, deviceName: 设备名称, remark: 备注, param: 参数 }
 * @return {type}
 * @author: AiDongYang | ZhouChangBao
 */
export function uploadInstruct(params) {
  return request({
    url: '/api/localLog/uploadInstruct',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 获取下载地址
 * @param { recordId: 日志ID }
 * @return {type}
 * @author: AiDongYang | ZhouChangBao
 */
export function downloadPath(params) {
  return request({
    url: '/api/localLog/downloadPath',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * @description: 本地日志列表
 * @param { productKey: 产品key, deviceName: 设备名称, pageNum: 页码, pageSize: 每页条数 }
 * @return {type}
 * @author: AiDongYang | ZhouChangBao
 */
export function localLogList(params) {
  return request({
    url: '/api/localLog/list',
    method: 'post',
    headers: headerFrom_json,
    data: params
  })
}

/**
 * /device/getDeviceVersions
 * 设备详情  固件版本查看
 * deviceName  设备名称
 * productKey  产品key
 */

export function getDeviceVersions(data) {
  return request({
    url: '/device/getDeviceVersions',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}
