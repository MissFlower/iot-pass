<!--
文件作者：liuxixiu
创建日期：2020.6.17
文件说明：固件管理
 -->
<template>
  <div id="firmware">
    <h2>固件升级</h2>
    <el-tabs v-model="activeTag" type="card">
      <el-tab-pane label="固件列表" name="1">
        <fm-list v-if="activeTag == '1'"></fm-list>
      </el-tab-pane>
      <el-tab-pane label="版本分布" name="2">
        <version-list v-if="activeTag == '2'"></version-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import fmList from './children/fmlist'
import versionList from './version'

export default {
  components: {fmList, versionList},
  data() {
    return {
      loading: true,
      activeTag: "1"
    }
  }
};
</script>

<style lang="scss" scoped>
$default: #409eff;
#firmware {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
