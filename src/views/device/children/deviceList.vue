<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备列表
 -->
<template>
  <div v-loading="loading">
    <div class="mb20 df jc_sb">
      <div class="df">
        <el-input placeholder="请输入名称" v-model="searchInputValue" @change="searchBtnTouch">
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
        <el-input class="ml10 mr10 w150" placeholder="固件版本" v-model="fmVersionValue" @change="searchBtnTouch"></el-input>
        <el-button icon="el-icon-search" @click="searchBtnTouch"></el-button>
      </div>
      <el-button type="primary" @click="showNewDevice = true">新建设备</el-button>
    </div>
    <el-table :data="list" border @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="nodeTypeStr" label="节点类型"></el-table-column>
      <el-table-column prop="nickName" label="备注名称"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间"></el-table-column>
      <el-table-column prop="lastLogoutTime" label="最后登出时间"></el-table-column>
      <el-table-column prop="deviceStatus" label="状态/启用状态">
        <template v-slot="device">
          <span class="deviceStatusView"><div :style="{background: device.row.statusColor}"></div>{{device.row.enableBool?device.row.deviceStatusStr:'已禁用'}}</span>
          <el-switch v-model="device.row.enableBool" @change="deviceEnable(device.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pr">
      <div class="bottomSeleView">
        <el-checkbox @change="bottomSeleChange" v-model="bottomSeleChecked" :disabled="bottomSeleDis"></el-checkbox>

        <el-popconfirm :title="'确定要批量删除选中的'+multipleSelection.length+'个设备吗？'" @onConfirm="batchOperate(1)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">删除</el-button>
        </el-popconfirm>
        <el-popconfirm :title="'确定要批量禁用选中的'+multipleSelection.length+'个设备吗？'" @onConfirm="batchOperate(2)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">禁用</el-button>
        </el-popconfirm>
        <el-popconfirm :title="'确定要批量启用选中的'+multipleSelection.length+'个设备吗？'" @onConfirm="batchOperate(3)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">启用</el-button>
        </el-popconfirm>
      </div>
      <!-- 分页-->
      <pagination :data="tableData" @pagination="handleCurrentChange" class="tr"/>
    </div>
    <!-- 新建设备 -->
    <newDevice v-if="showNewDevice"></newDevice>
  </div>
</template>

<script>
import newDevice from "./newDevice";
import Pagination from "@/components/Pagination"
import { deviceList, deleteDevice, deviceEnable } from "@/api/equRequest";
export default {
  components: { newDevice,Pagination },
  data() {
    return {
      list: [],
      tableData: {
        pageCount: 0, //总页数
        total: 0, // 总条数
        pageSize: 10, //一页大小
        pageNum: 0, // 第几页 从0开始    
      },
      searchTypeSelect: "1",
      searchInputValue: "",
      fmVersionValue: "",
      showNewDevice: false,
      loading: false,
      multipleSelection: [],
      bottomSeleDis: true,
      bottomSeleChecked: false
    };
  },
  mounted() {
    this.getDeviceList();
  },

  methods: {
    //获取设备列表
    getDeviceList() {
      this.loading = true;
      deviceList({
        deviceName: this.searchTypeSelect == "1" ? this.searchInputValue : "",
        nickName: this.searchTypeSelect == "2" ? this.searchInputValue : "",
        fmVersion: this.fmVersionValue,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.pageSize
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              let list = res.data.data;
              //设备状态
              let statusDict = {'0':'未激活','1':'在线','2':'离线'};
              //节点类型
              let nodeTypeDict = {'1':'直连设备','2':'网关子设备','3':'网关设备'};
              var newList = list.map(function(value) {
                if(value.deviceStatus != null){
                  value.deviceStatusStr = statusDict[value.deviceStatus.toString()];
                }
                if(value.nodeType != null){
                  value.nodeTypeStr = nodeTypeDict[value.nodeType.toString()];
                }
                value.enableBool = value.enable==0?true:false;
                value.statusColor = !value.enableBool?'#d93026':value.deviceStatus==1?'#1EA214':'#ffc440';
                return value;
              });
              this.list = newList;

              let {data,...pagination} = res.data;
              this.tableData = pagination;
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //搜索按钮
    searchBtnTouch() {
      this.getDeviceList();
    },

    /*
    设备启、禁用
    deviceObj  设备对象
    */
    deviceEnable(deviceObj){
      this.loading = true;
      deviceEnable({
        id: deviceObj.id,
        enable: deviceObj.enable==0?'1':'0',
      })
        .then(res => {
          this.getDeviceList();
          this.$message({
            type: res.code == 200?"success":'warning',
            message: res.message
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /*
    查看设备
    deviceObj  设备对象
    */
    handleClick(deviceObj) {
      console.log(JSON.stringify(deviceObj));
      this.$router.push(`deviceInfo?id=${deviceObj.id}`);
    },

    /*
    删除设备
    deviceObj  设备对象
    */
    deleteClick(deviceObj) {
      this.$confirm("确定要删除此设备么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
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
                type: res.code == 200?"success":'warning',
                message: res.message
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },

    //设备选择
    handleSelectionChange(val){
      console.log(JSON.stringify(val));
      this.multipleSelection = val;
        if(val.length){
          this.bottomSeleDis = false;
          this.bottomSeleChecked = true;
        }else{
          this.bottomSeleDis = true;
          this.bottomSeleChecked = false;
        }
    },

    /*
    批量操作设备
    type 1:删除  2:禁用  3:启用
    */
    batchOperate(type){
      if(type == 1){
        this.getDeviceList();
      }else{
        this.getDeviceList();
      }
    },

    /*
    底部选择框点击变化
    res  更新后的值
    */
    bottomSeleChange(res){
      if(!res){
        this.$refs.multipleTable.clearSelection();
      }
    },

    /*
    新建设备窗口关闭
    updata  是否更新数据
    */
    newDeviceClose(updata) {
      this.showNewDevice = false;
      if (updata) {
        this.getDeviceList();
      }
    },

    //列表翻页
    handleCurrentChange() {
      this.getDeviceList();
    }

  }
};
</script>

<style lang="scss" scoped>
.deviceStatusView{
  display: inline-block;
  width: 60px;
  div{
    display: inline-block;
    width: 8px;
    height: 8px;
    background: pink;
    border-radius: 4px;
    margin-right: 4px;
  }
}

.bottomSeleView{
  position: absolute;
  top: 30px;
  left: 10px;
}

</style>
