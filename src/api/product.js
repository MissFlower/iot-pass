/** 
<!-- 
文件作者：zhaoyifeng
创建日期：2020.6.17
文件说明：产品管理api
 -->
*/
import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
/**
 * 产品列表
 * @param {
 *  pageNum	int	是	当前页
 *  pageSize	int	是	每页取几条
 *  productName	string	否	产品名称
 * }
 */
export function tableList(data) {  
  return request({
    url: "product/list",
    method: "get",
    params: data   
  });
}
/**
 * 新建产品
 * @param {
*   categoryId	long	否	品类id，不传表示自定义品类
*   productName	string	是	产品名称
*   nodeType	int	是	节点类型 1直连设备，2网关子设备，3网关设备
*   netType	int	是	联网方式 1wifi,2蜂窝数据3以太网4LoRaWAN,5其他
*   dataFormat	int	是	数据格式 1Json,2透传/自定义
*   authType	int	是	认证方式 1设备秘钥 2 ID2 3 X.509证书
*   dynRegister	int	是	动态注册 0关 1开启
*   description	string	否	描述
* }
*/
export function productSave(data) { 
  return request({
    url: "product/save",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/**
 * 删除产品
 * @param {
  *   productKey	string	是	产品key 
  * }
  */
export function delProduct(data) { 
  return request({
    url: "product/del",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}




/**
 * 获取产品密钥
 * @param {
  *   productKey	string	是	产品key 
  * }
  */
export function findSecret(data) { 
  return request({
    url: "product/findSecret",
    method: "get",
    params: data 
  });
}

/**
 * 获取产品详情
 * @param {
  *   productKey	string	是	产品key 
  * }
  */
export function getProduct(data) { 
  return request({
    url: "product/get",
    method: "get",
    params: data 
  });
}

/**
 * 产品动态注册开关
 * @param {
  *   productKey	string	是	产品key
  *   registerSwitch	int	是	开关状态 1:开,0:关 
  * }
  */
export function dynamicRegisterSwitch(data) { 
  return request({
    url: "product/dynamicRegisterSwitch",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/**
 * 产品取消发布
 * @param {
  *   productKey	string	是	产品key  *   
  * }
  */
export function cancelRelease(data) { 
  return request({
    url: "product/cancelRelease",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}


/**
 * 产品发布
 * @param {
  *   productKey	string	是	产品key  *   
  * }
  */
export function release(data) { 
  return request({
    url: "product/release",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/**
 * 产品编辑
 * @param {
  *   id	string	是	产品id
  *   productName	string	是	产品名称
  *   dynRegister	int	是	动态注册开关
  *   description	string	否	描述   
  * }
  */
export function productEdit(data) { 
  return request({
    url: "product/update",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}


/**
 * 品类选择--领域列表
 * 
  *   
  * 
  */
export function domainList() { 
  return request({
    url: "domain/list",
    method: "get"    
  });
}

/**
 * 品类选择--领域详情列表 * 
  *   
  * @param {
  *   domainId string	是	领域id
  *  pageNum	int	是	当前页
  *  pageSize	int	是	每页取几条
  *  name	string	否	品类名称
  * }
  */
 export function categoryPage(data) { 
  return request({
    url: "category/page",
    method: "get",
    params: data  
  });
}

/**
 * topic类列表 * 
  *   
  * @param {
    *   id string	是	产品id  
    * }
    */
   export function sysTopic(data) { 
    return request({
      url: "product/sysTopic",
      method: "get",
      params: data  
    });
  }


/**
 * 产品自定义topic新增、编辑
 * @param {
  *   topicName	String	是	topic名称
  *   productKey	String	是	产品 productKey
  *   topicAccess	int	是	topic权限，1：订阅，2：发布，3：订阅+发布  
  *    
  *  --- 编辑加上topicId ---
  *   topicId	Long	是	topic Id
  * }
  */
export function productCustomEdit(data) { 
  return request({
    url: "topic/customEdit",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

 /**
 * 产品自定义topic删除
 * @param {
  *   topicId	Long	是	topic Id
  *   productKey	String	是	产品 productKey
  * }
  */
export function productDelete(data) { 
  return request({
    url: "topic/customDelete",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}


/**
 * 产品自定义topic列表 * 
  *   
  * @param {
    *   pageNum	Long	否	分页页数，默认：1
    *   pageSize	Long	否	分页条数，默认：20
    *   productKey	String	是	产品 productKey      
    * }
    */
   export function customList(data) { 
    return request({
      url: "topic/customList",
      method: "get",
      params: data  
    });
  }


