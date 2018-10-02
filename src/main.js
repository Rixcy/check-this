import './assets/scss/app.scss'
import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import router from './router'
import { store } from './store.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPencilAlt,
  faCircle,
  faTimes,
  faReply,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const fb = require('./firebaseConfig.js')

library.add(
  faPencilAlt,
  faCircle,
  faTimes,
  faReply,
  faHeart
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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
