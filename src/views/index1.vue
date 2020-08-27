<!--
  文件作者：mawenjuan
  创建日期：2020.8.25
  文件说明：新首页
 -->
<template>
  <div id="index">
    <header-iot></header-iot>
    <main>
      <div class="top_con">
        <div class="con">
        </div>
      </div>
      <div class="main">
        <div class="main_title">
          <div>产品优势</div>
          <div class="f16 c9 mt20">PRODUCT ADVANTAGES</div>
        </div>
        <div class="advantages df">
          <div v-for="(item, index) in advantagesArr" :key="index" class="adv_item">
            <svg-icon :icon-class="item.icon" width="105px" height="120px"></svg-icon>
            <div class="adv_title">{{ item.title }}</div>
            <div class="adv_info">{{ item.info }}</div>
            <div class="adv_mask"></div>
          </div>
        </div>
        <div class="main_title">
          <div>产品功能</div>
          <div class="f16 c9 mt20">PRODUCT FEATURES</div>
        </div>
        <div class="features">
          <div v-for="(item, index) in featuresArr" :key="index" class="fea_item" :class="item.class">
            <template v-if="item.type == 'info'">
              <div v-for="(info, i_index) in item.infos" :key="`i${i_index}`" :style="{width: info.width ? info.width : '100%'}" class="fea_info">
                <div class="fea_item_title">{{ info.title }}</div>
                <div class="fea_item_info" v-for="(text, t_index) in info.texts" :key="`t${t_index}`">{{ text }}</div>
              </div>
            </template>
            <template v-if="item.type == 'img'">
              <div class="fea_img">
                <img :src="item.url">
              </div>
            </template>
          </div>
        </div>
        <div class="main_title">
          <div>典型场景</div>
          <div class="f16 c9 mt20">TYPICAL SCENE</div>
        </div>
        <div class="scene">
          <div class="df jc_c scene_tabs">
            <div v-for="(item, index) in sceneArr" :key="index" class="tc scene_tab_item hand" :class="activeScene.value == item.value ? 'active' : ''" @click.stop="setActiveScene(item)">
              <svg-icon :icon-class="item.icon" width="37px" height="48px"></svg-icon>
              <div class="scene_tab_title">{{ item.title }}</div>
            </div>
          </div>
          <div class="sce_info">{{ activeScene.info }}</div>
          <div class="sce_img">
            <img :src="activeScene.url">
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import headerIot from '@/components/header_i'
export default {
  components: { headerIot },
  data() {
    return {
      // con: '立足中国，服务全球，致力于高效、便捷地联结生活的每一个角落，支持您的物联网项目快速落地。这里提供设备接入、管理、监控、运维，数据存储、隔离、流转、分析等全场景、一站式解决方案。本平台安全可信、支持高并发，性价比高，助力合作伙伴快速、低成本订制专属的物联网服务。',
      advantagesArr: [
        {
          bg_img: '',
          icon: 'auth',
          title: '安全可靠',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }, {
          bg_img: '',
          icon: 'auth',
          title: '接入简单 管理方便',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }, {
          bg_img: '',
          icon: 'auth',
          title: '业务规模灵活扩展',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }, {
          bg_img: '',
          icon: 'auth',
          title: '坚实耐用',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }, {
          bg_img: '',
          icon: 'auth',
          title: '可视化管理',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }, {
          bg_img: '',
          icon: 'auth',
          title: '全天候运维',
          info: '提供支持多种协议和网络类型的接入SDK，设备的调试、配置、控制、升级操作均可远程实现。'
        }
      ],
      featuresArr: [
        {
          type: 'info',
          class: 'pr50',
          infos: [{
            title: '设备接入',
            texts: ['支持多网络、多协议、多开发语言的设备快速接入；', '支持的网络类型包括：以太网、LoRaWAN、WiFi、蜂窝网络，覆盖主流模组的网络通信方式；', '支持的协议包括：MQTT、HTTP等，既能保障设备使用短连接降低功耗，也能保障设备使用长连接保证通信实时性；', '设备端SDK支持的语言包括：C、Android、Node.js等，方便开发者依自身情况选用；']
          }]
        }, {
          type: 'img',
          url: 'https://img.alicdn.com/tfs/TB1Iegaw7T2gK0jSZPcXXcKkpXa-1160-640.jpg'
        }, {
          type: 'img',
          url: 'https://img.alicdn.com/tfs/TB1Iegaw7T2gK0jSZPcXXcKkpXa-1160-640.jpg'
        }, {
          type: 'info',
          class: 'pl50',
          infos: [{
            title: '设备接入',
            texts: ['提供设备生命周期管理和数字化建模能力']
          }, {
            title: '设备认证',
            texts: ['提供一机一密、一型一密等设备认证机制，降低设备被攻破的安全风险；']
          }, {
            title: '生命周期管理',
            texts: ['提供设备生命周期的管理，可以创建、删除、禁用、启用设备；']
          }, {
            title: '状态管理',
            texts: ['提供设备上/下线变更通知和主动查询接口，可以实时获取设备最新状态；']
          }, {
            title: '权限管控',
            texts: ['严格控制设备和用户的权限范围，任何操作都需要做权限校验，防范数据泄露与被篡改风险；']
          }]
        }, {
          type: 'info',
          class: 'ai_b pr50',
          infos: [{
            title: '监控运维',
            texts: ['提供设备实时监控和远程运维能力']
          }, {
            title: '实时监控',
            texts: ['支持大盘监控和报警配置，可以实时感知业务异常变化'],
            width: '50%'
          }, {
            title: '在线调试',
            texts: ['支持远程调试真实设备，模拟指令下发，并可以通过虚拟设备模拟数据上报'],
            width: '50%'
          }, {
            title: '日志服务',
            texts: ['设备和平台的全链路日志记录，支持通过关键字、时间范围等维度快速检索相关日志'],
            width: '50%'
          }, {
            title: '固件升级',
            texts: ['支持设备固件远程升级，升级类型可配置整包或差分类型，升级策略可配置动态或静态策略，升级范围配置全部、定向、区域或灰度范围；'],
            width: '50%'
          }]
        }, {
          type: 'img',
          url: 'https://img.alicdn.com/tfs/TB1Iegaw7T2gK0jSZPcXXcKkpXa-1160-640.jpg'
        }
      ],
      sceneArr: [
        {
          value: 'battery',
          title: '共享充电宝',
          icon: 'auth',
          info: '降低传统硬件智能组网的门槛、支持接入设备快速增加；支持海量通信高并发，降低弹出电池指令的下发延时；实时采集、清洗、分析设备数据，为设备平稳运行保驾护航；机柜显示屏仅在有受众时播放广告，每个机柜推送个性化广告，实现广告屏的精细化运营；',
          url: 'https://img.alicdn.com/tfs/TB1.ErIPhD1gK0jSZFsXXbldVXa-1531-1141.png'
        }
      ],
      activeScene: {}
    }
  },
  mounted() {
    this.activeScene = this.sceneArr[0]
  },
  methods: {
    setActiveScene(item) {
      this.activeScene = item
    }
  }
}
</script>

