<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：批次详情
 -->
<template>
  <div class="details">
    <div class="details-tit clearfix" v-if="JSON.stringify(batchDetailList) != '{}'">
      <h2>
        <span class="go_back" @click="goBack">
          <i class="el-icon-back"></i>
        </span>
        {{ batchDetailList.batchNo }}
      </h2>
      <el-tag
        :type="deviceType"
        class="el_tag"
        v-if="batchDetailList.taskStatus || batchDetailList.taskStatus == 0"
      >{{ taskStatusObj[batchDetailList.taskStatus].label }}</el-tag>
    </div>
    <div>
      <el-tabs v-model="tab" type="card" v-loading="loading">
        <el-tab-pane label="设备列表" name="first">
          <div class="selectCon df f12">
            <div
              v-for="(item, index) in countArr"
              :key="index"
              class="selectItem"
              :class="selectCountItemStatus == item.status ? 'active' : 'hand'"
              @click.stop="handleSelectCountItem(item)"
            >
              <div v-if="selectCountItemStatus == item.status" class="select">
                <i class="el-icon-check icon"></i>
              </div>
              <div class="f16">{{ item.count }}</div>
              <div class="c9 mt10 df ai_c">
                <div v-if="item.color" :style="{'background-color': item.color}" class="point"></div>
                <div>{{ item.title }}</div>
              </div>
            </div>
          </div>
          <el-table :data="devManage.devList" border stripe>
            <el-table-column label="DeviceName" prop="deviceName"></el-table-column>
            <el-table-column label="产品" prop="productName">
              <template>{{ productName }}</template>
            </el-table-column>
            <el-table-column label="当前版本号">
              <template
                slot-scope="scope"
              >{{ scope.row.status == 4 ? scope.row.destVersion : scope.row.srcVersion }}</template>
            </el-table-column>
            <el-table-column label="状态更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="状态" prop="status" width="210">
              <template slot-scope="scope">
                <span v-if="selectCountItemStatus != 3">
                  <div
                    :style="{'background-color': upgradeStatusObj[scope.row.status].color}"
                    class="point"
                  ></div>
                  {{ upgradeStatusObj[scope.row.status] ? upgradeStatusObj[scope.row.status].label : scope.row.status }}
                </span>
                <div v-else class="df ai_c">
                  <el-progress
                    class="w150 mr5"
                    :stroke-width="3"
                    :percentage="scope.row.progress * 1"
                    :show-text="false"
                    :color="color"
                  ></el-progress>
                  <span>{{ scope.row.progress }}%</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="selectCountItemStatus != 3 || selectCountItemStatus != 4"
            >
              <template slot-scope="scope">
                <a
                  v-if="scope.row.status == 5"
                  class="oprate_btn"
                  @click="upgrade(scope.row.id)"
                >重升级</a>
                <span v-if="scope.row.status < 2 && scope.row.status == 5">|</span>
                <a
                  class="oprate_btn"
                  v-if="scope.row.status < 2"
                  @click="ShowPopover($event, scope.row)"
                >取消</a>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleBatchChange"
            :current-page.sync="devManage.pageNum"
            :page-size="devManage.pageSize"
            layout="total, prev, pager, next"
            class="tr mt20"
            :total="devManage.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="批次信息" name="second">
          <el-row v-if="JSON.stringify(batchDetailList) != '{}'">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">批次ID</div>
                <div class="edit_info-rf">{{ batchDetailList.batchNo }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">所属产品</div>
                <div class="edit_info-rf">{{ productName }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级前固件版本号</div>
                <div class="edit_info-rf">{{ batchDetailList.srcVersion }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级后固件版本号</div>
                <div class="edit_info-rf">{{ batchDetailList.destVersion }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级策略</div>
                <div
                  class="edit_info-rf"
                >{{ batchDetailList.ugStrategy == 0 ? '静态升级' : (batchDetailList.ugStrategy == 1 ? '动态升级' : batchDetailList.ugStrategy) }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级范围</div>
                <div
                  class="edit_info-rf"
                >{{ scopeTypeObj[batchDetailList.scopeType] ? scopeTypeObj[batchDetailList.scopeType] : batchDetailList.scopeType }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="batchDetailList.ugStartTime">
              <div class="edit_info">
                <div class="edit_info-lf">升级时间
                  <span v-if="batchDetailList.ugEndTime">/结束时间</span>
                </div>
                <div class="edit_info-rf">
                  {{ batchDetailList.ugStartTime }}
                  <span
                    v-if="batchDetailList.ugEndTime"
                  >- {{ batchDetailList.ugEndTime }}</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级时间</div>
                <div
                  class="edit_info-rf"
                >{{ batchDetailList.ugTimeType == 0 ? '立即升级' : (batchDetailList.ugTimeType == 1 ? '定时升级' : batchDetailList.ugTimeType) }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">固件推送速率</div>
                <div class="edit_info-rf">{{ batchDetailList.rate }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级失败重试时间间隔</div>
                <div class="edit_info-rf">{{ batchDetailList.retryInterval }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">升级重试上限次数</div>
                <div class="edit_info-rf">{{ batchDetailList.maxRetryCnt }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="edit_info">
                <div class="edit_info-lf">设备升级超时时间</div>
                <div class="edit_info-rf">{{ batchDetailList.timeOut }}</div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-popover ref="popover" placement="top" width="200" trigger="manual" v-model="visible">
      <div>
        <i class="el-icon-warning" style="color: #f90"></i>
        是否确认取消升级吗？
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
import { upgradeList, upgradeDeviceList, retryPublishUpdateMsg, cancelDeviceUpgrade, getSttatusCount, getFmDetails } from '@/api/fireware'
import { upgradeStatusObj, taskStatusObj, scopeTypeObj } from '@/data/constants'
export default {
  data() {
    return {
      loading: false,
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
      upgradeStatusObj,
      taskStatusObj,
      scopeTypeObj,
      productName: '',
      popoverItem: {
        row: null
      },
      // 状态统计
      countArr: [
        {
          title: '所有状态',
          count: 0,
          status: ''
        }, {
          title: '待推送',
          count: 0,
          status: 1,
          color: '#ccc'
        }, {
          title: '已推送',
          count: 0,
          status: 2,
          color: '#2192D9'
        }, {
          title: '升级中',
          count: 0,
          status: 3,
          color: '#ff8a00'
        }, {
          title: '升级成功',
          count: 0,
          status: 4,
          color: '#0fa18a'
        }, {
          title: '升级失败',
          count: 0,
          status: 5,
          color: '#f00'
        }
      ],
      selectCountItemStatus: '',
      color: '#0070cc',
      visible: false,
      operateFlag: true
    }
  },
  watch: {
    $route() {
      if (this.$route.meta.code === 'fm_batchDetails') {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.$route.query.id) {
        return
      }
      this.batchManage.fmId = this.$route.query.id
      // this.upgradeId = this.$route.query.upgradeId
      this.batchManage.batchNo = this.$route.query.batchNo
      this.productName = this.$route.query.productName
      this.queryFM()
      // this.getDeviceList()
      // this.getCount()
    },
    queryFM() { // 查询固件是否存在
      this.loading = true
      const formData = new FormData()
      formData.append('id', this.batchManage.fmId)
      getFmDetails(formData).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (!res.data) {
            this.$message.warning('固件不存在')
            this.operateFlag = false
            return
          } else {
            this.operateFlag = true
            this.getDetails()
            this.getDeviceList()
            this.getCount()
          }
        }
      })
    },
    // 获取详情
    getDetails() {
      this.loading = true
      this.batchDetailList = {}
      const data = {
        'pageNum': this.batchManage.pageNum,
        'pageSize': this.batchManage.pageSize,
        'fmId': this.batchManage.fmId,
        'batchNo': this.batchManage.batchNo
      }
      upgradeList(data).then(res => {
        if (res.code === 200) {
          if (res.data && res.data.data && res.data.data.length > 0) {
            this.batchDetailList = res.data.data[0]
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取设备列表
    getDeviceList() {
      const data = {
        fmId: this.batchManage.fmId,
        batchNo: this.batchManage.batchNo,
        pageNum: this.devManage.pageNum,
        pageSize: this.devManage.pageSize,
        status: this.selectCountItemStatus
      }
      if (this.devManage.deviceName) {
        data.deviceName = this.devManage.deviceName
      }
      this.devManage.devList = []
      this.loading = true
      upgradeDeviceList(data).then(res => {
        if (res.code === 200) {
          if (res.data.data && res.data.data.length > 0) {
            res.data.data.forEach(item => {
              if (item.status === 0) {
                item.status = 1
              }
            })
          }
          this.devManage.devList = res.data.data
          this.devManage.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    // 重新升级
    upgrade(id) {
      this.$confirm('确认要重新升级?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        retryPublishUpdateMsg({
          id: id
        }).then(res => {
          if (res.code === 200) {
            this.getDeviceList()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
      })
    },
    // 返回上一级菜单
    goBack() {
      this.$router.go(-1)
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
        pop.popperJS.state.position = pop.popperJS._getPosition(pop.popperJS._popper, pop.popperJS._reference)
        pop.popperJS.update()
      })
    },
    // popover提交
    confirmPopover() {
      this.visible = false
      this.loading = true
      cancelDeviceUpgrade({
        batchNo: this.popoverItem.row.batchNo,
        deviceName: this.popoverItem.row.deviceName,
        productKey: this.popoverItem.row.productKey
      }).then(res => {
        if (res.code === 200) {
          this.getDeviceList()
          this.$message.success('取消成功')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('取消失败')
        this.loading = false
      })
    },
    // 选择状态
    handleSelectCountItem(item) {
      if (!this.operateFlag) {
        return
      }
      this.selectCountItemStatus = item.status
      this.getCount()
      this.handleBatchChange(1)
    },
    // 获取转台统计
    getCount() {
      this.loading = true
      getSttatusCount({
        batchNo: this.batchManage.batchNo
      }).then(res => {
        if (res.code === 200) {
          const obj = {}
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.status === 0 || item.status === 1) {
                if (obj[1]) {
                  obj[1] = obj[1] + item.deviceCount
                } else {
                  obj[1] = item.deviceCount
                }
              } else {
                obj[item.status] = item.deviceCount
              }
            })
          }
          let all = 0
          this.countArr.forEach(item => {
            if (obj[item.status]) {
              item.count = obj[item.status]
              all += obj[item.status]
            } else {
              item.count = 0
            }
          })
          this.countArr[0].count = all
        }
        this.loading = false
      })
    },
    handleBatchChange(page) {
      this.batchManage.pageNum = page
      this.getDeviceList()
    }
  }
}
</script>
<style lang="scss" scoped>
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
$default: #409eff;
.oprate_btn {
  color: $default;
  cursor: pointer;
}
.details {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  .selectCon {
    margin-bottom: 20px;
    .selectItem {
      width: 120px;
      height: 64px;
      padding: 6px 0 0 12px;
      border: 1px solid #c6cbd1;
      border-radius: 3px;
      margin-right: 9px;
      position: relative;
      .point {
        width: 8px;
        height: 8px;
      }
      .select {
        width: 0;
        height: 0;
        border-color: transparent #0070cc #0070cc transparent;
        border-style: solid;
        border-width: 8px;
        position: absolute;
        right: 0;
        bottom: 0;
        color: #fff;
        .icon {
          position: absolute;
          top: -3px;
          right: -9px;
          transform: scale(0.8);
        }
      }
    }
    .selectItem.active {
      border: 1px solid #0070cc;
    }
  }
}
.details-tit {
  margin-bottom: 20px;
  > h2 {
    float: left;
  }
  .el_tag {
    float: left;
    margin-top: 3px;
    margin-left: 20px;
  }
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .edit_info-rf {
    box-sizing: border-box;
    padding: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>
