import request from "@/utils/request";

/**
 * 获取固件列表
 * @param data
 */
export function getFmList(data) {
    return request({
        url: "/fm/list",
        method: "post",
        data
    });
}

/**
 * 新增固件上传文件
 * @param data
 */
export function uploadFile(data) {
    return request({
        url: "/fm/uploadFile",
        method: "post",
        data
    });
}
/**
 * 保存新增固件
 * @param data
 */
export function saveFm(data) {
    return request({
        url: "/fm/save",
        method: "post",
        data
    });
}

/**
 * 删除固件
 * @param data
 */
export function deleteFm(data) {
    return request({
        url: "/fm/del",
        method: "post",
        data
    });
}

/**
 * 固件详情
 * @param data
 */
export function getFmDetails(data) {
    return request({
        url: "/fm/get",
        method: "post",
        data
    });
}
/**
 * 获取产品列表
 * @param data
 */
export function getProducts(data) {
    return request({
        url: "/product/list",
        method: "get",
        params: data
    });
}

/**
 * 固件编辑
 * @param data
 */
export function updateFm(data) {
    return request({
        url: "/fm/update",
        method: "post",
        data
    });
}

/**
 * 批次管理
 * @param data
 */
export function upgradeList(data) {
    return request({
        url: "upgrade/list",
        method: "post",
        data
    });
}

/**
 * 设备列表
 * @param data
 */
export function upgradeDeviceList(data) {
    return request({
        url: "upgrade/upgradeDevicelist",
        method: "post",
        data
    });
}
