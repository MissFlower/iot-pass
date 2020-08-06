<template>
  <div id="secure">
    <div class="title">
      <h5>安全设置</h5>
    </div>
    <div class="con">
      <div class="info df">
        <div>
          <svg-icon icon-class="photo" />
          <div class="tc blue">修改图像</div>
        </div>
        <div class="userInfo df fd_c jc_sa ml20">
          <div>登录账号：{{ userInfo.account }}</div>
          <div>账号ID：{{ userInfo.id }}</div>
          <div>注册时间： ---</div>
        </div>
      </div>
      <!-- <div class="secure-level ai_c">
        <div>您当前的账号安全程度</div>
        <div class="progress w200">
          <span class="progress-bar  progress-bar-warning" style="width: 66%;"></span>
        </div>
        <div>安全级别：<span class="orange">中</span></div>
        <div>继续努力</div>
      </div> -->
      <div class="set-con">
        <div class="set-con-item df ai_c">
          <div class="name b">登录密码</div>
          <div class="flex1">
            <!-- 安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母，符号或数字且长度超过8位的密码。 -->
          </div>
          <div class="op">
            <svg-icon icon-class="success" class="success" />
            <!-- <span class="ml5 mr20" :class="userInfo.email ? 'success' : 'orange'">{{userInfo.email ? '已' : '未'}}设置</span>
            <span class="blue hand" @click="goToVerify(3)">{{userInfo.email ? '修改' : '设置'}}</span> -->
            <span class="ml5 mr20 success">已设置</span>
            <span class="blue hand" @click="goToVerify(3)">修改</span>
          </div>
        </div>
        <div class="set-con-item df ai_c">
          <div class="name b">手机绑定</div>
          <div class="flex1">
            <div v-if="userInfo.phone">您已绑定了手机 <span class="success">{{ userInfo.phone }}</span> [您的手机为安全手机，可以找回密码，但不能用于登录]</div>
            <div v-else>未设置</div>
          </div>
          <div class="op">
            <svg-icon :icon-class="userInfo.phone ? 'success' : 'warning'" :class="userInfo.phone ? 'success' : 'orange'" />
            <span class="ml5 mr20" :class="userInfo.phone ? 'success' : 'orange'">{{ userInfo.phone ? '已' : '未' }}设置</span>
            <span class="blue hand" @click.stop="goToVerify(2)">{{ userInfo.phone ? '修改' : '设置' }}</span>
          </div>
        </div>
        <div class="set-con-item df ai_c">
          <div class="name b">备用邮箱</div>
          <div class="flex1">
            <div v-if="userInfo.email">您已绑定了邮箱 <span class="success">{{ userInfo.email }}</span> [速绿发送的各类系统、营销、服务通知将发送到您的备用邮箱。]</div>
            <div v-else>未设置</div>
          </div>
          <div class="op">
            <svg-icon :icon-class="userInfo.email ? 'success' : 'warning'" :class="userInfo.email ? 'success' : 'orange'" />
            <span class="ml5 mr20" :class="userInfo.email ? 'success' : 'orange'">{{ userInfo.email ? '已' : '未' }}设置</span>
            <span class="blue hand" @click.stop="goToVerify(1)">{{ userInfo.email ? '修改' : '设置' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.app.userInfo
    }
  },
  mounted() {
    // console.log(this.userInfo)
  },
  methods: {
    // 跳转要验证页面
    goToVerify(value) {
      this.$router.push(`/verify?flag=${value}`)
    }
  }
}
</script>

<style lang="scss" scoped>
#secure {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .title {
    padding: 16px 0px;
    min-height: 70px;
    border-bottom: 1px solid #DDD;
    color: #333;
    h5 {
      display: inline-block;
      text-indent: 8px;
      border-left: 2px solid #88B7E0;
      margin-top: 0px;
      margin-top: 8px;
      margin-bottom: 8px;
      vertical-align: top
    }
  }
  .con {
    .info {
      padding: 10px 0;
      .svg-icon {
        width: 120px;
        height: 120px;
      }
      .userInfo {
        padding: 20px 0;
      }
    }
    .secure-level {
      display: flex;
      padding: 40px 0;
      border-top: 1px solid #e1e6eb;
      .progress {
        height: 20px;
        overflow: hidden;
        background-color: #f5f5f5;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        .progress-bar {
          float: left;
          width: 0;
          height: 100%;
          line-height: 20px;
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
          -webkit-transition: width 0.6s ease;
          transition: width 0.6s ease;
        }
        .progress-bar-warning {
          background-color: #f0ad4e;
        }
      }
      div + div {
        margin-left: 30px;
      }
    }
    .set-con {
      .set-con-item {
        padding: 33px;
        border-top: 1px dashed #e1e6eb;
        .name {
          width: 140px;
        }
      }
    }
  }
}
</style>
