<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备详情
 -->
<template>
  <div id="addProduct">
    <div class="f20 b">
      <i class="el-icon-back" @click="back"></i>
      设备详情
    </div>
    <el-form :model="addItem">
      <el-form-item label="设备详情">
        <el-input v-model="addItem.productName" placeholder="请输入您的产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">所属品类</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { deviceInfo } from "@/api/equRequest";
export default {
  data() {
    return {
      addItem: {
        productName: ""
      }
    };
  },

  mounted() {
    this.getDeviceInfo();
  },

  methods: {
    //获取设备详情
    getDeviceInfo() {
      // this.$store.dispatch("setLoading", true);
      deviceInfo({
        id: this.$route.query.id
      })
        // .then(res => {
        //   if (res.code === 200) {
        //   }
        //   this.$store.dispatch("setLoading", false);
        // })
        // .catch(() => {
        //   this.$store.dispatch("setLoading", false);
        // });
    },

    //返回
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
#addProduct {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
