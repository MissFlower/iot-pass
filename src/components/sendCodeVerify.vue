<template>
  <el-dialog id="sedCodeVerify" title="发送验证" :visible.sync="dialogVisible" width="400px" @close="close">
    <div v-loading="loading" class="df">
      <el-input v-model="formData.code" placeholder="输入验证码" class="w200 mr20"></el-input>
      <img :src="pic">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getCodeImg} from "@/api"
export default {
  data () {
    return {
      dialogVisible: true,
      loading: false,
      formData: {
        code: '',
        uuid: ''
      },
      pic: ''
    }
  },
  mounted () {
    this.getImg()
  },
  methods: {
    getImg () {
      this.loading = true
      getCodeImg().then(res => {
        if (res.code === 200) {
          this.formData.uuid = res.data.uuid
          this.pic = res.data.pic
        }
        this.loading = false
      })
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
    },
    submit () {
      if (this.$fun.trim(this.formData.code) === '') {
        this.$message.warning('请输入图片中验证码')
        return
      }
      this.$emit('success', this.formData)
    }
  }
}
</script>

<style lang="scss" scoped>
#sedCodeVerify {
  img {
    height: 32px;
  }
}
</style>