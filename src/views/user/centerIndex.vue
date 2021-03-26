<!--
  文件作者：mawenjuan
  创建日期：2020.6.21
  文件说明：个人中心
 -->

<template>
  <div id="userCenter">
    <paas-header class="pf" />
    <div class="main df">
      <div class="left f12 mr20">
        <div class="title">账号管理</div>
        <div
          v-for="(item, index) in menu"
          :key="index"
          class="item"
          :class="activeTab == item.path ? 'active' : ''"
          @click="handleSelectTab(item)"
        >{{ item.title }}</div>
      </div>
      <div class="right">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import paasHeader from '@/components/layout/header'
export default {
  components: { paasHeader },
  data() {
    return {
      activeTab: 'secure',
      menu: [
        {
          title: '安全设置',
          path: 'secure'
        },
        {
          title: '基本资料',
          path: 'basicInfo'
        },
        {
          title: '实名认证',
          path: 'authc'
        }
      ]
    }
  },
  watch: {
    $route: function() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const path = this.$route.path
      if (path === '/center') {
        this.$router.push(`${path}/${this.menu[0].path}`)
        this.activeTab = this.menu[0].path
      } else {
        const paths = path.split('/')
        this.activeTab = paths[paths.length - 1]
      }
    },
    handleSelectTab(item) {
      this.$router.push(item.path)
      this.activeTab = item.path
    }
  }
}
</script>

<style lang="scss" scoped>
#userCenter {
  position: relative;
  width: 100%;
  height: 100%;
  .main {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 61px;
    .left {
      position: relative;
      width: 180px;
      height: 100%;
      overflow: auto;
      background-color: rgb(234, 237, 241);
      transition: all 0.2s ease 0s;
      .title {
        font-weight: bold;
        text-indent: 20px;
        width: 180px;
        height: 70px;
        line-height: 70px;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: rgb(217, 222, 228);
        overflow: hidden;
      }
      .item {
        // text-indent: 30px;
        line-height: 40px;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgb(51, 51, 51);
        overflow: hidden;
        padding-left: 30px;
        cursor: pointer;
      }
      .item:hover,
      .item.active {
        background: #fff;
      }
    }
    .right {
      position: relative;
      width: calc(100% - 180px);
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
