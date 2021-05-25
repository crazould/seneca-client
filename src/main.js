import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false

sync(store, router)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
