import Vue from 'vue';
import App from './App.vue';
import tsUi from '../dist/techsure-ui.umd.js';
Vue.config.productionTip = false;
Vue.use(tsUi);
new Vue({
  render: h => h(App)
}).$mount('#app');
