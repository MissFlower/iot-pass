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
                           <el-button type="primary">验证固件</el-button>
                           <el-button>批量升级</el-button>
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
                       <el-table-column label="批次ID" prop="id"></el-table-column>
                       <el-table-column label="批次类型" prop="type" :formatter="formatType"></el-table-column>
                       <el-table-column
                           label="升级策略"
                           prop="ugType"
                           :formatter="formatUgType"
                       ></el-table-column>
                       <el-table-column
                           label="状态"
                           prop="ugStatus"
                           :formatter="formatUgStatus"
                       ></el-table-column>
                       <el-table-column
                           label="添加时间"
                           prop="createTime"
                       ></el-table-column>
                       <!--<el-table-column label="操作">-->
                           <!--<a class="oprate_btn">查看</a>-->
                       <!--</el-table-column>-->
                   </el-table>
                   <el-pagination
                       @current-change="handleCurrentChange"
                       :current-page.sync="batchManage.page"
                       :page-size="100"
                       layout="total, prev, pager, next"
                       class="tr mt20"
                       v-if="batchManage.page > 1"
                   >
                   </el-pagination>
               </el-tab-pane>
               <el-tab-pane label="设备列表" name="second">
                   <el-form ref="form" :model="devManage" label-width="80px" :inline="true">
                       <el-form-item>
                           <el-input
                               v-model="devManage.deviceName"
                               placeholder="请输入deviceName"
                           ></el-input>
                       </el-form-item>
                       <el-form-item>
                           <el-input
                               v-model="devManage.upgradeId"
                               placeholder="请输入批次ID"
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
                           label="原版本号"
                           prop="srcVersion"
                       ></el-table-column>
                       <el-table-column
                           label="要升级成的版本号"
                           prop="destVersion"
                       ></el-table-column>
                       <el-table-column
                           label="升级状态"
                           prop="upgradeStatus"
                           :formatter="formatUpgradeStatus"
                       ></el-table-column>
                       <!--<el-table-column label="操作">-->
                           <!--<a class="oprate_btn">查看</a>-->
                       <!--</el-table-column>-->
                   </el-table>
                   <el-pagination
                       @current-change="handleCurrentChange"
                       :current-page.sync="devManage.pageNum"
                       :page-size="100"
                       layout="total, prev, pager, next"
                       :total="devManage.total"
                       class="tr mt20"
                       v-if="devManage.pageNum > 1"
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
        <EditFirmware :EditDialogVisible="fmInfo.EditDialogVisible" :detailInfo="fmInfo.fmInfoList" @changeVisible="changeVisible" @changeDetail="changeDetail"/>
    </div>
</template>
<script>
    import { getFmDetails, upgradeList, upgradeDeviceList } from '@/api/fireware'
    import EditFirmware from '@/components/firmware/editFirmware'
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
                    devList: []
                },
                fmInfo: {
                    fmInfoList: {},
                    EditDialogVisible: false,
                },
                fmId: ''
            }
        },
        components: {
            EditFirmware
        },
        mounted () {
            this.fmId = this.$route.query.id
            this.getDetails()
            this.getUpgradeList() // 批次管理
            this.getDeviceList() // 设备列表
        },
        methods: {
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
            changeDetail () {
                this.getDetails()
            },
            // 批次管理
            getUpgradeList () {
                this.batchManage.fmId = this.fmId
                upgradeList ({
                    pageNum: this.batchManage.pageNum,
                    pageSize: this.batchManage.pageSize,
                    fmId: this.batchManage.fmId,
                    id: this.batchManage.id
                }).then ( res => {
                    if (res.code === 200) {
                        this.batchManage.batchList = res.data.list
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            searchBatchManage () {
                this.batchManage.pageNum = 1
                this.getUpgradeList()
            },
            // 设备列表
            getDeviceList () {
                upgradeDeviceList ({
                    deviceName: this.devManage.deviceName,
                    upgradeId: this.devManage.upgradeId
                }).then( res => {
                    if (res.code === 200) {
                        this.devManage.devList = res.data
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            goBack () {
                this.$router.go(-1)
            },
            handleClick () {},
            formatType (row) {
                return row.type === "0" ? "验证固件" : "批量升级"
            },
            formatUgType (row) {
                return row.ugType === "1" ? "静态升级" : "动态升级"
            },
            formatUgStatus (row) {
                return row.ugStatus === 1 ? "待升级" : row.ugStatus === 2 ? "升级中" : row.ugStatus === 3 ? "升级完成": "已取消"
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
