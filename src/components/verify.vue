<template>
  <div id="verify">
    <div class="con">
      <el-steps :active="active">
        <el-step title="验证身份" icon="el-icon-edit"></el-step>
        <el-step title="修改安全邮箱" icon="el-icon-upload"></el-step>
        <el-step title="完成" icon="el-icon-picture"></el-step>
      </el-steps>
      <div v-if="active == 1">
        <div class="info tc f14">
          账户
          <span class="red">{{ userName }}</span>
          为确认是你本人操作，请完成一下验证
        </div>
        <div>
          <div class="w120 tr dib">手机号码：</div>
          <div class="dib">{{ phone }}</div>
        </div>
        <div>
          <div class="w120 tr dib">验证码：</div>
          <el-input
            v-model="code"
            placeholder="请输入验证码"
            class="w100"
          ></el-input>
          <el-button @click="getCode">{{ msg }}</el-button>
        </div>
        <div>
          <div class="w120 tr dib"></div>
          <el-button @click="submit">{{ 确定 }}</el-button>
        </div>
      </div>
      <div v-if="active == 2">
        <el-form :model="formData" label-width="120px">
          <el-form-item label="登录名:">
            {{ formData.name }}
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" class="w200"></el-input>
            <el-button>免费获取验证码</el-button>
          </el-form-item>
          <el-form-item label="验证码:">
            <el-input v-model="formData.code" placeholder="6位数字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCode, verifyCode } from "@/api";
export default {
  data() {
    return {
      active: 1,
      code: "",
      phone: "",
      msg: "获取短信验证码",
      seconds: 61,
      formData: {
        name: "",
        email: "",
        code: ""
      }
    };
  },
  computed: {
    userName() {
      return this.$store.state.app.userInfo
        ? this.$store.state.app.userInfo.userName
        : null;
    }
  },
  getCode() {
    sendCode({
      phone: this.formData.phone
    }).then(res => {
      if (res.code === 200) {
        this.seconds = 61;
        this.timer();
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
  },
  submit() {
    if (this.code === "") {
      this.$message.warning("请输入验证码");
      return;
    }
    this.loading = true;
    verifyCode({
      code: this.code,
      phone: this.phone
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
  },
  submitFun() {
    if (this.active === 1) {
      this.active++;
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
    margin: 0 auto;
    width: 774px;
    height: auto;
    margin-top: 40px;
    .info {
      border: 1px solid #b9b9b9;
      padding-bottom: 2px;
    }
  }
}
</style>
