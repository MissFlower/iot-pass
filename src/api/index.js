import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};

export function login(data) {
  // 登录
  return request({
    url: "/user/login",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function register(data) {
  // 注册
  return request({
    url: "/user/register",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function sendCode(data) {
  // 发送验证码
  return request({
    url: "/user/sendPhoneCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
export function verifyCode(data) {
  // 验证验证码
  return request({
    url: "/user/verifyPhoneCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function verifyAccount(data) {
  // 验证账户名
  return request({
    url: "/user/verifyAccount",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function updatePassword(data) {
  // 修改密码
  return request({
    url: "/user/updatePassword",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function getUserInfo() {
  // 获取个人信息
  return request({
    url: "/user/info",
    method: "post",
    headers: headerFrom
  });
}

export function sendMailCode(data) {
  // 发送邮箱验证码
  return request({
    url: "/user/sendMailCode",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function bandEmailFun(data) {
  // 邮箱绑定
  return request({
    url: "/user/bandEmail",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
