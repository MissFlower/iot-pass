import axios from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
/*
  用户基本信息列表

  pageNum	      long	  是	当前页
  pageSize	    long	  是	每页几条
  account	      string	否	账号
  phone	        string	否	手机号
  startTime	    string	否	开始时间
  endTime	      string	否	结束时间
*/
export function userList(data) {
  // 用户列表
  return axios({
    url: "/user/list",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/*
后台创建用户，由运营人员或管理员操作

    account	      string	是	账号
    password	    string	是	密码
    name	        string	否	姓名
    email	        string	否	邮箱
    phone	        string	是	电话
*/
export function createUser(data) {
  // 用户创建
  return axios({
    url: "/user/create",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
 编辑用户基本信息

    id	      long	  是	用户id
    account	  string	是	账号
    password	string	是	密码
    name	    string	否	姓名
    email	    string	否	邮箱
    phone	    string	是	电话
 */

export function updateUser(data) {
  // 用户编辑
  return axios({
    url: "/user/update",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/*
  逻辑删除用户

  id	long	是	用户id
*/
export function delUser(data) {
  // 用户删除
  return axios({
    url: "/user/delete",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
  编辑用户的所属角色，一个用户最多配置10个角色

    userId	long	是	用户id
    roleIds	数组	是	角色id数组
*/
export function updateRoleforUser(data) {
  // 编辑用户的所属角色
  return axios({
    url: "/user/updateRole",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
角色列表，默认返回全部角色，用户已选的，打已选标记

  userId	long	是	用户id
*/

export function userRoleList(data) {
  // 角色列表，默认返回全部角色，用户已选的，打已选标记
  return axios({
    url: "/role/getRolesByUserId",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
