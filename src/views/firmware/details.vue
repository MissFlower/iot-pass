<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：固件详情
 -->
<template>
  <div class="details">
    <div class="details-tit clearfix">
      <h2>
        <span class="go_back" @click="goBack">
          <i class="el-icon-back"></i>
        </span>
        {{ details.detailList.fmName }}
      </h2>
      <el-tag
        :type="details.deviceType"
        class="el_tag"
        v-if="details.detailList.fmStatus || details.detailList.fmStatus == 0"
      >{{ fmStatusObj[details.detailList.fmStatus].label }}</el-tag>
    </div>
    <div class="detail_info">
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <span class="info_left">固件类型</span>
            <span>{{ details.detailList.fmType === 1 ? '整包' : '差分' }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <span class="info_left">固件签名</span>
            <span>
              {{ details.detailList.fmSign }}
              <el-link type="primary" :underline="false" class="f12 ml10" @click="downLoad">下载</el-link>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <span class="info_left">签名算法</span>
            <span>{{ details.detailList.signMethod === 1 ? 'Md5' : 'SHA256' }}</span>
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
              <dd>{{ nums.targetTotal }}</dd>
            </dl>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <dl class="details_line">
              <dt>目标成功数</dt>
              <dd>{{ nums.targetSuccess }}</dd>
            </dl>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <dl class="details_line">
              <dt>目标失败数</dt>
              <dd>{{ nums.targetFail }}</dd>
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
      <el-tabs v-model="detailsTab" type="card" @tab-click="handleClick" v-loading="loading">
        <el-tab-pane label="批次管理" name="first">
          <el-form ref="form" :model="batchManage" label-width="80px" :inline="true">
            <el-form-item>
              <el-button type="primary" @click="checkFm">验证固件</el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="请先验证固件，再进行批量升级"
                placement="top"
                v-if="details.detailList.fmStatus !== 2"
              >
                <el-button disabled>批量升级</el-button>
              </el-tooltip>
              <el-button v-else @click="upgradeSubmit">批量升级</el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="batchManage.id"
                placeholder="请输入批次ID"
                @keyup.enter.native="searchBatchManage"
                class="searchInput"
              >
                <span slot="suffix">
                  <i class="el-icon-search hand" @click="searchBatchManage"></i>
                  <i class="el-icon-close hand" v-if="batchManage.id != ''" @click="clearFun('id')"></i>
                </span>
              </el-input>
            </el-form-item>
          </el-form>
          <el-table :data="batchManage.batchList" border stripe>
            <el-table-column label="批次ID" prop="batchNo"></el-table-column>
            <el-table-column label="批次类型" prop="taskType" :formatter="formatTaskType"></el-table-column>
            <el-table-column label="升级策略">
              <template
                slot-scope="scope"
              >{{ scope.row.ugStrategy == 0 ? '静态升级' : (scope.row.ugStrategy == 1 ? '动态升级' : scope.row.ugStrategy) }}</template>
            </el-table-column>
            <el-table-column label="状态" prop="taskStatus">
              <template slot-scope="scope">
                <div
                  :style="{'background-color': taskStatusObj[scope.row.taskStatus].color}"
                  class="point"
                ></div>
                <span
                  v-if="scope.row.taskStatus || scope.row.taskStatus == 0"
                >{{ taskStatusObj[scope.row.taskStatus].label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="=createTime" :formatter="formatCreateTime"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a class="oprate_btn" @click="toBatchDetails(scope.row)">查看</a>
                <span v-if="scope.row.taskStatus < 2">|</span>
                <a
                  class="oprate_btn"
                  v-if="scope.row.taskStatus < 2"
                  @click="ShowPopover($event, scope.row)"
                >取消</a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleBatchChange"
            :current-page.sync="batchManage.pageNum"
            :page-size="batchManage.pageSize"
            layout="total, prev, pager, next"
            class="tr mt20"
            :total="batchManage.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="设备列表" name="second">
          <el-form ref="form" :model="devManage" label-width="80px" :inline="true">
            <el-form-item>
              <el-input
                v-model="devManage.deviceName"
                placeholder="请输入deviceName"
                @keyup.enter.native="searchDevManage"
                class="searchInput"
              >
                <span slot="suffix">
                  <i class="el-icon-search hand" @click="searchDevManage"></i>
                  <i
                    class="el-icon-close hand"
                    v-if="devManage.deviceName != ''"
                    @click="clearFun('name')"
                  ></i>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="devManage.batchNo"
                placeholder="请输入批次ID"
                @keyup.enter.native="searchDevManage"
                class="searchInput"
              >
                <span slot="suffix">
                  <i class="el-icon-search hand" @click="searchDevManage"></i>
                  <i
                    class="el-icon-close hand"
                    v-if="devManage.batchNo != ''"
                    @click="clearFun('batchNo')"
                  ></i>
                </span>
              </el-input>
            </el-form-item>
          </el-form>
          <el-table :data="devManage.devList" border stripe>
            <el-table-column label="deviceName" prop="deviceName"></el-table-column>
            <el-table-column label="设备所属产品">{{ productName }}</el-table-column>
            <el-table-column label="升级批次ID" prop="batchNo"></el-table-column>
            <el-table-column label="当前版本号" prop="destVersion">
              <template
                slot-scope="scope"
              >{{ scope.row.status == 4 ? scope.row.destVersion : scope.row.srcVersion }}</template>
            </el-table-column>
            <el-table-column label="升级状态" prop="status">
              <template slot-scope="scope">
                <div
                  :style="{'background-color': upgradeStatusObj[scope.row.status].color}"
                  class="point"
                ></div>
                {{ upgradeStatusObj[scope.row.status].label }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a class="oprate_btn" @click="toBatchDetails(scope.row)">查看</a>
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
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="固件信息" name="third">
          <div class="edit_info-tit">
            <h4>固件基本信息</h4>
            <a class="edit_icon" @click="editClick">
              <i class="el-icon-edit"></i>编辑
            </a>
          </div>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">固件ID</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.id }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">固件名称</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.fmName }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">所属产品</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.productName }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">固件签名</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.fmSign }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">待升级版本号</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.srcVersion }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级后版本号</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.destVersion }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">添加时间</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.createTime_ }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">签名算法</div>
                <div
                  class="edit_info-rf"
                >{{ fmInfo.fmInfoList.signMethod === 1 ? 'Md5' : 'SHA256' }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">固件状态</div>
                <div class="edit_info-rf">
                  <span
                    v-if="fmInfo.fmInfoList.fmStatus || fmInfo.fmInfoList.fmStatus == 0"
                  >{{ fmStatusObj[fmInfo.fmInfoList.fmStatus].label }}</span>
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
            <el-col :xs="24" :sm="12" :md="24" :lg="24" :xl="24">
              <div class="edit_info">
                <div class="edit_info-lf">固件描述</div>
                <div class="edit_info-rf">{{ fmInfo.fmInfoList.fmDesc }}</div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--编辑固件信息-->
    <EditFirmware
      :EditDialogVisible="fmInfo.EditDialogVisible"
      :detailInfo="fmInfo.fmInfoList"
      @changeVisible="changeVisible"
      @changeDetail="changeDetail"
    />
    <!--验证固件-->
    <CheckFirmware
      v-if="checkFmVisible"
      :checkFmVisible="checkFmVisible"
      :checkInfo="checkInfo"
      @checkVisible="checkVisible"
      @refreshList="refreshList"
    ></CheckFirmware>
    <!--批量升级-->
    <UpgradeFirmware
      v-if="upgradeFmVisible"
      :upgradeFmVisible="upgradeFmVisible"
      :checkInfo="checkInfo"
      @upgradeVisible="upgradeVisible"
    ></UpgradeFirmware>
    <check-process
      v-if="checkProcessFlag"
      :status="checkStatus"
      @upgrade="upgradeProcess"
      @close="closeCheckProcess"
    ></check-process>
    <!-- 取消批量升级的popover -->
    <el-popover ref="popover" placement="top" width="200" trigger="manual" v-model="visible">
      <div>
        <i class="el-icon-warning" style="color: #f90"></i>
        确定要取消批量升级吗？
      </div>
      <div class="df f12 mt5">
        <el-checkbox v-model="popoverItem.check" true-label="1" false-label="0"></el-checkbox>
        <span class="ml10">取消批次下所有正在进行中的升级任务（如不勾选，默认只会取消定时任务）</span>
      </div>
      <div class="tr mt10">
        <el-button size="mini" type="primary" @click="confirmPopover">确认</el-button>
        <el-button size="mini" @click="visible = false">取消</el-button>
      </div>
      <el-button v-show="false" slot="reference">手动激活</el-button>
    </el-popover>
  </div>
</template>
<script>
import {
  getFmDetails,
  upgradeList,
  upgradeDeviceList,
  statistics,
  getUploadFilePath,
  getVerifyFirmInfo,
  cancelBatchUpgrade
} from '@/api/fireware'

import EditFirmware from './children/editFirmware'
import CheckFirmware from './children/checkFirmware'
import UpgradeFirmware from './children/upgradeFirmware'
import checkProcess from './children/checkProcess'

import { taskStatusObj, upgradeStatusObj, fmStatusObj } from '@/data/constants'
export default {
  components: { EditFirmware, CheckFirmware, UpgradeFirmware, checkProcess },
  data() {
    return {
      loading: false,
      productName: '',
      details: {
        deviceType: 'info',
        deviceName: '未验证',
        detailList: {}
      },
      detailsTab: 'first',
      nums: {
        // 标签栏上方的数量
        targetFail: 0,
        targetSucess: 0,
        targetTotal: 0
      },
      batchManage: {
        // 批次管理参数
        batchList: [],
        pageNum: 1,
        total: 0,
        pageSize: 10,
        fmId: '',
        id: ''
      },
      devManage: {
        // 设备列表参数
        deviceName: '',
        batchNo: '',
        devList: [],
        total: 0,
        pageNum: 1,
        pageSize: 20
      },
      fmInfo: {
        fmInfoList: {},
        EditDialogVisible: false
      },
      fmId: '',
      checkFmVisible: false,
      upgradeFmVisible: false,
      checkFmId: '',
      srcVersion: '',
      checkDestVersion: '',
      taskStatusObj,
      upgradeStatusObj,
      fmStatusObj,
      popoverItem: {
        check: '0',
        row: null
      },
      checkInfo: null,
      checkStatus: 0,
      checkProcessFlag: false,
      visible: false
    }
  },
  mounted() {
    this.fmId = String(this.$route.query.id)
    this.productName = this.$route.query.productName
    this.srcVersion = this.$route.query.srcVersion
    this.getDetails()
    this.getUpgradeList() // 批次管理
    this.getStatistics() // 获取 标签页 上方数据
  },
  methods: {
    // tab切换方法
    handleClick(value) {
      if (value.index === '0') {
        this.getUpgradeList()
      } else if (value.index === '1') {
        this.getDeviceList()
      }
    },
    // 获取详情
    getDetails() {
      const formData = new FormData()
      formData.append('id', this.fmId)
      this.loading = true
      getFmDetails(formData).then(res => {
        if (res.code === 200) {
          this.details.detailList = res.data
          this.checkInfo = res.data
          res.data.createTime_ = res.data.createTime
            ? new Date(res.data.createTime.replace(/-/g, '/')).toLocaleString()
            : ''
          this.fmInfo.fmInfoList = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    // 固件信息
    // 编辑
    editClick() {
      this.fmInfo.EditDialogVisible = true
    },
    changeVisible() {
      this.fmInfo.EditDialogVisible = false
    },
    // 编辑固件信息方法
    changeDetail() {
      this.getDetails()
    },
    // 批次管理列表
    getUpgradeList() {
      const data = {
        pageNum: this.batchManage.pageNum,
        pageSize: this.batchManage.pageSize,
        fmId: this.fmId,
        batchNo: this.batchManage.id
      }
      this.batchManage.batchList = []
      this.loading = true
      upgradeList(data).then(res => {
        if (res.code === 200) {
          this.batchManage.batchList = res.data.data
          this.batchManage.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    // 获取 标签页 上方数据
    getStatistics() {
      statistics({ fmId: this.fmId }).then(res => {
        if (res.code === 200) {
          this.nums.targetFail = res.data.targetFail
          this.nums.targetSuccess = res.data.targetSuccess
          this.nums.targetTotal = res.data.targetTotal
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 搜索批次管理
    searchBatchManage() {
      this.batchManage.pageNum = 1
      this.getUpgradeList()
    },
    clearFun(key) {
      switch (key) {
        case 'id':
          this.batchManage.id = ''
          this.searchBatchManage()
          break
        case 'name':
          this.devManage.deviceName = ''
          this.searchDevManage()
          break
        case 'batchNo':
          this.devManage.batchNo = ''
          this.searchDevManage()
          break
      }
    },
    // 批次管理分页
    handleBatchChange(page) {
      this.batchManage.pageNum = page
      this.getUpgradeList()
    },
    upgradeSubmit() {
      if (this.details.detailList.fmStatus === 2) {
        this.checkInfo = this.details.detailList
        this.upgradeFmVisible = true
      }
    },
    // 批量升级
    upgradeVisible() {
      this.upgradeFmVisible = false
      this.searchBatchManage()
    },
    // 获取设备列表
    getDeviceList() {
      const data = {
        fmId: this.fmId,
        batchNo: this.devManage.batchNo,
        deviceName: this.devManage.deviceName,
        pageNum: this.devManage.pageNum,
        pageSize: this.devManage.pageSize
      }
      this.loading = true
      upgradeDeviceList(data).then(res => {
        if (res.code === 200) {
          this.devManage.devList = res.data.data
          this.devManage.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    // 设备列表分页
    handleDevChange(page) {
      this.devManage.pageNum = page
      this.getDeviceList()
    },
    // 设备列表搜索
    searchDevManage() {
      this.getDeviceList()
    },
    // 验证固件方法
    checkFm() {
      const fmStatus = this.details.detailList.fmStatus
      if (fmStatus === 0 || fmStatus === 3) {
        this.checkFmId = String(this.details.detailList.id)
        this.srcVersion = this.details.detailList.srcVersion
        this.getVerifyFirmInfo(this.checkFmId, this.srcVersion)
        this.checkInfo = this.details.detailList
      } else {
        // this.openCheckFm(fmStatus)
        this.checkStatus = fmStatus
        this.checkInfo = this.details.detailList
        this.checkProcessFlag = true
      }
    },
    // 验证进程 关闭回调
    closeCheckProcess() {
      this.checkProcessFlag = false
    },
    // 验证进程 批量升级回调
    upgradeProcess() {
      this.closeCheckProcess()
      this.upgradeFmVisible = true
    },
    // 验证固件前校验是否存在设备
    getVerifyFirmInfo(fmId, versions) {
      const data = {
        pageNum: 1,
        pageSize: 10,
        fmId: fmId,
        srcVersions: versions,
        productType: this.checkInfo.productType
      }
      getVerifyFirmInfo(data).then(res => {
        if (res.code === 200) {
          this.fmDeviceList = res.data.data
          this.checkFmVisible = true
        } else if (res.code === 9003) {
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {}
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    checkVisible() {
      this.checkFmVisible = false
    },
    refreshList() {
      this.fetchFmList()
    },
    // 跳转批次详情
    toBatchDetails(row) {
      this.$router.push({
        path: 'batchDetails',
        query: {
          id: row.fmId,
          productName: this.productName,
          batchNo: row.batchNo
        }
      })
    },
    // 控制popover显示
    ShowPopover(e, row) {
      this.popoverItem.check = '0'
      this.popoverItem.row = row
      const el = e.target
      this.visible = true
      this.$nextTick(() => {
        const pop = this.$refs.popover
        pop.popperJS._reference = el
        pop.popperJS.state.position = pop.popperJS._getPosition(
          pop.popperJS._popper,
          pop.popperJS._reference
        )
        pop.popperJS.update()
      })
    },
    // popover提交
    confirmPopover() {
      this.visible = false
      this.loading = true
      cancelBatchUpgrade({
        check: this.popoverItem.check,
        batchNo: this.popoverItem.row.batchNo
      })
        .then(res => {
          if (res.code === 200) {
            this.getDeviceList()
            this.$message.success('取消成功')
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.error('取消失败')
          this.loading = false
        })
    },
    // 返回上一级菜单
    goBack() {
      this.$router.go(-1)
    },
    // 格式化表格内容
    formatTaskType(row) {
      return row.taskType === 0 ? '验证固件' : '批量升级'
    },
    formatUgType(row) {
      return row.ugType === 1 ? '静态升级' : '动态升级'
    },
    formatDestVersion(row) {
      return row.status === 4 ? row.destVersion : row.srcVersion
    },
    formatCreateTime(row) {
      return row.createTime
        ? this.$fun.dateFormat(new Date(row.createTime.replace(/-/g, '/')), 'yyyy-MM-dd hh:mm:ss')
        : ''
    },
    // 下载
    downLoad() {
      getUploadFilePath({
        fileName: this.details.detailList.fmUrl
      }).then(res => {
        if (res.code === 200) {
          if (res.data.fmUrl) {
            window.open(res.data.fmUrl)
          }
        } else {
          this.$message.error
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
input,
textarea,
th,
td,
a {
  margin: 0;
  padding: 0;
}
.clearfix:after {
  content: '.';
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
$default: #409eff;
.download {
  color: $default;
  margin-left: 10px;
}
.details {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.go_back {
  cursor: pointer;
  padding-right: 10px;
}
.details-tit {
  > h2 {
    float: left;
  }
  .el_tag {
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
  .info_left {
    display: inline-block;
    width: 20%;
  }
}
.detail_info {
  margin-top: 20px;
}
.details_sta {
  margin-top: 20px;
  margin-bottom: 20px;
  .details_line {
    font-size: 14px;
  }
}
.oprate_btn {
  color: $default;
  cursor: pointer;
}
.edit_info-tit {
  margin-bottom: 20px;
  display: flex;
  .edit_icon {
    color: $default;
    margin-left: 10px;
    font-size: 14px;
    cursor: pointer;
  }
}
.edit_info {
  display: flex;
  font-size: 12px;
  border: 1px solid #ecedee;
  .edit_info-lf {
    width: 120px;
    box-sizing: border-box;
    padding: 10px;
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
  }
  .edit_info-rf {
    box-sizing: border-box;
    padding: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
