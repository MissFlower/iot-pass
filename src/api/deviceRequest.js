import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
    "Content-Type": "application/x-www-form-urlencoded"
};
const headerFrom_json = {
    "Content-Type": "application/json"
};
const headerFrom_Get = {
    "Content-Type": "application/json;charset=UTF-8"
};
export function deviceList(data) {
    // 设备列表
    return request({
        url: "/device/listByPage",
        method: "post",
        headers: headerFrom,
        data: Qs.stringify(data)
    });
}

export function deleteDevice(data) {
    // 设备删除
    return request({
        url: "/device/delete",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function productList(data) {
    // 产品列表
    return request({
        url: "/product/list",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function createDevice(data) {
    // 新建设备
    return request({
        url: "/device/createDevice",
        method: "post",
        headers: headerFrom,
        data: Qs.stringify(data)
    });
}

export function deviceInfo(data) {
    // 设备详情
    return request({
        url: "/device/getDevice",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function deviceUpdate(data) {
    // 设备编辑
    return request({
        url: "/device/updateDevice",
        method: "post",
        headers: headerFrom,
        data: Qs.stringify(data)
    });
}

export function deviceBatchEnable(data) {
    // 设备启、禁用
    return request({
        url: "/device/batchEnable",
        method: "post",
        headers: headerFrom_json,
        data: data
    });
}

export function deviceStatistics(data) {
    // 指定产品设备统计
    return request({
        url: "/device/statistics",
        method: "get",
        headers: headerFrom_Get,
        params: data
    });
}

export function eventManage(data) {
  // 物模型数据-事件管理
  return request({
    url: "/tsdb/getEventForList",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function serviceCall(data) {
  // 物模型数据-服务调用
  return request({
    url: "/tsdb/getServiceForList",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
