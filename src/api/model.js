import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
const headerFrom_json = {
  "Content-Type": "application/json"
};

/**
 * 查看产品的功能
 * 
 * productKey	string	是	产品key
 */

 export function getModelByproductKey (data) {
  return request({
    url: "model/get",
    method: "get",
    params: data
  });

 }
/**
 * 增加自定义功能
 * 
 *  productKey	   string	  是	产品key
    abilityType	   int	    是	元素类型1属性 2服务 3事件
    name	         string	  是	名称
    identifier	   string	  是	唯一标识符
    accessMode	       int	    是	读写类型 0读写 1只读
    dataType       {        对象	     是	
                  type      数据类型 0int32整数型 1float单精度浮点 2double双精度浮点 3enum枚举
                                4bool布尔型     5text字符串 6date时间型 7struct结构体 8array数组
                  specs	{   对象	     是	数据类型定义
                      unit	         string	  否	单位
                      step	         string	  是	步长
                      max	           string	  是	最大值
                      min	           string	  是	最小值    
                  }
            }	
    description	   string	  否	描述
 */
export function addCustomAbility (data) {
  return request({
    url: "/model/addCustomAbility",
    method: "post",
    headers: headerFrom_json,
    params: data
  });
}

/**
 * 编辑自定义功能
 * 
 *  productKey	   string	  是	产品key
    abilityType	   int	    是	元素类型1属性 2服务 3事件
    name	         string	  是	名称
    identifier	   string	  是	唯一标识符
    rwFlag	       int	    是	读写类型 0读写 1只读
    dataType	     对象	     是	数据类型0int32整数型 1float单精度浮点 2double双精度浮点 3enum枚举
                                4bool布尔型     5text字符串 6date时间型 7struct结构体 8array数组
    description	   string	  否	描述
    dataSpecs	     对象	     是	数据类型定义
    unit	         string	  否	单位
    step	         string	  是	步长
    dataType	     string	  是	数据类型
    max	           string	  是	最大值
    min	           string	  是	最小值
 */
export function updateCustomAbility (data) {
  return request({
    url: "/model/update",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/**
 * 
 * 批量添加标准功能
 * 
 *  productKey	 string	  是	产品key
    propertyIds	 string[]	否	标准属性id数组
    serviceIds	 string[]	否	标准服务id数组
    eventIds	   string[]	否	标准事件id数组
 */

export function addStdAbility (data) {
  return request({
    url: '/model/batchAddStdAbility',
    method: 'post',
    data
  })
}

/**
 * 单个功能删除
 *    productKey	string	是	产品key
      abilityType	int	是	1属性 2服务 3事件
      identifier	string	是	唯一标识符
 */
export function deleteAbility (data) {
  return request({
    url: '/model/deleteAbility',
    method: 'post',
    data
  })
}