<style lang="scss" scoped>
#index {
  position: relative;
  width: 100%;
  height: 100%;
  .pl50 {
    padding-left: 50px;
  }
  .pr50 {
    padding-right: 50px;
  }
  main {
    padding-top: 61px;
    height: 100%;
    overflow: auto;
    .top_con {
      width: 100%;
      height: 560px;
      // background-color: #171F27;
      // background-image: url('../assets/imgs/banner.png');
      .con {
        max-width: 1200px;
        height: 100%;
        margin: 0 auto;
        padding-top: 160px;
        color: #fff;
        .top_con_title {
          font-size: 48px;
          margin-bottom: 47px;
        }
        .top_con_con {
          width: 586px;
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
    .main {
      margin: 0 auto;
      max-width: 1200px;
      // border: salmon 1px solid;
      .main_title {
        text-align: center;
        color: #182028;
        font-size: 32px;
        margin: 46px;
      }
      .advantages {
        flex-wrap: wrap;
        justify-content: space-around;
        .adv_item {
          position: relative;
          width: 392px;
          height: 400px;
          margin-top: 10px;
          background-color: black;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .svg-icon {
            margin-top: 80px;
            transition: all .5s linear;
          }
          .adv_title {
            margin-top: 30px;
            font-size: 24px;
            line-height: 48px;
          }
          .adv_info {
            padding: 0 50px;
            font-size: 16px;
            line-height: 24px;
            text-align: left;
            margin-top: 10px;
            transition: all .5s linear;
            opacity: 0;
          }
          .adv_mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #39AF59;
            opacity: 0;
            transition: opacity .5s linear;
          }
        }
        .adv_item:hover {
          // transition: left .5s, width .5s;
          .svg-icon {
            margin-top: 0px;
          }
          .adv_info {
            opacity: 1;
          }
          .adv_mask {
            opacity: .5;
          }
        }
      }
      .features {
        display: flex;
        flex-wrap: wrap;
        .fea_item {
          width: 600px;
          height: 465px;
          line-height: 30px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .fea_info {
            .fea_item_title {
              color: #434343;
              font-size: 18px;
              font-weight: bold;
            }
            .fea_item_info {
              font-size: 14px;
              color: #656565;
            }
          }
          .fea_img {
            width: 100%;
            height: 100%;
            background-color: #f9f9f9;
            display: flex;
            align-items: center;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
            }
          }
        }
      }
      .scene {
        .scene_tabs {
          overflow: auto;
        }
        .scene_tab_item {
          min-width: 200px;
          padding: 0 20px 20px;
          border-bottom: transparent 4px solid;
          .scene_tab_title {
            font-size: 24px;
            line-height: 30px;
            padding-top: 20px;
          }
        }
        .scene_tab_item.active {
          color: #39AF59;
          border-color: #39AF59;
        }
        .scene_tab_item + .scene_tab_item {
          margin-left: 30px;
        }
        .sce_info {
          margin-top: 46px;
          margin-bottom: 34px;
          color: #656565;
          font-size: 14px;
          line-height: 30px;
        }
        .sce_img {
          width: 100%;
          background-color: #F9F9F9;
          padding: 48px 95px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
