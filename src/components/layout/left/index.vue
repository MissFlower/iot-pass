<template>
  <div id="left">
    <collapse />
    <sidebar class="sidebar-container" :list="list" />
  </div>
</template>

<script>
import collapse from './collapse'
import Sidebar from '../Sidebar'

import { dealUserTreeFun } from '@/data/fun'
export default {
  components: { collapse, Sidebar },
  data() {
    return {
      baseList: [
        {
          icon: 'home',
          name: '首页',
          path: '/home'
        }
      ],
      list: []
    }
  },
  computed: {
    menuLists() {
      return this.$store.state.app.menuLists
    }
  },
  watch: {
    menuLists() {
      this.menuListDealFun()
    }
  },
  mounted() {
    this.menuListDealFun()
  },
  methods: {
    menuListDealFun() {
      let arr = []
      this.menuLists.forEach(item => {
        if (!item.path) {
          item.path = '404'
        }
        if (!item.sort) {
          item.sort = 0
        }
        if (arr[item.sort]) {
          arr.splice(item.sort, 0, item)
        } else {
          arr[item.sort] = item
        }
      })
      arr = arr.filter(item => {
        return item
      })
      arr.reverse()
      const list = dealUserTreeFun(arr)
      if (list && list.length > 0 && list[0].children) {
        this.list = this.baseList.concat(list[0].children)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#left {
  border-right: 1px solid #eeeff1;
  // width: 200px;
  position: relative;
  height: 100%;
}
</style>
