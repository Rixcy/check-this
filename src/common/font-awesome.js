import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPencilAlt,
  faCircle,
  faTimes,
  faReply,
  faHeart,
  faLock,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faUserCircle,
  faAtlas
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faPencilAlt,
  faCircle,
  faTimes,
  faReply,
  faHeart,
  faLock,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faUserCircle,
  faAtlas
)
Vue.component('font-awesome-icon', FontAwesomeIcon)
