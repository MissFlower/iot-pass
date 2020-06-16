<template>
  <div id="passwordFind" v-loading="loading">
    <div class="con" v-if="flag < 3">
      <div>请输入你需要找回登录密码的账户名</div>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="200px"
        class="mt30"
      >
        <el-form-item label="账户名" prop="account">
          <el-input
            v-model="formData.account"
            placeholder="邮箱/用户名"
            class="w200"
            :disabled="flag == 1"
          ></el-input>
          <router-link to="" class="red f12 ml20">
            忘记登录名，请点此找回登录名
          </router-link>
        </el-form-item>
        <el-form-item label="新密码" v-if="flag" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入新密码"
            class="w200"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" v-if="flag" prop="newpassword">
          <el-input
            v-model="password"
            placeholder="再次输入新密码"
            class="w200"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="mt20"
            :type="flag ? 'primary' : ''"
            @click="handleNext"
          >
            {{ !flag ? "下一步" : "确认" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div else class="con df" v-if="flag == 3">
      <div style="font-size: 50px">
        <svg-icon icon-class="success"></svg-icon>
      </div>
      <div class="ml20">
        <div class="mb20">重置成功，请牢记新的登录密码</div>
        <router-link to="/login" class="red f12">
          重新登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyAccount, updatePassword } from "@/api";
export default {
  data() {
    const validatePaasword = (value, rule, callback) => {
      if (this.password !== this.formData.password) {
        callback(new Error("两次密码输入不同"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      formData: {
        account: "",
        password: ""
      },
      password: "",
      flag: 0,
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        newpassword: [
          { required: true, validator: validatePaasword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleNext() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.flag) {
            this.submit();
          } else {
            this.verifyAccountFun();
          }
        }
      });
    },
    verifyAccountFun() {
      this.loading = true;
      verifyAccount({
        account: this.$fun.trim(this.formData.account)
      }).then(res => {
        if (res.code === 200) {
          this.flag = 1;
        } else {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
    },
    submit() {
      this.loading = true;
      updatePassword(this.formData)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("密码修改成功");
            this.flag = 3;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("密码修改失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#passwordFind {
  position: relative;
  width: 100%;
  height: 100%;
  .con {
    margin: 0 auto;
    padding: 30px 0;
    width: 990px;
    height: auto;
    color: #6c6c6c;
    font-size: 14px;
  }
}
</style>
