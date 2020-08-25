/*
 * @Description: resize.js 处理resize
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-08-04 13:16:18
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-08-25 11:18:46
 */
import { debounce } from '@/utils'

export default {
  data() {
    return {
      $_sidebarElm: null,
      $_resizeHandler: null
    }
  },
  mounted() {
    this.initListener()
  },
  activated() {
    if (!this.$_resizeHandler) {
      // avoid duplication init
      this.initListener()
    }

    // when keep-alive chart activated, auto resize
    this.resize()
  },
  beforeDestroy() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.$_resizeHandler()
      }
    },
    initListener() {
      this.$_resizeHandler = debounce(() => {
        this.resize()
      }, 100)
      window.addEventListener('resize', this.$_resizeHandler)

      this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    destroyListener() {
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null

      this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    resize() {
      const { echartInstance } = this
      echartInstance && echartInstance.resize()
    }
  }
}
