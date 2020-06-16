let baseUrl = "http://iot.paas.vaiwan.com";

// if (
//   location.href.indexOf("localhost") > -1 ||
//   location.href.indexOf("http://192.168") > -1
// ) {
//   baseUrl = "/api";
// }

export default {
  login: `${baseUrl}/user/login`, // 登录接口
  register: `${baseUrl}/user/register`, // 注册接口
  sendPhoneCode: `${baseUrl}/user/sendPhoneCode`, // 发送手机验证码
  verifyPhoneCode: `${baseUrl}/user/verifyPhoneCode`, // 发送手机验证码
  verifyAccount: `${baseUrl}/user/verifyAccount`, // 发送登录名
  updatePassword: `${baseUrl}/user/updatePassword`, // 修改密码
  userInfo: `${baseUrl}/user/info`, // 获取个人信息
  sendEmailValCode: `${baseUrl}/user/sendEmailValCode`, // 获取邮箱验证码
  bandEmail: `${baseUrl}/user/bandEmail` // 绑定邮箱
};
