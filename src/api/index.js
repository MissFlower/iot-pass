import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
/*
用户登录，服务端做shiro安全认证登录

    account	  string	是	账号
    password	string	是	密码
*/
export function login(data) {
  // 登录
  return request({
    url: "/user/login",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
账号注册，需要验证手机号有效性

    account	  string	是	账号
    password	string	是	密码
    mobile	  string	是	手机
*/
export function register(data) {
  // 注册
  return request({
    url: "/user/register",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
发送手机验证码，用于验证手机号有效性

    phone	string	是	手机号
*/
export function sendCode(data) {
  // 发送验证码
  return request({
    url: "/user/sendPhoneCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
验证手机验证码

    phone	string	是	手机号
    code	string	是	验证码
*/
export function verifyCode(data) {
  // 验证验证码
  return request({
    url: "/user/verifyPhoneCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}


/*
验证账户名
  // 找回密码之前，需要验证登录名是否正确，再做后续操作

  account	string	是	登录账号或邮箱
*/
export function verifyAccount(data) {
  // 验证账户名
  return request({
    url: "/user/verifyAccount",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
修改账号密码

    account	  string	是	账号
    password	string	是	密码
*/
export function updatePassword(data) {
  // 修改密码
  return request({
    url: "/user/updatePassword",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
/*
获取个人信息，
  无参数
*/
export function getUserInfo() {
  // 获取个人信息
  return request({
    url: "/user/info",
    method: "post",
    headers: headerFrom
  });
}

/*
发送邮件验证码,用于验证邮箱有效性

    email	string	是	邮箱
*/
export function sendMailCode(data) {
  // 发送邮箱验证码
  return request({
    url: "/user/sendMailCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

/*
绑定邮箱
    account	  string	是	账号
    email	    string	是	邮箱
*/
export function bandEmailFun(data) {
  // 邮箱绑定
  return request({
    url: "/user/bandEmail",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
