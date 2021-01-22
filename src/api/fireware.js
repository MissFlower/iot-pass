/**
 * create by liuxixiu
 * date 2020-06-18
 */
import request from '@/utils/request'
import Qs from 'qs'

const headerFrom = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
const headerFrom_json = {
  'Content-Type': 'application/json'
}

/**
 * 获取固件列表
 * @param data
 */
export function getFmList(data) {
  return request({
    url: '/fm/list',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}

/**
 * 新增固件上传文件
 * @param data
 */
export function uploadFile(data) {
  return request({
    url: '/fm/uploadFile',
    method: 'post',
    data
  })
}
/**
 * 获取固件模块类型
 * @param data
 */
export function getFmType(data) {
  return request({
    url: '/fm/getFmTypes ',
    method: 'post',
    data
  })
}
/**
 * 保存新增固件
 * @param data
 */
export function saveFm(data) {
  return request({
    url: '/fm/save',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}

/**
 * 删除固件
 * @param data
 */
export function deleteFm(data) {
  return request({
    url: '/fm/del',
    method: 'post',
    data
  })
}

/**
 * 固件详情
 * @param data
 */
export function getFmDetails(data) {
  return request({
    url: '/fm/get',
    method: 'post',
    data
  })
}
/**
 * 获取产品列表
 * @param data
 */
export function getProducts(data) {
  return request({
    url: '/product/list',
    method: 'get',
    params: data
  })
}

/**
 * 固件编辑
 * @param data
 */
export function updateFm(data) {
  return request({
    url: '/fm/update',
    method: 'post',
    data
  })
}
/**
 * 新增验证固件
 * @param data
 */
export function addVerify(data) {
  return request({
    url: '/upgrade/addVerify',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}
/**
 * 验证固件前校验
 * @param data
 */
export function getVerifyFirmInfo(data) {
  return request({
    url: '/upgrade/getVerifyFirmInfo',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}
/**
 * 批量升级
 * @param data
 */
export function saveUpgrade(data) {
  return request({
    url: '/upgrade/save',
    method: 'post',
    data
  })
}

/**
 * 重新升级设备
 * @param data
 */
export function retryPublishUpdateMsg(data) {
  return request({
    url: 'upgrade/retryPublishUpdateMsg',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/**
 * 批次管理
 * @param data
 */
export function upgradeList(data) {
  return request({
    url: 'upgrade/list',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}

/**
 * 设备列表
 * @param data
 */
export function upgradeDeviceList(data) {
  return request({
    url: 'upgrade/upgradeDevicelist',
    method: 'post',
    headers: headerFrom_json,
    data
  })
}
/**
 * 获取设备列表
 * @param data
 */
export function getDeviceList(data) {
  return request({
    url: 'device/listByPage',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}
/**
 * 固件详情 上方数据
 */
export function statistics(data) {
  return request({
    url: 'upgrade/statistics',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/**
 *
 * 固件详情中的下载
 *
 *
 */

export function getUploadFilePath(data) {
  return request({
    url: '/fm/getUploadFilePath',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/**
  * 定向升级选择设备列表
  *
  *
  * deviceName	String	否	设备名称
    srcVersions	String	否	版本筛选(带升级版本号,格式如:110,112,113)
  */

export function getDirectedUpgradeList(data) {
  return request({
    url: '/upgrade/directedUpgradeList',
    method: 'post',
    data
  })
}

/**
   *
   * 待升级版本列表
   * 请求方式:post ,json格式
      productKey  Long	  是	产品key
      moduleType	String	是	选中的固件模块类型，
      productType 产品型号
      destVersion  可选
   */

export function getSrcVersionList(data) {
  return request({
    url: '/upgrade/getSrcVersionList',
    method: 'post',
    data
  })
}
/**
 * 版本分布根据产品查询版本接口
 *
 * productKey	Long	是	产品key
 * /fm/getFirmWareVersionDistribution
 */

export function getFmVers(data) {
  return request({
    url: '/fm/getFirmWareVersionDistribution',
    method: 'post',
    data
  })
}

/**
  * 根据版本查询设备版本列表接口
  *
  * version	String	是	版本
  */

export function getDeviceByVersiob(data) {
  return request({
    url: '/fm/getDeviceVersion',
    method: 'post',
    data
  })
}

/**
  * 根据产品ID查询设备版本列表接口
  *
  * version	String	是	版本
  */

export function getVersionByProductId(data) {
  return request({
    url: '/fm/getproductDeviceVersion',
    method: 'post',
    // headers: headerFrom,
    data
  })
}

/**
 * 设备列表针对设备取消升级接口
 *
 * batchNo	Long	是	批次id
  productKey	Long	是	产品key
 */

export function cancelDeviceUpgrade(data) {
  return request({
    url: '/upgrade/cancelDeviceUpgrade',
    method: 'post',
    data
  })
}

/**
 * 批次取消升级接口
 *
 * batchNo	Long	是	批次id
  check   0：没选 ，1选
 */

export function cancelBatchUpgrade(data) {
  return request({
    url: '/upgrade/cancelBatchUpgrade',
    method: 'post',
    data
  })
}
/**
 * 各个状态下的设备数量接口
 * batchNo	Long	是	批次id
 *
 */
export function getSttatusCount(data) {
  return request({
    url: 'upgrade/getUpgradeDeviceStatusCount',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * 批量升级  统计设备数量
 * productKey:  产品Key
    srcVersions: 待升级版本 支持多选 如"116,115",
    moduleType:  固件类型
 *
 */
export function getDeviceCount(data) {
  return request({
    url: 'upgrade/getUpgradeDeviceBySrcVersion',
    method: 'post',
    data
  })
}

/**
 * 根据产品KEY获取产品型号和固件模块类型
 * productKey
*/

export function getListModuleConfigByProductKey(key) {
  return request({
    url: `/fm/listModuleConfigByProductKey?productKey=${key}`,
    method: 'get'
  })
}

/**
 * 定向升级文件上传
 * file	文件	是	上传文件
 * fmId	文件	是	固件id
 */

export function uploadDeviceFile(data, cb) {
  return request({
    url: `/upgrade/uploadDeviceFile`,
    method: 'post',
    data,
    onUploadProgress: cb || function() {
    }
  })
}

/**
 * 模块列表
 * fm/moduleList
 */
export function moudleList(data) {
  return request({
    url: `/fm/moduleList`,
    method: 'post',
    data
  })
}

/**
 * 添加模块
 * 参数同编辑
 * fm/saveModule
 */

export function saveModule(data) {
  return request({
    url: `/fm/saveModule`,
    method: 'post',
    data
  })
}

/**
 * 编辑模块
 * fm/updateModule
 * productKey	String	是	前端选择产品，传给后端产productKey
 * productType	String	是	输入,前端控制:不包含特殊字符，长度限制不大于50个字符
 * moduleType	String	是	输入,前端控制:不包含特殊字符，长度限制不大于50个字符
 * hardwareVersion	String	是	|输入,前端控制:不包含特殊字符，长度限制不大于50个字符
 * uid	Long	是	|当前登录用户userId。user/info接口返回的id
 */

export function updateModule(data) {
  return request({
    url: `/fm/updateModule`,
    method: 'post',
    data
  })
}
