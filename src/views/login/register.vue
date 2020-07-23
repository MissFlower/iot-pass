<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：账号密码重置
 -->
<template>
  <div id="register" v-loading="loading">
    <div class="login-con df">
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
              placeholder="请输入账号名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="密码必须由8到14个字符包括大小写字母、数字组成"
              show-password
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="code">
            <div class="pr wp100 df ai_c">
              <el-input
                v-model="code"
                placeholder="请输入验证码"
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
    <send-code-verify v-if="verifyFlag" @close="closeVarifyDialog" @success="successVerifyDialog"></send-code-verify>
  </div>
</template>

<script>
import sendCodeVerify from '@/components/sendCodeVerify'
import { register, sendCode, verifyCode } from "@/api";
import { phoneValidate } from "@/data/fun";
export default {
  components: {sendCodeVerify},
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
      seconds: 0,
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
          { min: 8, max: 14, message: '长度在 8 到 14 个字符', trigger: 'blur' }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [
          { required: true, validator: validateCode, trigger: "blur" },
          { type: 'number', message: '请输入正确的验证码', trigger: "blur"}
        ]
      },
      verifyFlag: false
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
            phone: this.formData.phone,
            type: 1
          })
            .then(res => {
              if (res.code === 200) {
                this.submitFun();
              } else {
                this.$message.warning(res.message);
                this.loading = false
              }
            })
            .catch(() => {
              this.$message.warning("注册失败");
              this.loading = false
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
          this.loading = false;
        });
    },
    handleRedister() {
      this.$router.push("register");
    },
    handleSendCode() {
      this.$refs.form.validateField('phone', (valid) => {
        if (valid === '') {
          if (this.seconds === 0) {
            this.verifyFlag = true
          }
        }
      })
    },
    sendCodeFun (data) {
      this.loading = true
      sendCode({
        phone: this.formData.phone,
        type: 1,
        code: data.code,
        uuid: data.uuid
      }).then(res => {
        if (res.code === 200) {
          this.seconds = 61;
          this.timer();
        } else {
          this.$message.error(res.message);
        }
        this.loading = false
      }).catch(() => {
        this.seconds = 0
        this.$message.error('验证码获取失败')
        this.loading = false
      })
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
    },
    // 图片验证码关闭回调
    closeVarifyDialog () {
      this.verifyFlag = false
    },
    // 图片验证码提交的回调
    successVerifyDialog (data) {
      this.closeVarifyDialog()
      if (data) {
        this.sendCodeFun(data)
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
}
</style>
