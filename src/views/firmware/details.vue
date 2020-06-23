<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：固件详情
 -->
<template>
    <div class="details">
        <div class="details-tit clearfix">
            <h2>
                <span class="go_back" @click="goBack"><i class="el-icon-back"></i></span>{{details.detailList.fmName}}
            </h2>
            <el-tag :type="details.deviceType" class="el_tag">{{details.detailList.fmStatus === 0 ? '未验证' : details.detailList.fmStatus === 1 ? '验证中' : '已通过'}}</el-tag>
        </div>
        <div class="detail_info">
            <el-row>
                <el-col :span="12">
                    <div class="grid-content">
                        <span class="info_left">固件类型</span>
                        <span>{{details.detailList.fmType === 1 ? '整包' : '差分'}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content">
                        <span class="info_left">固件签名</span>
                        <span>{{details.detailList.fmSign}} <a :href="details.detailList.fmUrl" target="_blank" class="download">下载</a></span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="grid-content">
                        <span class="info_left">签名算法</span>
                        <span>{{details.detailList.signMethod === 1 ? 'Md5' : 'SHA256'}}</span>
                    </div>
                </el-col>
                <!--<el-col :span="12">-->
                    <!--<div class="grid-content">-->
                        <!--<span class="info_left">自定义模块名称</span>-->
                        <!--<span>default</span>-->
                    <!--</div>-->
                <!--</el-col>-->
            </el-row>
        </div>
        <div class="details_sta">
            <el-row>
                <el-col :span="3">
                    <div class="grid-content">
                        <dl class="details_line">
                            <dt>目标设备总数</dt>
                            <dd>0</dd>
                        </dl>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content">
                        <dl class="details_line">
                            <dt>目标成功数</dt>
                            <dd>0</dd>
                        </dl>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content">
                        <dl class="details_line">
                            <dt>目标失败数</dt>
                            <dd>0</dd>
                        </dl>
                    </div>
                </el-col>
                <!--<el-col :span="3">-->
                    <!--<div class="refresh">-->
                        <!--<i class="el-icon-refresh"></i>-->
                    <!--</div>-->
                <!--</el-col>-->
            </el-row>
        </div>
       <div>
           <el-tabs v-model="detailsTab" type="card" @tab-click="handleClick">
               <el-tab-pane label="批次管理" name="first">
                   <el-form ref="form" :model="batchManage" label-width="80px" :inline="true">
                       <el-form-item>
                           <el-button type="primary" @click="checkFm">验证固件</el-button>
                           <!--<el-tooltip class="item" effect="dark" content="请先验证固件，再进行批量升级" placement="top" v-if="details.detailList.fmStatus !== 2">-->
                               <!--<el-button disabled>批量升级</el-button>-->
                           <!--</el-tooltip>-->
                           <!--<el-button v-else @click="upgradeSubmit">批量升级</el-button>-->
                           <el-button @click="upgradeSubmit">批量升级</el-button>
                       </el-form-item>
                       <el-form-item>
                           <el-input
                               v-model="batchManage.id"
                               placeholder="请输入批次ID"
                               @keyup.enter.native="searchBatchManage"
                           ></el-input>
                       </el-form-item>
                   </el-form>
                   <el-table :data="batchManage.batchList" border stripe>
                       <el-table-column label="批次ID" prop="upgrade.id"></el-table-column>
                       <el-table-column label="批次类型" prop="upgrade.type" :formatter="formatType"></el-table-column>
                       <el-table-column
                           label="升级策略"
                           prop="upgrade.ugType"
                           :formatter="formatUgType"
                       ></el-table-column>
                       <el-table-column
                           label="状态"
                           prop="upgrade.ugStatus"
                           :formatter="formatUgStatus"
                       ></el-table-column>
                       <el-table-column
                           label="添加时间"
                           prop="upgrade.createTime"
                       ></el-table-column>
                       <el-table-column label="操作">
                           <template scope="scope">
                               <a class="oprate_btn" @click="toBatchDetails(scope.row.upgrade.id)">查看</a>
                           </template>
                       </el-table-column>
                   </el-table>
                   <el-pagination
                       @current-change="handleBatchChange"
                       :current-page.sync="batchManage.page"
                       :page-size="batchManage.pageSize"
                       layout="total, prev, pager, next"
                       class="tr mt20"
                       :total="batchManage.total"
                   >
                   </el-pagination>
               </el-tab-pane>
               <el-tab-pane label="设备列表" name="second">
                   <el-form ref="form" :model="devManage" label-width="80px" :inline="true">
                       <el-form-item>
                           <el-input
                               v-model="devManage.deviceName"
                               placeholder="请输入deviceName"
                               @keyup.enter.native="searchDevManage"
                           ></el-input>
                       </el-form-item>
                       <el-form-item>
                           <el-input
                               v-model="devManage.upgradeId"
                               placeholder="请输入批次ID"
                               @keyup.enter.native="searchDevManage"
                           ></el-input>
                       </el-form-item>
                   </el-form>
                   <el-table :data="devManage.devList" border stripe>
                       <el-table-column label="deviceName" prop="deviceName"></el-table-column>
                       <el-table-column label="设备所属产品" prop="productName"></el-table-column>
                       <el-table-column
                           label="升级批次ID"
                           prop="upgradeId"
                       ></el-table-column>
                       <el-table-column
                           label="当前版本号"
                           prop="destVersion"
                       ></el-table-column>
                       <el-table-column
                           label="升级状态"
                           prop="upgradeStatus"
                           :formatter="formatUpgradeStatus"
                       ></el-table-column>
                       <el-table-column label="操作">
                           <template scope="scope">
                            <a class="oprate_btn" @click="toBatchDetails(scope.row.upgradeId)">查看</a>
                           </template>
                       </el-table-column>
                   </el-table>
                   <el-pagination
                       @current-change="handleDevChange"
                       :current-page.sync="devManage.pageNum"
                       :page-size="devManage.pageSize"
                       layout="total, prev, pager, next"
                       :total="devManage.total"
                       class="tr mt20"
                   >
                   </el-pagination>
               </el-tab-pane>
               <el-tab-pane label="固件信息" name="third">
                   <div class="edit_info-tit">
                       <h4>固件基本信息</h4>
                       <a class="edit_icon" @click="editClick"><i class="el-icon-edit"></i>编辑</a>
                   </div>
                   <el-row>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   固件ID
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.id}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   固件名称
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.fmName}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   所属产品
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.productName}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   固件签名
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.fmSign}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   待升级版本号
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.srcVersion}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   升级后版本号
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.destVersion}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   添加时间
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.createTime}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   签名算法
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.signMethod === 1 ? 'Md5' : 'SHA256'}}
                               </div>
                           </div>
                       </el-col>
                       <el-col :span="8">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   固件状态
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.fmStatus === 0 ? '未验证' : fmInfo.fmInfoList.fmStatus === 1 ? '验证中' : '已通过'}}
                               </div>
                           </div>
                       </el-col>
                       <!--<el-col :span="24">-->
                           <!--<div class="edit_info">-->
                               <!--<div class="edit_info-lf">-->
                                   <!--验证进度-->
                               <!--</div>-->
                               <!--<div class="edit_info-rf">-->
                                   <!--0%-->
                               <!--</div>-->
                           <!--</div>-->
                       <!--</el-col>-->
                       <el-col :span="24">
                           <div class="edit_info">
                               <div class="edit_info-lf">
                                   固件描述
                               </div>
                               <div class="edit_info-rf">
                                   {{fmInfo.fmInfoList.fmDesc}}
                               </div>
                           </div>
                       </el-col>
                   </el-row>
               </el-tab-pane>
           </el-tabs>
       </div>
        <!--编辑固件信息-->
        <EditFirmware :EditDialogVisible="fmInfo.EditDialogVisible" :detailInfo="fmInfo.fmInfoList" @changeVisible="changeVisible" @changeDetail="changeDetail"/>
        <!--验证固件-->
        <CheckFirmware
            :checkFmVisible="checkFmVisible"
            :checkFmId="fmId"
            @checkVisible="checkVisible"
            @refreshList="refreshList"
        ></CheckFirmware>
        <!--批量升级-->
        <UpgradeFirmware
            :upgradeFmVisible="upgradeFmVisible"
            :checkFmId="checkFmId"
            @upgradeVisible="upgradeVisible"
        ></UpgradeFirmware>
    </div>
