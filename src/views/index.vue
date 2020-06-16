<template>
  <div id="index">
    <div class="main">
      <div class="desc">
        <div class="desc_con">
          <div class="desc_title">物联网平台</div>
          <div class="info">
            阿里云物联网平台提供了一站式的设备接入、设备管理、监控运维、数据流转、数据存储等服务，数据按照实例维度隔离，可根据业务规模灵活提升规格，具备高可用性、高并发、高性价比的特性，是企业设备上云的首选。
          </div>
          <div class="btn_con">
            <span
              class="btn"
              v-for="(row, index) in btnArr"
              :key="index"
              :class="row.class"
              @click.stop="handleGoPath(row.path)"
            >
              {{ row.text }}
            </span>
          </div>
        </div>
        <div class="desc_footer">
          <div class="desc_footer_con df ai_c f14">
            <div>了解更多</div>
            <div class="red">免费试用</div>
            <div class="red">帮助文档</div>
            <div class="red">设备开发指南</div>
          </div>
        </div>
      </div>
      <div class="product">
        <div class="product-con df ai_c jc_sb">
          <div
            class="product_item hand"
            v-for="(item, index) in productArr"
            :key="index"
            @click="handleGo(item)"
          >
            <div class="title">{{ item.name }}</div>
            <div class="pro_desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      <paas-footer></paas-footer>
    </div>
  </div>
</template>

<script>
import paasFooter from "@/components/footer";
export default {
  components: { paasFooter },
  data() {
    return {
      btnArr: [
        {
          text: "立即购买",
          path: "",
          class: "primary"
        },
        {
          text: "管理控制台",
          path: "/home"
        },
        {
          text: "售前咨询",
          path: ""
        }
      ],
      productArr: [
        {
          name: "产品介绍",
          desc: "查看产品介绍文档",
          path: "/introduce/internetOfThings"
        },
        {
          name: "快速入门",
          desc: "快速学会使用产品",
          path: "/introduce/introduction"
        },
        {
          name: "设备端SDK",
          desc: "下载设备端SDK",
          path: "/introduce/equSdk"
        },
        {
          name: "云端SDK",
          desc: "下载云端SDK",
          path: "/introduce/cloudSDK"
        }
      ]
    };
  },
  computed: {
    loginStatus() {
      return this.$store.state.app.loginStatus;
    }
  },
  methods: {
    handleGo(row) {
      // this.$router.push(row.path);
      let url = "//" + location.host + "#" + row.path;
      window.open(url);
    },
    handleGoPath(path) {
      if (path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#index {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .desc {
    width: 100%;
    height: 540px;
    background-color: #1f2325;
    background-image: url("//img.alicdn.com/tfs/TB1XlD6w1T2gK0jSZFvXXXnFXXa-2880-1080.jpg");
    background-size: 1400px;
    background-repeat: no-repeat;
    background-position: 50% 0;
    position: relative;
    color: #fff;
    .desc_con {
      max-width: 1200px;
      position: relative;
      height: 390px;
      margin: 0 auto;
      padding-top: 90px;
      .desc_title {
        font-size: 36px;
        position: relative;
        display: inline-block;
        font-weight: 400;
        vertical-align: middle;
      }
      .info {
        font-size: 14px;
        color: #fff;
        width: 650px;
        line-height: 24px;
        margin-top: 12px;
      }
      .btn_con {
        margin-top: 46px;
        position: relative;
        // z-index: 2;
        .btn {
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          padding: 0 24px;
          margin-right: 12px;
          margin-bottom: 10px;
          border-width: 1px;
          border-radius: 0;
        }
        .btn.primary {
          background-color: #ff6a00;
          border-color: #ff6a00;
        }
        .btn:hover {
          color: #373d41;
          background-color: hsla(0, 0%, 100%, 0.98);
          border-color: #fff;
          text-decoration: none;
        }
        .btn.primary:hover {
          background-color: #ff6a00;
          border-color: #ff6a00;
          color: #fff;
        }
      }
    }
    .desc_footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      background: #373a3d;
      .desc_footer_con {
        max-width: 1200px;
        margin: 0 auto;
        height: 60px;
        div {
          margin-right: 20px;
          cursor: pointer;
        }
        .red {
          color: #ff6a00;
        }
      }
    }
  }
  .product {
    padding-top: 50px;
    padding-bottom: 60px;
    color: #373d41;
    .product-con {
      width: 1200px;
      margin: auto;
      .product_item {
        padding-left: 15px;
        flex: 1;
        .title {
          font-size: 16px;
          font-weight: bolder;
          transition: color 0.3s;
          line-height: 22px;
        }
        .title:hover {
          color: #e65f00;
        }
        .pro_desc {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(55, 61, 65, 0.7);
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .product_item + .product_item {
        border-left: 1px solid rgba(55, 61, 65, 0.3);
      }
    }
  }
}
</style>
