<template>
  <div>
    <div class="mt20 f14">物模型通信Topic</div>
    <row-table :basicsData="modelData" />
  </div>
</template>

<script>
import rowTable from './rowTable'
export default {
  components: {
    rowTable
  },
  props: {
    modelData: {
      type: Array,
      default: () => []
    }
  }
}
</script>
