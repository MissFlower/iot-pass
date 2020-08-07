<template>
  <div>
    <div class="mt20 f14">基础通信Topic</div>
    <row-table :basicsData="basicsData" />
  </div>
</template>

<script>
import rowTable from './rowTable'
export default {
  components: {
    rowTable
  },
  props: {
    basicsData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>
