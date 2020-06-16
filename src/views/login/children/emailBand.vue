<template>
  <div id="emailBand">
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <el-form-item label="登录名:">
        {{ name }}
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="formData.email" class="w200 mr20"></el-input>
        <el-button @click.stop="handleEmailCode">{{ msg }}</el-button>
        <div v-if="flag">
          校验码已发送到你的邮箱，15分钟内输入有效，请勿泄露于他人
        </div>
      </el-form-item>
      <el-form-item label="验证码:" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="6位数字"
          class="w100"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click.stop="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sendMailCode, bandEmailFun } from "@/api";
export default {
  data() {
    return {
      name: "",
      formData: {
        email: "1280397810@qq.com",
        code: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }]
      },
      timerVal: null,
      msg: "获取邮箱验证码",
      seconds: 61,
      flag: false
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
    this.name = this.userName;
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
          console.log(valid);
          bandEmailFun(this.formData).then(res => {
            console.log(res);
          });
        }
      });
    }
  }
};
</script>
