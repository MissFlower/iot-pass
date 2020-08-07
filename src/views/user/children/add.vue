<!--
 * @Description: 用户的编辑、创建页面
 * @Version: 0.1.0
 * @Autor: mawenjuan
 * @Date: 2020-08-04 10:32:25
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-04 15:58:52
-->
<template>
  <div id="editAccount" v-loading="loading">
    <div class="pl20 pb20">{{ editItem.id ? "编辑" : "新建" }}用户</div>
    <el-form ref="form" :model="editItem" label-width="120px" class="mt20" :rules="rules">
      <el-form-item label="账号：" prop="account">
        <el-input v-model="editItem.account" placeholder="请输入用户名" class="w200" />
      </el-form-item>
      <el-form-item v-if="info" label="密码：" prop="password">
        <el-input v-model="editItem.password" placeholder="不输入保持原来的密码" show-password class="w200" />
        <span class="f12 ml20 c6">密码必须由8到14个字符包括大小写字母、数字组成</span>
      </el-form-item>
      <el-form-item v-else label="密码：" prop="passwordAdd">
        <el-input v-model="editItem.password" placeholder="请输入密码" show-password class="w200" />
        <span class="f12 ml20 c6">密码必须由8到14个字符包括大小写字母、数字组成</span>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="editItem.name" placeholder="请输入姓名" class="w200" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="editItem.email" placeholder="请输入邮箱" class="w200" />
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="editItem.phone" placeholder="请输入电话" class="w200" />
      </el-form-item>
      <div class="tc mb20">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { createUser, updateUser } from '@/api/user'
import { phoneValidate } from '@/data/fun'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validatePassword = (value, rule, callback) => {
      if (!this.editItem.password && this.info) {
        callback()
      } else {
        const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])')
        if (
          !pwdRegex.test(this.editItem.password) &&
          this.editItem.password !== ''
        ) {
          callback(new Error('您的密码复杂度太低'))
        } else {
          callback()
        }
      }
    }
    const validatePhone = (rule, value, callback) => {
      const str = phoneValidate(value)
      if (str.length > 0) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      editItem: {
        account: '', //	账号
        password: '', //	密码
        name: '', //	姓名
        email: '', // 邮箱
        phone: '' //	电话
      },
      rules: {
        account: [{ required: true, message: '请输入账号名', trigger: 'blur' }],
        // password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        password: [
          { required: false, validator: validatePassword, trigger: 'blur' },
          {
            min: 8,
            max: 14,
            message: '长度在 8 到 14 个字符',
            trigger: 'blur'
          }
        ],
        passwordAdd: [
          { required: true, validator: validatePassword, trigger: 'blur' },
          {
            min: 8,
            max: 14,
            message: '长度在 8 到 14 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.editItem = {
      account: '', //	账号
      password: '', //	密码
      name: '', //	姓名
      email: '', // 邮箱
      phone: '' //	电话
    }
    if (this.info) {
      // this.editItem = JSON.parse(JSON.stringify(this.info));
      for (const key in this.editItem) {
        this.editItem[key] = this.info[key]
      }
      this.editItem.id = this.info.id
    }
  },
  methods: {
    handleCancel() {
      this.$parent.switchCon(0)
    },
    // 保存函数
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let promise = null
          let str = ''
          if (this.info) {
            promise = updateUser
            str = '编辑'
          } else {
            promise = createUser
            str = '创建'
          }
          promise(this.editItem)
            .then(res => {
              if (res.code === 200) {
                this.$parent.switchCon(0)
              } else {
                this.$message.error(res.message)
              }
              this.loading = false
            })
            .catch(() => {
              this.$message.error(`用户${str}失败`)
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
