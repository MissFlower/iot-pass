<!--
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备详情
 -->
<template>
  <div id="deviceInfoView" v-loading="loading">
    <div class="f20 b df ai_c">
      <i class="el-icon-back mr20" @click="back" />
      <span>{{ deviceObj.deviceName }}</span>
      <el-tag :type="deviceStatusType[deviceObj.deviceStatus]" v-if="existenceFlag" class="ml10">{{ deviceObj.deviceStatusStr }}</el-tag>
    </div>
    <div class="f12 c6 mt20 mb20 df fww">
      <div class="productInfo">
        <span class="dib w100 mr20 c9">产品:</span>
        <span>{{ deviceObj.productName }}</span>
        <iconToolTip ref="iconToolTip" :content="`查看`" :icon="`eye`" @clickFun="toProduct" v-if="existenceFlag" class="ml10"></iconToolTip>
      </div>
      <div class="productInfo">
        <span class="dib w100 mr20 c9">DeviceSecret:</span>
        <span>********</span>
        <!-- <svg-icon icon-class="eye" class="hand ml10" @click="(lookDeviceSecret = true), (burnShow = false)" v-if="existenceFlag"></svg-icon> -->
        <iconToolTip ref="iconToolTip" :content="`查看`" :icon="`eye`" @clickFun="showDeviceSecret" v-if="existenceFlag" class="ml10"></iconToolTip>
      </div>
      <div class="productInfo">
        <span class="dib w100 mr20 c9">ProductKey:</span>
        <span>{{ deviceObj.productKey }}</span>
        <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="deviceObj.productKey" v-if="existenceFlag" class="ml10"></iconToolTip>
      </div>
    </div>

    <el-tabs v-model="infoType" type="card">
      <el-tab-pane label="设备信息" name="first" :disabled="!existenceFlag">
        设备信息
        <div class="infoType_device">
          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">产品名称</span>
              <span>{{ deviceObj.productName }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">产品认证方式</span>
              <span>{{ deviceObj.authTypeStr }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">产品节点</span>
              <span>{{ deviceObj.nodeTypeStr }}</span>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">设备状态</span>
              <span>{{ deviceObj.deviceStatusStr }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">设备名称</span>
              <span>{{ deviceObj.deviceName }}</span>
              <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="deviceObj.deviceName" v-if="existenceFlag" class="ml10"></iconToolTip>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">备注名称</span>
              <span>{{ deviceObj.nickName }}</span>
              <iconToolTip ref="iconToolTip" :content="`编辑`" :icon="`el-icon-edit`" @clickFun="deviceNameEdit" v-if="authArr.indexOf('device_nameEdit') > -1 && existenceFlag" class="ml10"></iconToolTip>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">ip地址</span>
              <span>{{ deviceObj.ipAdress }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">固件版本</span>
              <span>
                <template v-for="(item, index) in fmVersionList">
                  <span :key="index" v-if="index == 0">{{ item.moduleType }} - {{ item.version }}</span>
                </template>
                <el-link v-if="fmVersionList.length > 1" type="primary" class="f12 ml10" :underline="false" @click="showMoreVersion">更多</el-link>
              </span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">激活时间</span>
              <span>{{ deviceObj.activeTime }}</span>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">最后登录时间</span>
              <span>{{ deviceObj.lastLoginTime }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">最后登出时间</span>
              <span>{{ deviceObj.lastLogoutTime }}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">创建时间</span>
              <span>{{ deviceObj.createTime }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Topic列表" name="topic" :disabled="!existenceFlag">
        <device-topic :device-obj="deviceObj" />
      </el-tab-pane>
      <el-tab-pane v-if="modelShow" label="物模型数据" name="model" :disabled="!existenceFlag">
        <!-- 二级标签页 -->
        <el-radio-group v-model="modelType">
          <el-radio-button label="runState">运行状态</el-radio-button>
          <el-radio-button label="eventManage">事件管理</el-radio-button>
          <el-radio-button label="serviceCall">服务调用</el-radio-button>
        </el-radio-group>
        <!-- 标签下方对应的内容 -->
        <KeepAlive>
          <component :is="modelType" :device-info="deviceObj" />
        </KeepAlive>
        <!-- <run-state v-show="modelType == 'runState'" :device-info="deviceObj" />
        <event-manage v-show="modelType == 'eventManage'" :device-info="deviceObj" />
        <service-Call v-show="modelType == 'serviceCall'" :device-info="deviceObj" /> -->
      </el-tab-pane>
      <el-tab-pane label="设备日志" name="deviceLog" :disabled="!existenceFlag">
        <device-log :device-obj="deviceObj" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="设备证书" :visible.sync="lookDeviceSecret" width="50%">
      <span class="b">设备证书</span>
      <iconToolTip ref="iconToolTip" :content="`一键复制`" :icon="`allCopy`" :copyStr="allCopy" v-if="existenceFlag" class="ml10"></iconToolTip>
      <div class="mb50 mt20" style="borderBottom: 1px solid #ecedee;">
        <div class="dialogSecret">
          <span class="title">ProductKey</span>
          <span class="secret">{{ deviceObj.productKey }}</span>
          <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="deviceObj.productKey" v-if="existenceFlag" class="ml10"></iconToolTip>
        </div>
        <div class="dialogSecret">
          <span class="title">DeviceName</span>
          <span class="secret">{{ deviceObj.deviceName }}</span>
          <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="deviceObj.deviceName" v-if="existenceFlag" class="ml10"></iconToolTip>
        </div>
        <div class="dialogSecret">
          <span class="title">DeviceSecret</span>
          <span class="secret">{{ deviceObj.deviceSecret }}</span>
          <iconToolTip ref="iconToolTip" :content="`复制`" :icon="`el-icon-copy-document`" :copyStr="deviceObj.deviceSecret" v-if="existenceFlag" class="ml10"></iconToolTip>
        </div>
      </div>
      <span class="b mb10">烧录方式介绍</span>
      <div>
        <div v-if="burnShow" class="burnView">
          <div style="color:#333;">一型一密</div>
          <div>
            同一产品下所有设备可以烧录相同产品证书（即 ProductKey 和
            ProductSecret
            ）。设备发送激活请求时，物联网平台进行产品身份确认，认证通过，下发该设备对应的DeviceSecret。
          </div>
          <div
            class="el-icon-info"
            style="background-color: #e5f3ff; padding-left:10px;width:100%;"
          >
            如果您期望使用一型一密烧录方式，请前往对应的产品详情，来获取产品证书烧录，
            <el-button type="text" @click="toProduct">前往查看</el-button>
          </div>
          <div style="color:#333;">一机一密</div>
          <div>
            每个设备烧录其唯一的设备证书（ProductKey、DeviceName 和
            DeviceSecret）。
            <br />当设备与物联网平台建立连接时，物联网平台对其携带的设备证书信息进行认证。
          </div>
        </div>
        <el-button
          type="text"
          class="mt10"
          :class="{
            'el-icon-arrow-up': burnShow,
            'el-icon-arrow-down': !burnShow,
          }"
          @click="showBurn"
        >{{ burnShow ? "收起" : "一机一密、一型一密介绍" }}</el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="lookDeviceSecret = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 备注名称编辑 -->
    <deviceNameEdit v-if="showDeviceNameEdit" :device-obj="deviceObj" />

    <moreVerision v-if="moreFlag" :list="fmVersionList" @close="closeMoreVer"></moreVerision>
  </div>
</template>

<script>
import deviceNameEdit from './deviceNameEdit'
import deviceTopic from './topic/topic'
import runState from './runState'
import eventManage from './eventManage'
import serviceCall from './serviceCall'
import deviceLog from './deviceLog'
import moreVerision from './moreVerision'
import iconToolTip from '@/components/iconToolTip'

import { deviceInfo, getDeviceVersions } from '@/api/deviceRequest'
export default {
  components: {
    deviceNameEdit,
    runState,
    eventManage,
    serviceCall,
    deviceTopic,
    deviceLog,
    moreVerision,
    iconToolTip
  },
  data() {
    return {
      deviceObj: {},
      infoType: 'first',
      showDeviceNameEdit: false,
      lookDeviceSecret: false,
      loading: false,
      burnShow: false,
      modelType: 'runState',
      modelShow: false,
      deviceStatusType: {
        '0': 'info',
        '1': 'success',
        '2': 'error'
      },
      currentComponent: null,
      fmVersionList: [],
      moreFlag: false,
      existenceFlag: false
    }
  },

  computed: {
    authArr() {
      return this.$store.state.app.functionArr
    },
    allCopy() {
      return `{\r"ProductKey":${this.deviceObj.productKey},\r"DeviceName":${this.deviceObj.deviceName},\r"DeviceSecret":${this.deviceObj.deviceSecret}\r}`
    }
  },

  watch: {
    $route() {
      if (this.$route.meta.code === 'device_detail') {
        this.getDeviceInfo()
      }
    }
  },

  mounted() {
    this.getDeviceInfo()
  },

  methods: {
    // 获取设备详情
    getDeviceInfo() {
      if (!this.$route.query.id) {
        return
      }
      this.loading = true
      deviceInfo({
        id: this.$route.query.id
      })
        .then(res => {
          if (res.code === 200) {
            var deviceObj = res.data
            if (!res.data) {
              this.infoType = 'first'
              this.$message.warning('设备不存在')
              this.existenceFlag = false
            } else {
              // 设备状态
              var statusDict = { '0': '未激活', '1': '在线', '2': '离线' }
              // 节点类型
              var nodeTypeDict = {
                '1': '直连设备',
                '2': '网关子设备',
                '3': '网关设备'
              }
              // 认证方式
              var authTypeDict = {
                '1': '设备秘钥',
                '2': 'ID2',
                '3': 'X.509证书'
              }
              if (deviceObj.deviceStatus != null) {
                deviceObj.deviceStatusStr =
                  statusDict[deviceObj.deviceStatus.toString()]
              }
              if (deviceObj.nodeType != null) {
                deviceObj.nodeTypeStr =
                  nodeTypeDict[deviceObj.nodeType.toString()]
              }
              if (deviceObj.authType != null) {
                deviceObj.authTypeStr =
                  authTypeDict[deviceObj.authType.toString()]
              }
              if (deviceObj.enable != null) {
                deviceObj.enableBool = deviceObj.enable === 0
              }
              this.deviceObj = deviceObj
              this.existenceFlag = true
            }
            this.getVersions()
          }
          // this.modelType = 'runState'
          this.modelShow = true
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取固件版本信息
    getVersions() {
      this.fmVersionList = []
      this.loading = true
      getDeviceVersions({
        productKey: this.deviceObj.productKey,
        deviceName: this.deviceObj.deviceName
      }).then(res => {
        this.fmVersionList = res.data ? res.data : []
        this.loading = false
      })
    },
    // 展示更多的固件版本信息
    showMoreVersion() {
      this.moreFlag = true
    },
    closeMoreVer() {
      this.moreFlag = false
    },
    // 设备名称编辑
    deviceNameEdit() {
      this.showDeviceNameEdit = true
    },

    /*
    名称关闭弹窗关闭
    updata  是否刷新数据
    */
    deviceNameEditClose(updata) {
      this.showDeviceNameEdit = false
      if (updata) {
        this.getDeviceInfo()
      }
    },

    // 查看产品
    toProduct() {
      this.$router.push(`../product/detail/${this.deviceObj.productKey}`)
    },
    // 查看DeviceSecret
    showDeviceSecret() {
      this.lookDeviceSecret = true
      this.burnShow = false
    },
    // 查看烧录方式介绍
    showBurn() {
      this.burnShow = !this.burnShow
    },

    // 返回
    back() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 20px!important;
  height: 18px!important;
}
#deviceInfoView {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  min-width: 1100px;
}
.productInfo {
  width: 50%;
  line-height: 35px;
  display: flex;
  align-items: center;
}
.infoType_device {
  margin-top: 20px;
  font-size: 12px;
  width: 100%;
  color: #373d41;
  border-bottom: 1px solid #ecedee;
  border-right: 1px solid #ecedee;
}
.device_lineView {
  display: flex;
  border-top: 1px solid #ecedee;
}
.device_infoItem {
  width: 33%;
  height: 45px;
  line-height: 45px;
}
.device_infoItem span {
  padding-left: 10px;
}
.infoItemName {
  color: #73777a;
  width: 120px;
  display: inline-block;
  border-right: 1px solid #ecedee;
  border-left: 1px solid #ecedee;
  background: #fbfbfc;
}
.dialogSecret {
  border: 1px solid #ecedee;
  border-bottom: 0;
  height: 36px;
  display: flex;
  align-items: stretch;
  span {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .title {
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
    width: 100px;
  }
}
.burnView {
  div {
    margin-top: 10px;
    font-size: 12px;
    color: #777;
    line-height: 20px;
  }
}
</style>
