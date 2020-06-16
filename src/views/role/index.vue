<template>
  <div id="role">
    <svg-icon
      v-if="activeIndex == 2"
      icon-class="pre"
      class="pre-icon"
      @click="switchCon(0)"
    ></svg-icon>
    <list
      v-if="activeIndex == 0 || activeIndex == 1 || activeIndex == 3"
    ></list>
    <edit-role
      v-if="activeIndex == 1 || activeIndex == 3"
      :info="selectRow"
    ></edit-role>
    <role-auth v-if="activeIndex == 2"></role-auth>
  </div>
</template>

<script>
import list from "./children/list";
import editRole from "./children/editRole";
import roleAuth from "./children/editRoleAuth";
export default {
  components: { list, editRole, roleAuth },
  data() {
    return {
      activeIndex: 0,
      selectRow: null
    };
  },
  methods: {
    switchCon(key, row) {
      if (row) {
        this.selectRow = row;
      } else {
        this.selectRow = null;
      }
      this.activeIndex = key;
    }
  }
};
</script>

<style lang="scss" scoped>
#role {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
