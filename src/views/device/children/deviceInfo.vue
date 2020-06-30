<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备详情
 -->
<template>
  <div id="deviceInfoView" v-loading="loading">
    <textarea
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
        <el-button type="text" class="ml10" @click="lookDeviceSecret = true,burnShow = false">查看</el-button>
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

    <el-dialog title="设备证书" :visible.sync="lookDeviceSecret" width="50%">
      <span class="b mb10">设备证书</span>
      <el-button type="text" class="ml10" @click="copy('一键复制')">一键复制</el-button>
      <div class="mb50" style="borderBottom: 1px solid #ecedee;">
        <div class="dialogSecret">
          <span class="title">ProductKey</span>
          <span class="secret">{{deviceObj.productKey}}</span>
          <el-button type="text" class="ml10" @click="copy(deviceObj.productKey)">复制</el-button>
        </div>
        <div class="dialogSecret">
          <span class="title">DeviceName</span>
          <span class="secret">{{deviceObj.deviceName}}</span>
          <el-button type="text" class="ml10" @click="copy(deviceObj.deviceName)">复制</el-button>
        </div>
        <div class="dialogSecret">
          <span class="title">DeviceSecret</span>
          <span class="secret">{{deviceObj.deviceSecret}}</span>
          <el-button type="text" class="ml10" @click="copy(deviceObj.deviceSecret)">复制</el-button>
        </div>
      </div>
      <span class="b mb10">烧录方式介绍</span>
      <div>
        <div v-if='burnShow' class="burnView">
          <div style="color:#333;">一型一密</div>
          <div>同一产品下所有设备可以烧录相同产品证书（即 ProductKey 和 ProductSecret ）。设备发送激活请求时，物联网平台进行产品身份确认，认证通过，下发该设备对应的DeviceSecret。</div>
          <div class="el-icon-info" style="background-color: #e5f3ff; padding-left:10px;width:100%;">
            如果您期望使用一型一密烧录方式，请前往对应的产品详情，来获取产品证书烧录，
            <el-button type="text" @click="toProduct">前往查看</el-button>
          </div>
          <div style="color:#333;">一机一密</div>
          <div>每个设备烧录其唯一的设备证书（ProductKey、DeviceName 和 DeviceSecret）。<br>当设备与物联网平台建立连接时，物联网平台对其携带的设备证书信息进行认证。</div>
        </div>
        <el-button type="text" class="mt10" :class="{'el-icon-arrow-up':burnShow,'el-icon-arrow-down':!burnShow}" @click="showBurn">{{burnShow?'收起':'一机一密、一型一密介绍'}}</el-button>
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
import { deviceInfo,topicList } from "@/api/deviceRequest";
export default {
  components: { deviceNameEdit },
  data() {
    return {
      deviceObj: {},
      infoType: "first",
      showDeviceNameEdit: false,
      lookDeviceSecret: false,
      loading: false,
      burnShow: false,
    };
  },

  computed: {
    authArr() {
      return this.$store.state.app.functionArr;
    }
  },

  mounted() {
    this.getDeviceInfo();
    this.getTopicList();
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

    //获取topic列表
    getTopicList(){

      topicList({
        id: this.$route.query.id
      })
        .then(res => {
          if (res.code === 200) {
            console.log(JSON.stringify(res.data));
            this.topicList = res.data;
          }
        })
        .catch(() => {
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

      if(copyStr == '一键复制'){
        copyStr = `{\r"ProductKey":${this.deviceObj.productKey},\r"DeviceName":${this.deviceObj.deviceName},\r"DeviceSecret":${this.deviceObj.deviceSecret}\r}`;
      }

      var inputElement = document.getElementById("copy_content"); //获取要赋值的input的元素
      inputElement.value = copyStr; //给input框赋值
      inputElement.select(); //选中input框的内容
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },

    //查看烧录方式介绍
    showBurn(){
      this.burnShow = !this.burnShow;
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
  border-bottom: 0;
  height: 36px; 
  display: flex;
  align-items: stretch; 
  span{
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .title{
    background: #fbfbfc;
    border-right: 1px solid #ecedee;
    width: 100px;
  }
}
.burnView{
   div{
     margin-top: 10px;
     font-size: 12px;
     color: #777;
     line-height: 20px;
   }
}
</style>
