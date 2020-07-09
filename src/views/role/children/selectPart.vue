<template>
  <div class="selectPart mb20"  :class="type > 1 ? 'df fww' : ''">
    <div v-for="(item, index) in list" :key="index" class="df selectPartItem">
      <div class="w200 mt5">
        <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
      </div>
      <div class="df selectPartChildren" v-if="item.children"> 
        <select-part :list="item.children" :type="type + 1"></select-part>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectPart",
  props: ['list', 'type']
}
</script>

<style lang="scss" scoped>
.selectPart {
  width: 100%;
  position: relative;
  .selectPartItem {
    position: relative;
    .selectPartChildren {
      width: calc(100% - 200px);
    }
  }
}
</style>