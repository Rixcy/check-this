import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', date => {
  if (!date) return '-'
  return moment(date.toDate()).fromNow()
})
