/*
 * @Description: 透视分析api
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-25 14:02:54
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-25 15:53:20
 */
import request from '@/utils/request'
import Qs from 'qs'

const POST_JSON = {
  'Content-Type': 'application/json'
}

/**
 * @description: 根据产品获取可选择的度量
 * @param {productKey} 必传: 是, 类型: String, 描述: 产品key
 * @return {metrics}
 * @author: AiDongYang
 */
export function getMetircsByProduct(data) {
  return request({
    url: 'data/analysis/getMetircsByProduct',
    method: 'post',
    headers: POST_JSON,
    data: Qs.stringify(data)
  })
}

/**
 * @description: 根据metric获取所有的tagK
 * @param {metricRealName} 必传: 是, 类型: String 描述: metric真实名字
 * @return {type}
 * @author: AiDongYang
 */
export function getTagkByMetric(data) {
  return request({
    url: 'data/analysis/getTagkByMetric',
    method: 'post',
    headers: POST_JSON,
    data: Qs.stringify(data)
  })
}

/**
 * @description: 根据tagK获取所有的tagV
 * @param {metricRealName} 必传: 是, 类型: String 描述: metric真实名字
 * @param {tagKey} 必传: 是, 类型: String 描述: tag Key值
 * @param {tagValuePrefix} 必传: 否, 类型: String, 描述: tagV用来模糊匹配的前缀字符
 * @return {type}
 * @author: AiDongYang
 */
export function getTagValueByTagkey(data) {
  return request({
    url: 'data/analysis/getTagValueByTagkey',
    method: 'post',
    headers: POST_JSON,
    data: Qs.stringify(data)
  })
}

/**
 * @description: 查询符合条件的所有数据
 * @param {metricRealName} 必传: 是, 类型: String 描述: metric真实名字
 * @param {tagsFilter} 必传: 是, 类型: String 描述: tags过滤的map数组.可以为空
 * @param {startTime} 必传: 是, 类型: String 描述: 开始时间，使用时间戳
 * @param {endTime} 必传: 是, 类型: String 描述: 结束时间，使用时间戳
 * @param {aggregator} 必传: 否, 类型: String 描述: 查询数据的聚合算法。默认为none
 * @param {downSampleAggregator} 必传: 否, 类型: String 描述: 降采样聚合算法。若为空，则表示不进行降采样
 * @param {downSampleTime} 必传: 否, 类型: String 描述: 降采样的时间间隔。默认为5分钟。若downSampleAggregator为空，则该参数失效。“1m”表示一分钟。“1h”表示一小时
 * @return {type}
 * @author: AiDongYang
 */
export function getDataForChart(data) {
  return request({
    url: 'data/analysis/getDataForChart',
    method: 'post',
    headers: POST_JSON,
    data: Qs.stringify(data)
  })
}
