/**
 * create by liuxixiu
 * date 2020-06-18
 */
import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
const headerFrom_json = {
  "Content-Type": "application/json"
};

/**
 * 获取固件列表
 * @param data
 */
export function getFmList(data) {
  return request({
    url: "/fm/list",
    method: "post",
    headers: headerFrom_json,
    data
  });
}

/**
 * 新增固件上传文件
 * @param data
 */
export function uploadFile(data) {
  return request({
    url: "/fm/uploadFile",
    method: "post",
    data
  });
}
/**
 * 获取固件产品类型
 * @param data
 */
export function getFmType(data) {
    return request({
        url: "/fm/getFmTypes ",
        method: "post",
        data
    });
}
/**
 * 保存新增固件
 * @param data
 */
export function saveFm(data) {
  return request({
    url: "/fm/save",
    method: "post",
    headers: headerFrom_json,
    data
  });
}

/**
 * 删除固件
 * @param data
 */
export function deleteFm(data) {
  return request({
    url: "/fm/del",
    method: "post",
    data
  });
}

/**
 * 固件详情
 * @param data
 */
export function getFmDetails(data) {
  return request({
    url: "/fm/get",
    method: "post",
    data
  });
}
/**
 * 获取产品列表
 * @param data
 */
export function getProducts(data) {
  return request({
    url: "/product/list",
    method: "get",
    params: data
  });
}

/**
 * 固件编辑
 * @param data
 */
export function updateFm(data) {
  return request({
    url: "/fm/update",
    method: "post",
    data
  });
}
/**
 * 新增验证固件
 * @param data
 */
export function addVerify(data) {
  return request({
    url: "/upgrade/addVerify",
    method: "post",
    headers: headerFrom_json,
    data
  });
}
/**
 * 验证固件前校验
 * @param data
 */
export function getVerifyFirmInfo(data) {
    return request({
        url: "/upgrade/getVerifyFirmInfo",
        method: "post",
        headers: headerFrom_json,
        data
    });
}
/**
 * 批量升级
 * @param data
 */
export function saveUpgrade(data) {
  return request({
    url: "/upgrade/save",
    method: "post",
    data
  });
}

/**
 * 重新升级设备
 * @param data
 */
export function retryPublishUpdateMsg(data) {
  return request({
    url: "upgrade/retryPublishUpdateMsg",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/**
 * 批次管理
 * @param data
 */
export function upgradeList(data) {
  return request({
    url: "upgrade/list",
    method: "post",
    headers: headerFrom_json,
    data
  });
}

/**
 * 设备列表
 * @param data
 */
export function upgradeDeviceList(data) {
  return request({
    url: "upgrade/upgradeDevicelist",
    method: "post",
    headers: headerFrom_json,
    data
  });
}
/**
 * 获取设备列表
 * @param data
 */
export function getDeviceList(data) {
  return request({
    url: "device/listByPage",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/**
 * 固件详情 上方数据
 */
export function statistics(data) {
  return request({
    url: "upgrade/statistics",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/**
 * 
 * 固件详情中的下载
 * 
 * 
 */

 export function getUploadFilePath (data) {
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

  export function getDirectedUpgradeList (data) {
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
      productId	  Long	  是	产品id
      moduleType	String	是	选中的固件产品类型
   */

   export function getSrcVersionList (data) {
     return request({
       url: '/upgrade/getSrcVersionList',
       method: 'post',
       data
     })
   }
/**
 * 版本分布根据产品查询版本接口
 * 
 * productId	Long	是	产品id
 * /fm/getFirmWareVersionDistribution
 */

 export function getFmVers (data) {
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

  export function getDeviceByVersiob (data) {
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

 export function getVersionByProductId (data) {
  return request({
    url: '/fm/getproductDeviceVersion',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/**
 * 设备列表针对设备取消升级接口
 * 
 * batchNo	Long	是	批次id
  deviceId	Long	是	设备id
  check   0：没选 ，1选
 */

 export function cancelDeviceUpgrade (data) {
  return request({
    url: '/upgrade/cancelDeviceUpgrade',
    method: 'post',
    data: Qs.stringify(data)
  })
 }

 /**
 * 批次取消升级接口
 * 
 * batchNo	Long	是	批次id
  check   0：没选 ，1选
 */

export function cancelBatchUpgrade (data) {
  return request({
    url: '/upgrade/cancelBatchUpgrade',
    method: 'post',
    data: Qs.stringify(data)
  })
 }

 