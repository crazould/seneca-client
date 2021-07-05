import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'

const firebaseConfig = {
  apiKey: "AIzaSyA572iAGXuYzK5Nuca3lazd-3rvuepElVg",
  authDomain: "seneca-project-management-tool.firebaseapp.com",
  databaseURL: "https://seneca-project-management-tool-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "seneca-project-management-tool",
  storageBucket: "seneca-project-management-tool.appspot.com",
  messagingSenderId: "167806167502",
  appId: "1:167806167502:web:b76e838f8393b1fceb639f",
  measurementId: "G-7DVBH3S1EC"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const database = firebase.database()

window.Database = database
window.SubjectsRef = database.ref("Subjects")

Vue.config.productionTip = false
sync(store, router)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
