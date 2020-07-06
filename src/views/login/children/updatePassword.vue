<!-- 
  文件作者：mawenjuan
  创建日期：2020.6.23
  文件说明：修改密码
 -->

<template>
  <div id="updaPassword" v-loading="loading">
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" class="mt20">
      <el-form-item label="新的登录密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入新密码"
            class="w200"
            show-password
          ></el-input>
          <span class="f12 ml20 c6">密码必须由8到14个字符包括大小写字母、数字组成</span>
        </el-form-item>
        <el-form-item label="确认新的登录密码" prop="newpassword">
          <el-input
            v-model="password"
            placeholder="再次输入新密码"
            class="w200"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="submit">确定</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword, forgetPassword } from "@/api";
export default {
  props: ['flag'],
  data() {
    const validatePassword = (value, rule, callback) => {
      if (this.formData.password === "") {
        callback(new Error("请输入新密码"));
      } else {
        const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])');
        if (!pwdRegex.test(this.formData.password)) {
          callback(new Error("您的密码复杂度太低"));
        } else if(this.password !== "") {
          this.$refs.form.validateField("newpassword");
          callback();
        } else {
          callback();
        }
      }
    };
    const validateNewPaasword = (value, rule, callback) => {
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
      rules: {
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
          {
            min: 8, max: 14, message: '长度在 8 到 14 个字符', trigger: 'blur'
          }
        ],
        newpassword: [
          { required: true, validator: validateNewPaasword, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.app.userInfo
    }
  },
  mounted () {
    this.formData.account = this.userInfo.account
  },
  methods: {
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let promise = updatePassword
          if (this.flag * 1 === 4) {
            promise = forgetPassword
          }
          this.loading = true;
          promise(this.formData)
            .then(res => {
              if (res.code === 200) {
                this.$message.success("密码修改成功");
                // this.$router.push({
                //   name: "success",
                //   params: { id: 3 }
                // })
                this.$cookie.setValue("access_token", res.data)
                this.$router.push(`/success?flag=3`)
              } else {
                this.$message.warning(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.$message.error("密码修改失败");
              this.loading = false
            });
        }
      })
    }
  }
}
</script>