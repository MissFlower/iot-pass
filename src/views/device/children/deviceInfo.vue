<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备详情
 -->
<template>
  <div id="deviceInfoView" v-loading="loading">
    <input
      id="copy_content"
      type="text"
      value
      style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;"
    />
    <div class="f20 b">
      <i class="el-icon-back" @click="back"></i>
      {{deviceObj.deviceName}}
    </div>
    <div class="f12 c6 mt20 mb20 df fww">
      <div class="productInfo">
        <span class="dib w100 mr20 c9">产品:</span>
        <span>{{deviceObj.productName}}</span>
        <el-button type="text" class="ml10" @click="toProduct">查看</el-button>
      </div>
      <div class="productInfo">
        <span class="dib w100 mr20 c9">DeviceSecret:</span>
        <span>********</span>
        <el-button type="text" class="ml10" @click="lookDeviceSecret = true">查看</el-button>
      </div>
      <div class="productInfo">
        <span class="dib w100 mr20 c9">ProductKey:</span>
        <span>{{deviceObj.productKey}}</span>
        <el-button type="text" class="ml10" @click="copy(deviceObj.productKey)">复制</el-button>
      </div>
    </div>

    <el-tabs v-model="infoType" type="card" @tab-click="infoTypeChange">
      <el-tab-pane label="设备信息" name="first">
        设备信息
        <div class="infoType_device">
          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">产品名称</span>
              <span>{{deviceObj.productName}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">产品认证方式</span>
              <span>{{deviceObj.authTypeStr}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">产品节点</span>
              <span>{{deviceObj.nodeTypeStr}}</span>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">设备状态</span>
              <span>{{deviceObj.deviceStatusStr}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">设备名称</span>
              <span>{{deviceObj.deviceName}}</span>
              <el-button type="text" class="ml10" @click="copy(deviceObj.deviceName)">复制</el-button>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">备注名称</span>
              <span>{{deviceObj.nickName}}</span>
              <el-button v-if="authArr.indexOf('device_nameEdit')>-1" type="text" class="ml10" @click="deviceNameEdit">编辑</el-button>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">ip地址</span>
              <span>{{deviceObj.ipAdress}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">固件版本</span>
              <span>{{deviceObj.fmVersion}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">激活时间</span>
              <span>{{deviceObj.activeTime}}</span>
            </div>
          </div>

          <div class="device_lineView">
            <div class="device_infoItem">
              <span class="infoItemName">最后登录时间</span>
              <span>{{deviceObj.lastLoginTime}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">最后登出时间</span>
              <span>{{deviceObj.lastLogoutTime}}</span>
            </div>
            <div class="device_infoItem">
              <span class="infoItemName">创建时间</span>
              <span>{{deviceObj.createTime}}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Topic列表" name="second">Topic列表</el-tab-pane>
      <el-tab-pane label="物模型数据" name="third">物模型数据</el-tab-pane>
    </el-tabs>

    <el-dialog
      title="设备证书"
      :visible.sync="lookDeviceSecret"
      width="50%"
      >
      <div class="dialogSecret">
        <span class="text">DeviceSecret</span>
        <span class="secret">{{deviceObj.deviceSecret}}</span>
        <el-button type="text" class="ml10" @click="copy(deviceObj.deviceSecret)">复制</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lookDeviceSecret = false">关 闭</el-button>        
      </span>
    </el-dialog>

    <!-- 备注名称编辑 -->
    <deviceNameEdit v-if="showDeviceNameEdit" :deviceObj="deviceObj"></deviceNameEdit>
  </div>
</template>

<script>
import deviceNameEdit from "./deviceNameEdit";
import { deviceInfo } from "@/api/deviceRequest";
export default {
  components: { deviceNameEdit },
  data() {
    return {
      deviceObj: {},
      infoType: "first",
      showDeviceNameEdit: false,
      lookDeviceSecret: false,
      loading: false
    };
  },

  computed: {
    authArr() {
      return this.$store.state.app.functionArr;
    }
  },

  mounted() {
    this.getDeviceInfo();
  },

  methods: {
    //获取设备详情
    getDeviceInfo() {
      this.loading = true;
      deviceInfo({
        id: this.$route.query.id
      })
        .then(res => {
          if (res.code === 200) {
            var deviceObj = res.data;
            //设备状态
            var statusDict = { "0": "未激活", "1": "在线", "2": "离线" };
            //节点类型
            var nodeTypeDict = { "1": "直连设备", "2": "网关子设备", "3": "网关设备" };
            //认证方式
            var authTypeDict = { "1": "设备秘钥", "2": "ID2", "3": "X.509证书" };
            if (deviceObj.deviceStatus != null) {
              deviceObj.deviceStatusStr = statusDict[deviceObj.deviceStatus.toString()];
            }
            if (deviceObj.nodeType != null) {
              deviceObj.nodeTypeStr = nodeTypeDict[deviceObj.nodeType.toString()];
            }
            if (deviceObj.authType != null) {
              deviceObj.authTypeStr = authTypeDict[deviceObj.authType.toString()];
            }
            if (deviceObj.enable != null) {
              deviceObj.enableBool = deviceObj.enable == 0 ? true : false;
            }
            this.deviceObj = deviceObj;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //设备名称编辑
    deviceNameEdit() {
      this.showDeviceNameEdit = true;
    },

    /*
    名称关闭弹窗关闭
    updata  是否刷新数据
    */
    deviceNameEditClose(updata) {
      this.showDeviceNameEdit = false;
      if (updata) {
        this.getDeviceInfo();
      }
    },

    //查看产品
    toProduct(){
      this.$router.push(`../product/detail/${this.deviceObj.productKey}`);
    },

    /*
    复制
    copyStr  复制内容
    */
    copy(copyStr) {
      var inputElement = document.getElementById("copy_content"); //获取要赋值的input的元素
      inputElement.value = copyStr; //给input框赋值
      inputElement.select(); //选中input框的内容
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },

    //type切换
    infoTypeChange() {},

    //返回
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
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
.dialogSecret{
  border: 1px solid #ecedee;
  height: 36px; 
  display: flex;
  align-items: stretch; 
  span{
    display: flex;
    align-items: center;
    
    padding: 5px;
  }
  .text{
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
  }
}
</style>
