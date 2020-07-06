<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：验证固件
 -->
<template>
  <div>
    <el-dialog
      title="验证固件"
      :visible.sync="checkFmVisible"
      width="25%"
      :before-close="closeDialog"
    >
      <el-form
        :model="form"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="待升级版本号">
          <el-input type="text" v-model="srcVersion"></el-input>
        </el-form-item>
        <!--<el-form-item label="待验证设备">-->
        <!--<el-input type="text" v-model="form.deviceNames"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="待验证设备">
          <el-select
            v-model="form.showDeviceNames"
            multiple
            placeholder="请选择设备"
            @focus="selectDevice"
          >
              <option value=""></option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="verifySubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="验证固件"
      :visible.sync="progressVisible"
      width="20%"
      :show-close="showClose"
    >
      <p>
        {{ checkStatus === "1" ? "固件验证中" : "固件验证失败" }}
      </p>
      <p v-if="checkStatus === '2'">提示：{{ checkMessage }}</p>
      <el-progress
        :percentage="checkPer"
        v-if="checkStatus !== '2'"
      ></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <ChooseDevice
      :chooseDeviceVisible="chooseDeviceVisible"
      :fmDeviceList="fmDeviceList"
      @deviceVisible="deviceVisible"
      @multipleDevice="multipleDevice"
    ></ChooseDevice>
  </div>
</template>
<script>
import ChooseDevice from "@/components/firmware/chooseDevice";
import { addVerify } from "@/api/fireware";
export default {
  props: {
    checkFmVisible: {
      type: Boolean
    },
    checkFmId: {
      type: String
    },
    srcVersion: {
      type: String
    },
      fmDeviceList: {
          type: Array
      }
  },
  data() {
    return {
      form: {
        fmId: "",
        srcVersions: "",
        deviceIds: [],
        showDeviceNames: []
      },
      chooseDeviceVisible: false,
      progressVisible: false,
      showClose: false,
      checkPer: 0,
      checkStatus: "1",
      checkMessage: ""
    };
  },
  components: {
    ChooseDevice
  },
  methods: {
      // 提交验证固件
    verifySubmit() {
      this.form.fmId = this.checkFmId;
      this.form.srcVersions = this.srcVersion;
      let data = {
        "fmId": this.form.fmId,
        "srcVersions": this.form.srcVersions,
        "deviceIds": this.form.deviceIds
      };
      addVerify(data).then(res => {
        this.progressVisible = true;
        this.$emit("checkVisible", this.checkFmVisible);
        this.checkProgress(res);
      });
    },
      // 进度条
    checkProgress(res) {
      let self = this;
      let timer = setInterval(function() {
        if (self.checkPer === 99) {
          clearInterval(timer);
        } else {
          self.checkPer += 1;
        }
      }, 100);
      if (res.code === 200) {
        clearInterval(timer);
        this.checkPer = 100;
        this.checkStatus = "1";
        this.$emit("refreshList", true);
      } else {
        clearInterval(timer);
        this.checkStatus = "2";
        this.checkMessage = res.message;
      }
    },
      // 关闭弹窗
    closeDialog() {
      this.form = {
        fmId: "",
        srcVersions: "",
        deviceIds: [],
        showDeviceNames: []
      };
      this.$refs["ruleForm"].resetFields(); // 清空弹出框校验
      this.$emit("checkVisible", this.checkFmVisible);
    },
    // 获取选中的设备
    multipleDevice(checkedDeviceList) {
      this.form.showDeviceNames = [];
      this.form.deviceIds = [];
      checkedDeviceList.forEach(item => {
        this.form.showDeviceNames.push(item.deviceName);
        this.form.deviceIds.push(item.deviceId);
      })
    },
    selectDevice() {
      this.chooseDeviceVisible = true;
    },
    deviceVisible() {
      this.chooseDeviceVisible = false;
    }
  }
};
</script>
