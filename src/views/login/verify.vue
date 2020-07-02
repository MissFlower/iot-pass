<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.16
  文件说明：身份验证页面
 -->
<template>
  <div id="verify" v-loading="loading">
    <div class="con">
      <el-steps :active="active">
        <el-step title="验证身份" icon="el-icon-edit"></el-step>
        <el-step :title="title" icon="el-icon-upload"></el-step>
        <el-step title="完成" icon="el-icon-picture"></el-step>
      </el-steps>
      <div v-if="active == 1" class="info f14">
        <div class="title pl10">
          账户
          <span class="red">{{ userInfo.account }}</span>
          为确认是你本人操作，请完成一下验证
        </div>
        <el-form ref="form" label-width="120px" class="mt20">
          <el-form-item label="手机号：">
            <div class="dib">{{ phone }}</div>
          </el-form-item>
          <el-form-item label="验证码：">
            <el-input
              v-model="code"
              placeholder="请输入验证码"
              class="w120 mr20"
            ></el-input>
            <el-button @click="getCode">{{ msg }}</el-button>
          </el-form-item>
          <div class="mt20">
            <div class="w120 tr dib"></div>
            <el-button @click="submit">确定</el-button>
          </div>
        </el-form>
      </div>
      <div v-if="active == 2" class="info">
        <email-band v-if="flag == 1"></email-band>
        <phone-band v-if="flag == 2"></phone-band>
        <password-update v-if="flag == 3 || flag == 4" :flag="flag"></password-update>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCode, verifyCode } from "@/api";
import emailBand from "./children/emailBand";
import phoneBand from "./children/phoneBand";
import passwordUpdate from "./children/updatePassword";

export default {
  components: { emailBand, phoneBand, passwordUpdate },
  data() {
    return {
      loading: false,
      active: 1,
      code: "",
      phone: "",
      timerVal: null,
      msg: "获取短信验证码",
      seconds: 0,
      flag: null,
      title: "",
      type: 2,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.app.userInfo
    }
  },
  watch: {
    flag: function() {
      switch(this.flag * 1) {
        case 1:
          this.title = '修改安全邮箱'
          if (this.userInfo.email) {
            this.type = 3
          } else {
            this.type = 2
          }
          break
        case 2:
          this.title = '修改手机号'
          this.type = 5
          break
        case 3:
          this.title = '修改密码'
          this.type = 4
          break
        case 4:
          this.title = '找回密码'
          this.type = 7
          break
      }
    }
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("info")) || this.userInfo) {
      const info = this.userInfo ? this.userInfo : JSON.parse(localStorage.getItem("info"))
      this.phone = info.phone;
      if (this.$route.query.flag) {
        this.flag = this.$route.query.flag
      }
    } else {
      this.$message.warning("没有用户信息，请重新登录")
      this.$router.push('/login')
    }
  },
  methods: {
    getCode() {
      if (this.seconds === 0) {
        this.loading = true;
        sendCode({
          phone: this.phone,
          type: this.type
        }).then(res => {
          if (res.code === 200) {
            this.seconds = 61;
            this.timer();
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        }).catch(() => {
          this.$message.warning('验证码获取失败')
          this.loading = false
        })
      }
      
    },
    timer() {
      if (this.seconds > 1) {
        this.seconds--;
        this.msg = this.seconds + " 秒后，可以重新获取";
        this.timerVal = setTimeout(this.timer, 1000);
      } else {
        this.msg = "重新发送";
        this.seconds = 0;
      }
    },
    submit() {
      if (this.code === "") {
        this.$message.warning("请输入验证码");
        return;
      }
      this.loading = true;
      verifyCode({
        code: this.code,
        phone: this.phone,
        type: this.type
      })
        .then(res => {
          if (res.code === 200) {
            this.submitFun();
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message.warning("验证失败");
          this.loading = false;
        });
    },
    submitFun() {
      if (this.active === 1) {
        this.active++;
        clearTimeout(this.timerVal);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#verify {
  position: relative;
  height: 100%;
  width: 100%;
  .con {
    margin: 50px auto;
    width: 774px;
    height: auto;
    margin-top: 40px;
    .info {
      margin: 30px 80px;
      color: #6c6c6c;
      .title {
        border-bottom: 1px solid #b9b9b9;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
