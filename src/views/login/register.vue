<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：账户密码重置
 -->
<template>
  <div id="register" v-loading="loading">
    <div class="register-con df">
      <div class="showImg"></div>
      <div class="form-con">
        <div class="f24 b">注册</div>
        <el-form
          ref="form"
          :model="formData"
          label-width="0"
          :rules="rules"
          class="wp100"
        >
          <el-form-item prop="account">
            <el-input
              v-model="formData.account"
              placeholder="请输出账户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输出密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="formData.phone" placeholder="请输出手机号" />
          </el-form-item>
          <el-form-item prop="code">
            <div class="pr wp100 df ai_c">
              <el-input
                v-model="code"
                placeholder="请输出验证码"
                class="flex1"
              />
              <el-button class="ml10 w100" @click="handleSendCode">
                {{ msg }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="wp100">
          <el-button type="primary" class="wp100" @click="handleSubmit"
            >注册
          </el-button>
          <div class="df f12 c6 jc_sb mt10">
            <!-- <div>忘记密码</div> -->
            <!-- <div class="hand" @click="handleRedister">注册</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register, sendCode, verifyCode } from "@/api";
import { phoneValidate } from "@/data/fun";
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      let str = phoneValidate(value);
      if (str.length > 0) {
        callback(new Error(str));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (this.$fun.trim(this.code) === "") {
        callback(new Error("请输入验证码"));
      } else if (this.$fun.trim(this.code).length !== 6) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    const validatePassword = (value, rule, callback) => {
      if (this.formData.password === "") {
        callback(new Error("请输入密码"));
      } else {
        const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])');
        if (!pwdRegex.test(this.formData.password)) {
          callback(new Error("您的密码复杂度太低（密码中必须包含大小写字母、数字)！"));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      formData: {
        account: "",
        phone: "",
        password: ""
      },
      msg: "发送验证码",
      code: "",
      seconds: 61,
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, validator: validatePassword, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [
          { required: true, validator: validateCode, trigger: "blur" },
          { type: 'number', message: '请输入正确的验证码', trigger: "blur"}
        ]
      }
    };
  },
  mounted() {
    if (this.$cookie.getValue("access_token")) {
      this.$router.push("/index");
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          verifyCode({
            code: this.code,
            phone: this.formData.phone
          })
            .then(res => {
              if (res.code === 200) {
                this.submitFun();
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(() => {
              this.$message.warning("注册失败");
            });
        }
      });
    },
    submitFun() {
      this.loading = true;
      register(this.formData)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("注册成功");
            this.$router.push("/login");
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.warning("注册失败");
        });
    },
    handleRedister() {
      this.$router.push("register");
    },
    handleSendCode() {
      sendCode({
        phone: this.formData.phone
      }).then(res => {
        if (res.code === 200) {
          this.seconds = 61;
          this.timer();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    timer() {
      if (this.seconds > 1) {
        this.seconds--;
        this.msg = this.seconds + " 秒";
        setTimeout(this.timer, 1000);
      } else {
        this.msg = "重新发送";
        this.seconds = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#register {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  // margin: 100px auto;
  .register-con {
    width: 800px;
    margin: 100px auto;
    .showImg {
      width: 380px;
      height: 380px;
      background-image: url("../../assets/imgs/timg.jpeg");
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .form-con {
      width: 400px;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
