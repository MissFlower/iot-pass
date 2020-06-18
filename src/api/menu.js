import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};

/*
菜单列表
  pageNum	  	当前页
  pageSize	 	每页几条
  name	    	菜单名称
  code	     	菜单编码
*/
export function getMenuList(data) {
  // 菜单列表
  return request({
    url: "/menu/list",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/*
菜单创建
  name	  	菜单名称
  code     	菜单编号
  pid	    	父级菜单id
  pcodeName	父级菜单名称
  menuFlag  是否是菜单0不是 1是
  url	      请求地址
  icon     	图标
*/
export function createMenu(data) {
  // 新建菜单
  return request({
    url: "/menu/create",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/*
菜单编辑
  id	      菜单id
  name	    菜单名称
  code	    菜单编号
  pcode	    父级菜单编号
  menuFlag	是否是菜单0不是 1是
  url	      请求地址
  icon	    图标
  sort	    排序
*/
export function updateMenu(data) {
  // 编辑菜单
  return request({
    url: "/menu/update",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
菜单删除
  id	菜单id
*/

export function delMenu(data) {
  // 菜单删除
  return request({
    url: "/menu/delete",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
