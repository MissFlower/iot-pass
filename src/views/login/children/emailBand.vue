<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：邮箱绑定页面
 -->
<template>
  <div id="emailBand" v-loading="loading">
    <el-form
      ref="form"
      :model="formData"
      label-width="120px"
      :rules="rules"
      v-if="flag == 1"
    >
      <el-form-item label="登录名:">
        {{ formData.account }}
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="formData.email" class="w200 mr20"></el-input>
        <el-button @click.stop="handleEmailCode">{{ msg }}</el-button>
        <!-- <div v-if="flag">
          校验码已发送到你的邮箱，15分钟内输入有效，请勿泄露于他人
        </div> -->
      </el-form-item>
      <el-form-item label="验证码:" prop="code">
        <el-input v-model="code" placeholder="6位数字" class="w100"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click.stop="submit">确定</el-button>
      </el-form-item>
    </el-form>
    <div v-if="flag == 2" class="con_success df ai_c">
      <div class="f24 mr20">
        <svg-icon icon-class="success"></svg-icon>
      </div>
      <div>
        <div class="f16 c3">
          修改成功，{{ formData.email }}可作为您的辅助邮箱
        </div>
        <div class="f12 c9">
          该邮箱不能作为登录名使用，仅用于安全校验及必要时的紧急联系
        </div>
        <div class="f12">
          返回 <span class="red" @click="handleGoHome">首页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMailCode, bandEmailFun } from "@/api";
export default {
  data() {
    const validateCode = (value, rules, callback) => {
      if (this.code === "") {
        callback(new Error("验证码不能为空"));
      } else if (this.code.length !== 6) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      flag: 1,
      name: "",
      formData: {
        email: "mawj0103@163.com",
        account: ""
      },
      code: "",
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        code: [{ required: true, validator: validateCode, trigger: "blur" }]
      },
      timerVal: null,
      msg: "获取邮箱验证码",
      seconds: 61
    };
  },
  computed: {
    userName() {
      return this.$store.state.app.userInfo
        ? this.$store.state.app.userInfo.userName
        : null;
    }
  },
  mounted() {
    this.formData.account = this.userName;
  },
  methods: {
    handleEmailCode() {
      const reg = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      const email = this.$fun.trim(this.formData.email);
      if (reg.test(email)) {
        this.loading = true;
        sendMailCode({
          email: this.formData.email
        }).then(res => {
          if (res.code === 200) {
            this.timer();
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        });
      } else {
        alert("邮箱格式不正确");
      }
    },
    timer() {
      if (this.seconds > 1) {
        this.seconds--;
        this.msg = this.seconds + " 秒后，可以重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.msg = "重新获取验证码";
        this.seconds = 0;
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formData.checkCode = this.code;
          this.loading = true;
          bandEmailFun(this.formData).then(res => {
            if (res.code === 200) {
              this.$cookie.setValue("emailStatus", 1);
              this.flag = 2;
            }
            this.loading = false;
          });
        }
      });
    },
    handleGoHome() {
      this.$router.push("/home");
    }
  }
};
</script>

<style lang="scss" scoped>
#emailBand {
  position: relative;
  width: 100%;
  height: 100%;
  .con_success {
    margin: 0 auto;
    padding: 30px 20px;
    width: 990px;
    height: auto;
    border: 1px solid #e1e1ca;
    background: #edfed0;
    position: relative;
    zoom: 1;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
