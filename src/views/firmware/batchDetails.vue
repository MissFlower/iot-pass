<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：批次详情
 -->
<template>
    <div class="details" v-if="JSON.stringify(batchDetailList) !== '{}'">
        <div class="details-tit clearfix">
            <h2>
                <span class="go_back" @click="goBack"><i class="el-icon-back"></i></span>{{batchDetailList.batchNo}}
            </h2>
            <el-tag :type="deviceType" class="el_tag">{{taskStatusObj[batchDetailList.taskStatus]}}</el-tag>
        </div>
        <div>
            <el-tabs v-model="tab" type="card">
                <el-tab-pane label="设备列表" name="first">
                    <el-table :data="devManage.devList" border stripe>
                        <el-table-column label="DeviceName" prop="deviceName"></el-table-column>
                        <el-table-column label="产品" prop="productName"></el-table-column>
                        <el-table-column
                            label="当前版本号"
                        >
                            <template slot-scope="scope">
                                {{scope.row.status == 4 ? scope.row.destVersion : scope.row.srcVersion}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="状态更新时间"
                            prop="updateTime"
                        ></el-table-column>
                        <el-table-column
                            label="状态"
                            prop="status"
                        >
                            <template slot-scope="scope">{{upgradeStatusObj[scope.row.status] ? upgradeStatusObj[scope.row.status] : scope.row.status}}</template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <a class="oprate_btn" v-if="scope.row.upgradeStatus == 4" @click="upgrade(scope.row.upgradeId)">重升级</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="批次信息" name="second">
                    <el-row>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    批次ID
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.batchNo}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    所属产品
                                </div>
                                <div class="edit_info-rf">
                                    {{productName}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级前固件版本号
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.srcVersion}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级后固件版本号
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.destVersion}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级策略
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.ugStrategy == 0 ? '静态升级' : (batchDetailList.ugStrategy == 1 ? '动态升级' : batchDetailList.ugStrategy)}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级范围
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.scopeType == 0 ? '全部': (batchDetailList.scopeType == 1 ? '定向': (batchDetailList.scopeType == 2 ? '区域': '灰度'))}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级时间
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.ugTimeType}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    固件推送速率
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.rate}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    升级失败重试时间间隔
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.retryInterval}}
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="edit_info">
                                <div class="edit_info-lf">
                                    设备升级超时时间
                                </div>
                                <div class="edit_info-rf">
                                    {{batchDetailList.timeOut}}
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <div class="details" v-else>
        无数据
    </div>
</template>
<script>
    import { upgradeList, upgradeDeviceList, retryPublishUpdateMsg } from '@/api/fireware'
    import dataObj from '@/data/data'
    export default {
        data (){
            return {
                batchDetailList: {},
                tab: 'first',
                deviceType: 'info',
                upgradeId: '',
                batchManage: {
                    fmId: '',
                    id: '', // 批次id
                    pageSize: 20,
                    pageNum: 1,
                    total: 0,
                    batchNo: ''
                },
                devManage: { // 设备列表参数
                    deviceName: '',
                    upgradeId: '',
                    devList: [],
                    total: 0,
                    pageNum: 1,
                    pageSize: 20
                },
                batchNo: '',
                // 升级状态
                upgradeStatusObj: dataObj.upgradeStatusObj,
                taskStatusObj: dataObj.taskStatusObj
            }
        },
        mounted () {
            this.batchManage.fmId = this.$route.query.id
            // this.upgradeId = this.$route.query.upgradeId
            this.batchManage.batchNo = this.$route.query.batchNo
            this.productName = this.$route.query.productName
            this.getDetails()
            this.getDeviceList()
        },
        methods: {
            // 获取详情
            getDetails () {
                let data = {
                    'pageNum': this.batchManage.pageNum,
                    'pageSize': this.batchManage.pageSize,
                    'fmId': this.batchManage.fmId,
                    'batchNo': this.batchManage.batchNo
                };
                upgradeList (data).then ( res => {
                    if (res.code === 200) {
                        this.batchDetailList = res.data.data[0] || {};
                    }
                })
            },
            // 获取设备列表
            getDeviceList () {
                let data = {
                  fmId: this.batchManage.fmId,
                  batchNo: this.batchManage.batchNo,
                  pageNum: this.devManage.pageNum,
                  pageSize: this.devManage.pageSize
                };
                if (this.devManage.deviceName) {
                    data.deviceName = this.devManage.deviceName;
                }
                upgradeDeviceList (data).then( res => {
                    if (res.code === 200) {
                        this.devManage.devList = res.data.data
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            // 重新升级
            upgrade(upgradeId) {
                this.$confirm('确认要重新升级?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // let formData = new FormData()
                    // formData.append('upgradeId', upgradeId)
                    retryPublishUpdateMsg({
                        upgradeId: upgradeId
                    }).then(res => {
                        if (res.code === 200) {
                            this.getDeviceList()
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(() => {
                });
            },
            // 返回上一级菜单
            goBack () {
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="scss" scoped>
    body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, input, textarea, th, td, a {
        margin: 0;
        padding: 0;
    }
    .clearfix:after {
        content: ".";
        display: block;
        clear: both;
        height: 0;
        line-height: 0;
        font-size: 0;
        visibility: hidden;
    }
    .clear {
        clear: both;
    }
    $default: #409EFF;
    .oprate_btn{
        color: $default;
        cursor: pointer;
    }
    .details {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px;
    }
    .details-tit{
        margin-bottom: 20px;
        >h2{
            float: left;
        }
        .el_tag{
            float: left;
            margin-top: 3px;
            margin-left: 20px;
        }
    }
    .edit_info-tit{
        margin-bottom: 20px;
        display: flex;
        .edit_icon{
            color: $default;
            margin-left: 10px;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .edit_info{
        display: flex;
        font-size: 12px;
        border: 1px solid #ecedee;
        .edit_info-lf{
            width: 120px;
            box-sizing: border-box;
            padding: 10px;
            background: #fbfbfc;
            border-right: 1px solid #ecedee;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .edit_info-rf{
            box-sizing: border-box;
            padding: 10px;
        }
    }
</style>
