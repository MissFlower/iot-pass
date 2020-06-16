<template>
  <div id="addProduct">
    <div class="f20 b">
      <i class="el-icon-back" @click="handle"></i>
      创建产品
    </div>
    <el-form :model="addItem">
      <el-form-item label="产品名称">
        <el-input
          v-model="addItem.productName"
          placeholder="请输入您的产品名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">所属品类</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      addItem: {
        productName: ""
      }
    };
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
