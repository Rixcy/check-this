import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dash'
    },
    {
      name: 'dash',
      path: '/dash',
      component: () => import('./views/Dash')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/Login')
    },
    {
      name: 'settings',
      path: '/settings',
      component: () => import('@/views/Settings')
    }
  ]
})
