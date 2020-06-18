<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：新建设备
 -->
<template>
  <div>
    <div class="mb20 df jc_sb">
      <div class="df">
        <el-input placeholder="请输入名称" v-model="searchInputValue">
          <el-select
            class="w120"
            v-model="searchTypeSelect"
            slot="prepend"
            placeholder="请选择"
            @change="searchInputValue = ''"
          >
            <el-option label="设备名称" value="1"></el-option>
            <el-option label="备注名称" value="2"></el-option>
          </el-select>
        </el-input>
        <el-input class="ml10 mr10 w150" placeholder="固件版本" v-model="fmVersionValue"></el-input>
        <el-button icon="el-icon-search" @click="searchBtnTouch"></el-button>
      </div>
      <el-button type="primary" @click="showNewDevice = true">新建设备</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="nodeType" label="节点类型"></el-table-column>
      <el-table-column prop="nickName" label="备注名称"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间"></el-table-column>
      <el-table-column prop="lastLogoutTime" label="最后登出时间"></el-table-column>
      <el-table-column prop="deviceStatus" label="设备状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      class="tr mt20"
    ></el-pagination>

    <newDevice v-if="showNewDevice"></newDevice>
  </div>
</template>

<script>
import newDevice from "./newDevice";
import { deviceList, deleteDevice } from "@/api/equRequest";
export default {
  components: { newDevice },
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 40,
      total: 0,
      searchTypeSelect: "1",
      searchInputValue: "",
      fmVersionValue: "",
      showNewDevice: false,
      deviceSel: ""
    };
  },
  mounted() {
    this.getDeviceList();
  },

  methods: {
    //获取设备列表
    getDeviceList() {
      this.$store.dispatch("setLoading", true);
      deviceList({
        deviceName: this.searchTypeSelect == "1" ? this.searchInputValue : "",
        nickName: this.searchTypeSelect == "2" ? this.searchInputValue : "",
        fmVersion: this.fmVersionValue,
        pageNum: this.page,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              this.list = res.data.list;
              this.total = res.data.total;
            }
          }
          this.$store.dispatch("setLoading", false);
        })
        .catch(() => {
          this.$store.dispatch("setLoading", false);
        });
    },

    //搜索按钮
    searchBtnTouch() {
      this.getDeviceList();
    },

    //设备查看
    handleClick(deviceObj) {
      console.log(JSON.stringify(deviceObj));
      this.$router.push(`deviceInfo?id=${deviceObj.id}`);
    },

    //删除设备
    deleteClick(deviceObj) {
      this.$confirm("确定要删除此设备么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("setLoading", true);
          deleteDevice({
            deviceId: deviceObj.id,
            productKey: deviceObj.productKey,
            deviceName: deviceObj.deviceName
          })
            .then(res => {
              if (res.code === 200) {
                this.getDeviceList();
              }
              this.$message({
                message: res.message
              });
              this.$store.dispatch("setLoading", false);
            })
            .catch(() => {
              this.$store.dispatch("setLoading", false);
            });
        })
        .catch(() => {});
    },

    //列表翻页
    handleCurrentChange() {
      this.getDeviceList();
    },

    //新建设备窗口关闭
    newDeviceClose(updata) {
      this.showNewDevice = false;
      if (updata) {
        this.getDeviceList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#editRole {
}
</style>
