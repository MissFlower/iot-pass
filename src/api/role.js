import axios from '@/utils/request'
import Qs from 'qs'

const headerFrom = {
  'Content-Type': 'application/x-www-form-urlencoded'
}

/*
  角色列表

  pageNum	    long	  是	当前页
  pageSize	  string	是	每页几条
  name	      string	否	角色名称
*/
export function roleList(data) {
  // 角色列表
  return axios({
    url: '/role/list',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/*
 创建角色

  name	      string	是	角色名称
  description	string	否	描述
 */
export function addRole(data) {
  // 角色添加
  return axios({
    url: '/role/create',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/*
角色编辑

  roleId	          long	  是	角色id
  name	            string	是	角色名称
  description	      string	否	角色描述
*/
export function updateRole(data) {
  // 角色编辑
  return axios({
    url: '/role/update',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/*
角色删除
  id	long	是	角色ID
*/

export function delRole(data) {
  // 角色删除
  return axios({
    url: '/role/delete',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/*
根据角色ID展示角色下菜单树

  roleId	long	是	角色id
*/
export function getMenusTree(data) {
  // 根据角色ID展示角色下菜单树
  return axios({
    url: '/menu/menuTreeListByRoleId',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}

/*
为角色配置菜单权限，先移除现有角色跟菜单关系，再保存新配置

  roleId	long	是	角色id
  ids	字符串	是	菜单id多个逗号隔开
*/
export function setAuthorityForRole(data) {
  // 为角色配置菜单权限，先移除现有角色跟菜单关系，再保存新配置
  return axios({
    url: '/role/setAuthority',
    method: 'post',
    headers: headerFrom,
    data: Qs.stringify(data)
  })
}
