<!--
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备列表
 -->
<template>
  <div v-loading="loading">
    <h2>设备管理</h2>
    <div class="mb20 df ai_c">
      <el-select class="w200" v-model="productSelIndex" placeholder="请选择产品" @change="getDeviceStatistics">
        <el-option
          v-for="(item,index) in productList"
          :key="index"
          :label="item.productName"
          :value="index">
        </el-option>
      </el-select>

      <div class="deviceCountView" v-for="(obj,index) in deviceCountObj" :key="index">
        <div class="df ai_c">
          <span v-if='index!=0' class="dib mr5" :style="{width:'8px', height:'8px', borderRadius:'4px', background: index==1?'#0A59C0':'#1D7F2F'}"></span>
          <span>{{obj.title}}</span>
          <el-popover
            placement="top-start"
            width="160"
            trigger="hover"
            :content="obj.alert">
            <span class="el-icon-question ml2 img" slot="reference"></span>
          </el-popover>
        </div>
        <div class="Count">{{obj.count}}</div>
      </div>
    </div>

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
      <el-button v-if="authArr.indexOf('device_new')>-1" type="primary" @click="toNewDevice">新建设备</el-button>
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
          <el-switch :disabled="authArr.indexOf('device_enable')<0" v-model="device.row.enableBool" @change="deviceEnable([device.row])"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="lookClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button v-if="authArr.indexOf('device_delete')>-1" @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pr">
      <div class="bottomSeleView" v-if="list.length">
        <el-checkbox v-if="authArr.indexOf('device_delete')>-1 || authArr.indexOf('device_enable')>-1" @change="bottomSeleChange" v-model="bottomSeleChecked" :disabled="bottomSeleDis"></el-checkbox>
        <el-popconfirm v-if="authArr.indexOf('device_delete')>-1" :title="'确定要批量删除选中的'+deviceSelection.length+'个设备吗？'" @onConfirm="batchOperate(1)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">删除</el-button>
        </el-popconfirm>
        <el-popconfirm v-if="authArr.indexOf('device_enable')>-1" :title="'确定要批量禁用选中的'+deviceSelection.length+'个设备吗？'" @onConfirm="batchOperate(2)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">禁用</el-button>
        </el-popconfirm>
        <el-popconfirm v-if="authArr.indexOf('device_enable')>-1" :title="'确定要批量启用选中的'+deviceSelection.length+'个设备吗？'" @onConfirm="batchOperate(3)" class="ml10">
          <el-button slot="reference" type="primary" :disabled="bottomSeleDis">启用</el-button>
        </el-popconfirm>
      </div>
      <!-- 分页-->
      <pagination :data="tableData" @pagination="handleCurrentChange" class="tr"/>
    </div>
    <!-- 新建设备 -->
    <newDevice v-if="showNewDevice" :appointProduck="selProduck"></newDevice>
  </div>
</template>

