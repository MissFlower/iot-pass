/**
 * 文件作者：chenxueshan
 * 创建日期：2020.6.19
 * 文件说明：日志管理
*/
import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// 日志列表
export function tableList(data) {
  return request({
    url: "logs/listByPage",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
