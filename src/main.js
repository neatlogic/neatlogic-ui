import Vue from 'vue';
import App from './App.vue';
import tsUi from '@component/index.js';
import '../static/index.js';
Vue.config.productionTip = false;
Vue.use(tsUi);
new Vue({
  render: h => h(App)
}).$mount('#app');
