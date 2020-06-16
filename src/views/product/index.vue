<template>
  <div id="product">
    <product-list v-if="flag == 0"></product-list>
  </div>
</template>

<script>
import productList from "./children/list";
export default {
  components: { productList },
  data() {
    return {
      flag: 0
    };
  }
};
</script>

<style lang="scss" scoped>
#product {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
