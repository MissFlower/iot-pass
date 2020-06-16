<template>
  <div id="editAccount">
    <div class="pl20 pb20">{{ editItem.id ? "编辑" : "新建" }}用户</div>
    <el-form :model="editItem" label-width="60px" class="mt20 w400">
      <el-form-item label="账号">
        <el-input
          v-model="editItem.account"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="editItem.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="editItem.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editItem.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editItem.email" placeholder="请输入电话"></el-input>
      </el-form-item>
      <div class="tr">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      editItem: {
        account: "", //	账号
        password: "", //	密码
        name: "", //	姓名
        email: "", // 邮箱
        phone: "" //	电话
      }
    };
  },
  mounted() {
    if (this.info) {
      this.editItem = JSON.parse(JSON.stringify(this.info));
    }
  },
  methods: {
    handleCancel() {
      this.$parent.switchCon(0);
    },
    handleSave() {
      this.$parent.switchCon(0);
    }
  }
};
</script>

<style lang="scss" scoped>
#editAccount {
}
</style>