<script>
import newDevice from "./newDevice";
import Pagination from "@/components/Pagination"
import { deviceList, deleteDevice, deviceBatchEnable, productList,deviceStatistics } from "@/api/deviceRequest";
export default {
  components: { newDevice,Pagination },
  data() {
    return {
      list: [],
      deviceCountObj:[
        {title:'设备总数',alert:'当前指定产品的设备总数',count:''},
        {title:'激活设备',alert:'当前已激活的设备总数',count:''},
        {title:'当前在线',alert:'当前在线的设备总数',count:''},
      ],
      tableData: {
        pageCount: 0, //总页数
        total: 0, // 总条数
        pageSize: 10, //一页大小
        pageNum: 0, // 第几页 从0开始
      },
      productSelIndex: 0,
      productList: [{productName:'全部产品'}],
      selProduck: '',
      searchTypeSelect: "1",
      searchInputValue: "",
      fmVersionValue: "",
      showNewDevice: false,
      loading: false,
      deviceSelection: [],
      bottomSeleDis: true,
      bottomSeleChecked: false
    };
  },

  computed: {
    authArr() {
      return this.$store.state.app.functionArr;
    }
  },

  mounted() {
    //获取产品列表
    this.getProductList();
    //获取指定产品设备统计
    this.getDeviceStatistics();

    let productId = this.$route.query.productId;
    if(productId==undefined || !productId.length){
      //获取设备列表
      this.getDeviceList();
    }
  },

  methods: {
    //获取设备列表
    getDeviceList() {
      this.loading = true;

      //获取所选产品
      var productId = '';
      if(this.productSelIndex != 0){
        productId = this.productList[this.productSelIndex].id;
      }

      deviceList({
        deviceName: this.searchTypeSelect == "1" ? this.searchInputValue : "",
        nickName: this.searchTypeSelect == "2" ? this.searchInputValue : "",
        fmVersion: this.fmVersionValue,
        pageNum: this.tableData.pageNum,
        pageSize: this.tableData.pageSize,
        productId
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


    //获取产品列表
    getProductList(){
      let productId = this.$route.query.productId;
      productList({
        pageNum: 1,
        pageSize: 100,
        productName: ''
      })
      .then(res => {
        if (res.code === 200) {
          if (res.data) {
            var list = res.data.data;
            list.unshift({productName:'全部产品'});
            var selIndex = 0;
            if(productId){
              list.map(function(value,index){
                if(value.id == productId){
                  selIndex = index;
                }
              });
            }
            this.productList = list;
            this.productSelIndex = selIndex;

            if(productId){
              this.getDeviceList();
            }
          }
        }
      })
      .catch(() => {
      });
    },


    //获取指定产品设备统计
    getDeviceStatistics(){

      //获取所选产品
      var productId = '';
      if(this.productSelIndex != 0){
        productId = this.productList[this.productSelIndex].id;
      }

      deviceStatistics({
        productId
      })
      .then(res => {
        if (res.code === 200) {
          if (res.data) {
            //设备各种状态数量
            this.deviceCountObj[0].count = res.data.deviceCount;
            this.deviceCountObj[1].count = res.data.activateCount;
            this.deviceCountObj[2].count = res.data.onlineCount;
          }
        }
      })
      .catch(() => {
      });

      //清空设备名称、固件版本筛选条件
      this.searchInputValue = '';
      this.fmVersionValue = '';

      //获取指定产品设备列表
      this.getDeviceList();
    },


    //搜索按钮
    searchBtnTouch() {
      this.getDeviceList();
    },

    /*
    设备启、禁用
    devices  设备对象数组
    batchEnable  批量启用、禁用
    */
    deviceEnable(devices,batchEnable){

      if(this.authArr.indexOf('device_enable')<0) return;

      this.loading = true;

      let ids = devices.map(function(value){
        return value.id;
      });

      deviceBatchEnable({ids: ids, enable: batchEnable})
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
    删除指定设备
    deviceObj  设备对象
    */
    deleteClick(deviceObj) {
      this.$confirm("确定要删除此设备么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteDeviceRequest([deviceObj]);
        })
        .catch(() => {});
    },

    /*
    设备删除请求
    devices  需要删除的设备数组
    */
    deleteDeviceRequest(devices){
      this.loading = true;

      var ids = [];
      devices.map(function(value){
        ids.push(value.id);
      });

      deleteDevice({ids: ids})
        .then(res => {
          if (res.code === 200) {
            //判断是否删除最后一页全部设备
            if(this.tableData.pageNum!=1&&this.tableData.pageNum==this.tableData.pageCount && devices.length==this.tableData.total%this.tableData.pageSize){
              this.tableData.pageNum--;
            }
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
    },

    //设备选择
    handleSelectionChange(val){
      this.deviceSelection = val;
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
        this.deleteDeviceRequest(this.deviceSelection);
      }else{
        let enable = type==2?'1':'0';
        this.deviceEnable(this.deviceSelection,enable);
      }
    },

    /*
    底部选择框点击变化
    res  选择框更新后的值
    */
    bottomSeleChange(res){
      if(!res){
        this.$refs.multipleTable.clearSelection();
      }
    },

    //新建设备
    toNewDevice(){
      this.selProduck = this.productList[this.productSelIndex];
      this.showNewDevice = true;
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

    /*
    查看设备
    deviceObj  设备对象
    */
    lookClick(deviceObj) {
      this.$router.push(`deviceInfo?id=${deviceObj.id}`);
    },

    //列表翻页
    handleCurrentChange() {
      this.getDeviceList();
    }

  }
};
</script>

<style lang="scss" scoped>
.deviceCountView{
  height: 45px;
  margin-left: 100px;
  border-left: 1px solid #ebecec;
  padding-left: 20px;
  font-size: 13px;
  color: #888;
  .Count{
    color: #373d41;
    font-size: 24px;
    margin-top: 5px;
  }
  .img{
    opacity: 0.7;
  }
}

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
