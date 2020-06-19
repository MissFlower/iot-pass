<!-- 
文件作者：wengyoubin
创建日期：2020.6.17
文件说明：设备管理
 -->
<template>
  <div id="equ">
    <deviceList></deviceList>
  </div>
</template>

<script>
import deviceList from "./children/deviceList";
export default {
  components: { deviceList },
  data() {
    return {
    };
  },
/*

*/ 
  mounted() {
  },

  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
#equ {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
  min-width: 1100px;
}
</style>
