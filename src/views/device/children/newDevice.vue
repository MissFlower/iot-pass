<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：新建设备
 -->
<template>
  <el-dialog
    title="新建设备"
    :visible.sync="dialogVisible"
    width="500px"
    @close="handleClose"
    v-loading="loading"
  >
    <div class="df ai_c mb20">
      <div class="w100 tr">产品：</div>
      <el-select class="w300" v-model="productSelIndex" placeholder="请选择产品">
        <el-option
          v-for="(item,index) in productList"
          :key="index"
          :label="item.productName"
          :value="index">
        </el-option>
      </el-select>
    </div>
    <div class="df ai_c mb20">
      <div class="w100 tr">设备名称：</div>
      <el-input class="w300" v-model="deviceName" placeholder="请输入设备名称"></el-input>
    </div>
    <div class="df ai_c">
      <div class="w100 tr">备注名称：</div>
      <el-input class="w300" v-model="nickName" placeholder="备注名称"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { productList,createDevice } from "@/api/equRequest";
export default {
  data() {
    return {
      dialogVisible: true,
      productSelIndex: null,
      productList: [],
      deviceName: '',
      nickName: '',
      loading: false
    };
  },
  mounted() {
    this.getProductList();
  },

  methods: {

    //获取产品列表
    getProductList(){
      productList({
        pageNum: 1,
        pageSize: 100,
        productName: ''
      })
      .then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.productList = res.data.data;
          }
        }
      })
      .catch(() => {
      });
    },


    //取消
    handleCancel() {
      this.$parent.newDeviceClose();
    },

    //保存
    handleSave() {

      if(this.productSelIndex == null || this.deviceName.length == 0 || this.nickName.length == 0){
        this.$message({
          message: "内容错误"
        });
        return;
      }

      this.loading = true;
      var productObj = this.productList[this.productSelIndex];
      
      createDevice({
        productId: productObj.id,
        productKey: productObj.productKey,
        deviceName: this.deviceName,
        nickName: this.nickName,
      })
        .then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.$parent.newDeviceClose(true);
          }
          this.$message({
            type: res.code == 200?"success":'warning',
            message: res.message
          });
        })
        .catch(() => {
          this.loading = false;
        });
        
    },

    //窗口关闭
    handleClose() {
      this.handleCancel();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
