import axios from "axios";
import API from "@/data/api";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};

export function login(data) { // 登录
  return axios({
    url: API.login,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function register(data) {
  // 注册
  return axios({
    url: API.register,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function sendCode(data) {
  // 发送验证码
  return axios({
    url: API.sendPhoneCode,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
export function verifyCode(data) {
  // 验证验证码
  return axios({
    url: API.verifyPhoneCode,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function verifyAccount(data) {
  // 验证账户名
  return axios({
    url: API.verifyAccount,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function updatePassword(data) {
  // 修改密码
  return axios({
    url: API.updatePassword,
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function getUserInfo() {
  // 获取个人信息
  return axios({
    url: API.userInfo,
    method: "post",
    headers: headerFrom
  });
}

export function sendEmailCode(data) {
  // 发送邮箱验证码
  return axios({
    url: API.sendEmailValCode,
    method: "post",
    headers: headerFrom,
    data
  });
}

export function bandEmailFun(data) {
  // 邮箱绑定
  return axios({
    url: API.bandEmail,
    method: "post",
    headers: headerFrom,
    data
  });
}
