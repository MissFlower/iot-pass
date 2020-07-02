<!-- 
文件作者：mawenjuan
创建日期：2020.6.18
文件说明：菜单部分
 -->

<template>
  <div id="menu">
    <side-bar class="sidebar-container" :list="list"></side-bar>
  </div>
</template>

<script>
import sideBar from "@/components/Sidebar";
export default {
  components: { sideBar },
  data() {
    return {
      list: [
        {
          title: "一级",
          path: "1",
          icon: "ad",
          children: [
            {
              title: "二级1",
              path: "2-1",
              icon: "ad",
              children: [
                {
                  title: "三级级1",
                  path: "2-3-1"
                },
                {
                  title: "三级1",
                  path: "2-3-2"
                }
              ]
            },
            {
              title: "二级2",
              icon: "ad",
              path: "2-2"
            }
          ]
        }
      ]
    };
  },
  computed: {}
};
</script>
