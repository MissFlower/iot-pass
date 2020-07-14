<template>
  <el-dialog id="sedCodeVerify" title="发送验证" :visible.sync="dialogVisible" width="400px" @close="close">
    <div v-loading="loading" class="df">
      <el-input v-model="formData.code" placeholder="输入验证码" class="w200 mr20"></el-input>
      <div class="icon-con">
        <el-image :src="pic" class="img"></el-image>
        <div class="uploading" @click="getImg">
          <i class="el-icon-refresh-left b f20"></i>
        </div>
      </div>
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
      pic: '',
      seconds: 0
    }
  },
  mounted () {
    this.getImg()
  },
  methods: {
    getImg () {
      if (this.seconds > 0 && this.pic) {
        this.$message.warning('15秒内禁止重复获取')
        return
      } else {
        this.seconds = 16
      }
      this.loading = true
      getCodeImg().then(res => {
        if (res.code === 200) {
          this.formData.uuid = res.data.uuid
          this.pic = res.data.pic
          this.timer()
        }
        this.loading = false
      })
    },
    timer () {
      if (this.seconds > 1) {
        this.seconds--
        setTimeout(this.timer, 1000)
      } else {
        this.seconds = 0
      }
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
  .icon-con {
    .img {
      height: 32px;
    }
    position: relative;
    .uploading {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      text-align: center;
      line-height: 32px;
      background-color: rgba($color: #fff, $alpha: 0.7);
      display: none;
    }
  }
  .icon-con:hover .uploading {
    display: block;
  }
}
</style>