import './assets/css/app.scss'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store.js'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './assets/css/prism.css'
import './assets/js/prism.js'
import '@/common/font-awesome'
import '@/common/date.filter'

const fb = require('./firebaseConfig.js')

Vue.config.productionTip = false

Vue.use(Buefy)

let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
