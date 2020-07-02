import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
    "Content-Type": "application/x-www-form-urlencoded"
};
const headerFrom_json = {
    "Content-Type": "application/json"
};
const headerFrom_Get = {
    "Content-Type": "application/json;charset=UTF-8"
};
export function deviceList(data) {
    // 设备列表
    return request({
        url: "/device/listByPage",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function deleteDevice(data) {
    // 设备删除
    return request({
        url: "/device/delete",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function productList(data) {
    // 产品列表
    return request({
        url: "/product/list",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function createDevice(data) {
    // 新建设备
    return request({
        url: "/device/createDevice",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function deviceInfo(data) {
    // 设备详情
    return request({
        url: "/device/getDevice",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function deviceUpdate(data) {
    // 设备编辑
    return request({
        url: "/device/updateDevice",
        method: "post",
        headers: headerFrom,
        data: Qs.stringify(data)
    });
}

export function deviceBatchEnable(data) {
    // 设备启、禁用
    return request({
        url: "/device/batchEnable",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function deviceStatistics(data) {
    // 指定产品设备统计
    return request({
        url: "/device/statistics",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function topicList(data) {
    // 获取topic列表
    return request({
        url: "/device/sysTopic",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}


/**
 * 设备自定义topic新增、编辑
 * @param {
    *   topicName	String	是	topic名称
    *   productKey	String	是	产品 productKey
    *   topicAccess	int	是	topic权限，1：订阅，2：发布，3：订阅+发布  
    *    
    *  --- 编辑加上topicId ---
    *   topicId	Long	是	topic Id
    * }
    */
  export function topicCustomEdit(data) { 
    return request({
      url: "topic/customEdit",
      method: "post",
      headers: headerFrom,
      data: Qs.stringify(data)
    });
  }
  
   /**
   * 设备自定义topic删除
   * @param {
    *   topicId	Long	是	topic Id
    *   productKey	String	是	产品 productKey
    * }
    */
  export function topicDelete(data) { 
    return request({
      url: "topic/customDelete",
      method: "post",
      headers: headerFrom,
      data: Qs.stringify(data)
    });
  }
  
  
  /**
   * 设备自定义topic列表 * 
    *   
    * @param {
      *   pageNum	Long	否	分页页数，默认：1
      *   pageSize	Long	否	分页条数，默认：20
      *   productKey	String	是	产品 productKey      
      * }
      */
     export function topicCustomList(data) { 
      return request({
        url: "topic/customList",
        method: "get",
        params: data  
      });
    }