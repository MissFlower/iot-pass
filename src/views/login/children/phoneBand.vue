<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.23
  文件说明：手机号绑定
 -->

<template>
  <div id="phoneBand" v-loading="loading">
    <div v-if="flag == 1">
      <div class="df ai_c f12 c6 mb20">
        <i class="el-icon-warning blue f20 mr10"></i>
        我们不会泄露您的手机信息
      </div>
      <el-form ref="form" :model="formData" label-width="200px" :rules="rules">
        <el-form-item label="国家/地区">
          <el-select v-model="formData.area">
            <el-option v-for="(item, key) in areaObj" :key="key" :value="key" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="code" placeholder="请输入手机验证码" class="w200"></el-input>
          <el-button type="text" class="ml10 c9" @click="getCode">{{ msg }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w120" @click="handleSave">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="flag == 2" class="con_success df ai_c">
      <div class="f24 mr20">
        <svg-icon icon-class="success"></svg-icon>
      </div>
      <div>
        <div class="f16 c3">
          修改成功，{{ formData.phone }}可作为您的辅助邮箱
        </div>
        <div class="f12 c9">
          该邮箱不能作为登录名使用，仅用于安全校验及必要时的紧急联系
        </div>
        <div class="f12">
          <!-- 返回 <span class="red" @click="handleGoHome">首页</span> -->
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import phoneAreaObj from "@/data/phone"
import { sendCode, verifyCode } from "@/api";
import { phoneValidate } from "@/data/fun";
import { updateUser } from "@/api/user";
export default {
  data () {
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
    return {
      flag: 1,
      loading: false,
      formData: {
        area: "1",
        phone: ""
      },
      code: "",
      areaObj: phoneAreaObj,
      timerVal: null,
      msg: "点此免费获取",
      seconds: 61,
      rules: {
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [
          { required: true, validator: validateCode, trigger: "blur" },
          { type: 'number', message: '请输入正确的验证码', trigger: "blur"}
        ]
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.app.userInfo
    }
  },
  mounted() {
  },
  methods: {
    getCode() {
      this.$refs.form.validateField("phone", (valid) => {
        if (!valid) {
          this.loading = true;
          sendCode({
            phone: this.formData.phone,
            type: 6
          }).then(res => {
            if (res.code === 200) {
              this.seconds = 61;
              this.timer();
            } else {
              this.$message.error(res.message);
            }
            this.loading = false;
          });
        }
      })
    },
    timer() {
      if (this.seconds > 1) {
        this.seconds--;
        this.msg = `重发(${this.seconds}后)`;
        this.timerVal = setTimeout(this.timer, 1000);
      } else {
        this.msg = "重新获取验证码";
        this.seconds = 0;
      }
    },
    handleSave () {
      this.$refs.form.validate(valid => {
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
            this.loading = false;
          })
          .catch(() => {
            this.$message.warning("验证失败");
            this.loading = false;
          });
      })
    },
    submitFun () {
      const row = {
        id: this.userInfo.id,
        account: this.userInfo.account, //	账号
        name: this.userInfo.name, //	姓名
        email: this.userInfo.email, // 邮箱
        phone: this.formData.phone //	电话
      }
      this.loading = true
      updateUser(row).then(res => {
        if (res.code === 200) {
          this.$store.dispatch("getUserInfo")
          this.$router.push({
            name: "success",
            params: { id: 2 }
          })
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.$message.error("操作失败")
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#phoneBand {
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