<template>
  <div id="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <div class="con">
      <div class="f14 p20">资源概览</div>
      <div class="t_con df ai_c jc_sb">
        <div class="t_item" v-for="(item, index) in topArr" :key="index">
          <div class="text">
            <span>{{ item.text }}</span>
            <svg-icon icon-class="arrow" class="blue ml5"></svg-icon>
          </div>
          <div class="sub">{{ item.sub ? item.sub : " " }}</div>
          <div class="f24">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="con mt20 p20">
      <div class="f14">开始接入物联网设备</div>
      <div class="m_con df">
        <div v-for="(item, index) in mArr" :key="index" class="m_item" @click="goToPath(item)">
          <div class="text">
            <span>{{ item.name }}</span>
            <svg-icon icon-class="arrow" class="blue ml5"></svg-icon>
          </div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      topArr: [
        {
          text: "当月设备消息量",
          sub: "product按计费逻辑统计)",
          value: 0
        },
        {
          text: "当月设备消息量",
          sub: "(按计费逻辑统计)",
          value: 0
        },
        {
          text: "当月设备消息量",
          sub: "(按计费逻辑统计)",
          value: 0
        },
        {
          text: "当月设备消息量",
          value: 0
        },
        {
          text: "当月设备消息量",
          value: 0
        },
        {
          text: "当月设备消息量",
          value: 0
        }
      ],
      mArr: [
        {
          name: "创建产品",
          desc: "创建并定义产品功能 （设备模型）",
          path: "/product/add-product"
        },
        {
          name: "添加设备",
          desc: "创建并定义产品功能 （设备模型）",
          path: "/device/deviceManage"
        },
        {
          name: "设备烧录与激活",
          desc: "下载SDK并烧入设备证书至设备",
          path: ""
        }
      ]
    };
  },
  methods: {
    goToPath (item) {
      if (item.path) {
        this.$router.push(item.path)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #fafafa;
  .con {
    background: #fff;
    width: 100%;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
    padding-bottom: 20px;
    // padding: 20px;
    .svg-icon {
      display: none;
    }
    .t_con {
      .t_item {
        padding: 10px 20px;
        position: relative;
        flex: 1;
        // border: 1px solid transparent;
        .text {
          font-size: 13px;
          color: #666;
          line-height: 18px;
        }
        .sub {
          font-size: 12px;
          color: #888;
          line-height: 14px;
          margin-bottom: 10px;
          height: 14px;
        }
      }
      .t_item:not(:first-child):before {
        content: "";
        width: 1px;
        height: 52px;
        background: #e7ebf0;
        position: absolute;
        top: 15px;
        left: 0;
        display: inline-block;
      }
      .t_item:hover {
        box-shadow: 0 2px 6px 0 hsla(0, 0%, 65.1%, 0.5);
        &.t_item:before {
          display: none;
        }
        .text {
          font-weight: 600;
        }
        .svg-icon {
          display: inline;
        }
      }
      .t_item:hover + .t_item:before {
        display: none;
      }
    }
    .m_con {
      margin-top: 20px;
      border: 1px solid #e7ebf0;
      margin-right: 50%;
      .m_item {
        flex: 1;
        .text {
          font-size: 14px;
          color: #4c4c4c;
          padding: 12px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          border-bottom: 1px dashed rgba(255, 106, 0, 0.3);
        }
        .desc {
          padding: 8px 12px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 18px;
        }
      }
      .m_item:hover {
        box-shadow: 0 2px 6px 2px rgba(255, 106, 0, 0.3);
        z-index: 10;
        cursor: pointer;
        .text {
          border-bottom: 2px solid #ff6a00 !important;
        }
        .svg-icon {
          display: inline;
        }
      }
    }
  }
}
</style>
