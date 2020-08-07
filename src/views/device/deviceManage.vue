<!--
 * @Description:
 * @Version: 0.1.0
 * @Autor: AiDongYang
 * @Date: 2020-07-29 15:57:06
 * @LastEditors: AiDongYang
 * @LastEditTime: 2020-07-31 17:43:31
-->
<!--
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备管理
 -->
<template>
  <div id="deviceControl">
    <!-- 设备列表 -->
    <deviceList></deviceList>
  </div>
</template>

<script>
import deviceList from './children/deviceList'
export default {
  components: { deviceList },
  data() {
    return {
    }
  },
  /*

*/
  mounted() {
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
#deviceControl {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  min-width: 1100px;
}
</style>
