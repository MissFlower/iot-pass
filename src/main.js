import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css/normalize.css"; // 样式重置
import "@/assets/css/base.scss";
import "@/assets/css/index.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"; // 默认主题
import "@/permission";
import "@/common";
import DatatypeSelectpart from '@/components/children/dataSelectPart'; // 注册全局组件

import "@/icons"; // icon

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "small"
});
Vue.component('DatatypeSelectpart', DatatypeSelectpart)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