</template>
<script>
    import { getFmDetails, upgradeList, upgradeDeviceList } from '@/api/fireware'
    import EditFirmware from '@/components/firmware/editFirmware'
    import CheckFirmware from "@/components/firmware/checkFirmware";
    import UpgradeFirmware from "@/components/firmware/upgradeFirmware";
    export default {
        data () {
            return {
                details: {
                    deviceType: 'info',
                    deviceName: '未验证',
                    detailList: {}
                },
                detailsTab: 'first',
                batchManage: { // 批次管理参数
                    batchList: [],
                    pageNum: 1,
                    total: 0,
                    pageSize: 10,
                    fmId: '',
                    id: ''
                },
                devManage: { // 设备列表参数
                    deviceName: '',
                    upgradeId: '',
                    devList: [],
                    total: 0,
                    pageNum: 1,
                    pageSize: 20
                },
                fmInfo: {
                    fmInfoList: {},
                    EditDialogVisible: false,
                },
                fmId: '',
                checkFmVisible: false,
                upgradeFmVisible: false,
                checkFmId: ''
            }
        },
        components: {
            EditFirmware,
            CheckFirmware,
            UpgradeFirmware
        },
        mounted () {
            this.fmId = String(this.$route.query.id)
            this.getDetails()
            this.getUpgradeList() // 批次管理
        },
        methods: {
            // tab切换方法
            handleClick (value) {
                if (value.index === '0') {
                    this.getUpgradeList()
                } else if (value.index === '1') {
                    this.getDeviceList()
                }
            },
            // 获取详情
            getDetails () {
                let formData = new FormData ()
                formData.append('id', this.fmId)
                getFmDetails (formData).then( res => {
                    if (res.code === 200) {
                        this.details.detailList = res.data
                        this.fmInfo.fmInfoList = res.data
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            // 固件信息
            // 编辑
            editClick () {
                this.fmInfo.EditDialogVisible = true
            },
            changeVisible () {
                this.fmInfo.EditDialogVisible = false
            },
            // 编辑固件信息方法
            changeDetail () {
                this.getDetails()
            },
            // 批次管理列表
            getUpgradeList () {
                let formData = new FormData()
                formData.append('pageNum', this.batchManage.pageNum)
                formData.append('pageSize', this.batchManage.pageSize)
                formData.append('fmId', this.fmId)
                formData.append('id', this.batchManage.id)
                upgradeList (formData).then ( res => {
                    if (res.code === 200) {
                        this.batchManage.batchList = res.data.list
                        this.batchManage.total = res.data.total
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            // 搜索批次管理
            searchBatchManage () {
                this.batchManage.pageNum = 1
                this.getUpgradeList()
            },
            // 批次管理分页
            handleBatchChange () {
                this.getUpgradeList()
            },
            upgradeSubmit () {
                this.upgradeFmVisible = true;
                this.checkFmId = this.fmId
                // if (this.details.detailList.fmStatus === 2) {
                //     this.upgradeFmVisible = true;
                //     this.checkFmId = String(this.details.detailList.id);
                // }
            },
            // 批量升级
            upgradeVisible() {
                this.upgradeFmVisible = false;
            },
            // 获取设备列表
            getDeviceList () {
                let formData = new FormData()
                if (this.devManage.deviceName) {
                    formData.append('deviceName', this.devManage.deviceName)
                }
                formData.append('upgradeId', this.devManage.upgradeId)
                formData.append('pageNum', this.devManage.pageNum)
                formData.append('pageSize', this.devManage.pageSize)
                upgradeDeviceList (formData).then( res => {
                    if (res.code === 200) {
                        this.devManage.devList = res.data.list
                        this.devManage.total = res.data.total
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            // 设备列表分页
            handleDevChange () {
                this.getDeviceList()
            },
            // 设备列表搜索
            searchDevManage () {
                this.getDeviceList()
            },
            // 验证固件方法
            checkFm () {
                let fmStatus = this.details.detailList.fmStatus
                if (fmStatus === 0) {
                    this.checkFmVisible = true;
                } else {
                    this.openCheckFm(fmStatus);
                }
            },
            openCheckFm(status) {
                let title = status === 1 ? "固件验证中" : "固件验证成功";
                this.$alert(`${title}`, "验证固件", {
                    confirmButtonText: "关闭"
                });
            },
            checkVisible() {
                this.checkFmVisible = false;
            },
            refreshList() {
                this.fetchFmList();
            },
            // 跳转批次详情
            toBatchDetails (upgradeId) {
                this.$router.push({
                    path: 'batchDetails',
                    query: {
                        id: this.fmId,
                        upgradeId: upgradeId
                    }
                })
            },
            // 返回上一级菜单
            goBack () {
                this.$router.go(-1)
            },
            // 格式化表格内容
            formatType (row) {
                return row.upgrade.type === "0" ? "验证固件" : "批量升级"
            },
            formatUgType (row) {
                return row.upgrade.ugType === "1" ? "静态升级" : "动态升级"
            },
            formatUgStatus (row) {
                return row.upgrade.ugStatus === 1 ? "待升级" : row.upgrade.ugStatus === 2 ? "升级中" : row.upgrade.ugStatus === 3 ? "升级完成": "已取消"
            },
            formatUpgradeStatus (row) {
                return row.upgradeStatus === 0 ? "待升级" : row.ugStatus === 1 ? "升级中" : row.ugStatus === 2 ? "已完成": "升级失败"
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
    .download{
        color: $default;
        margin-left: 10px;
    }
    .details {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px;
    }
    .go_back{
        cursor: pointer;
        padding-right: 10px;
    }
    .details-tit{
        >h2{
            float: left;
        }
        .el_tag{
            float: left;
            margin-top: 3px;
            margin-left: 20px;
        }
    }
    .disabled {
        color: #999;
        cursor: text;
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 24px;
        line-height: 24px;
        font-size: 12px;
        .info_left{
            display: inline-block;
            width: 20%;
        }
    }
    .detail_info{
        margin-top: 20px;
    }
    .details_sta{
        margin-top: 20px;
        margin-bottom: 20px;
        .details_line{
            font-size: 14px;
        }
    }
    .oprate_btn{
        color: $default;
        cursor: pointer;
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
        }
        .edit_info-rf{
            box-sizing: border-box;
            padding: 10px;
        }
    }
</style>
