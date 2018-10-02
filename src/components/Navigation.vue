<template>
  <header>
    <nav
      class="navbar has-shadow"
      role="navigation"
      aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <router-link class="navbar-item" to="/">
            <h4 class="title is-4">Rixcy</h4>
          </router-link>

          <a
            role="button"
            aria-label="menu"
            aria-expanded="false"
            @click="showNav =! showNav"
            :class="{ 'is-active': showNav, 'navbar-burger': true }">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="{ 'is-active': showNav }">
          <div class="navbar-end">
            <router-link
              to="dash"
              class="navbar-item is-tab"
              exact-active-class="is-active">Dash</router-link>
            <router-link
              to="users"
              class="navbar-item is-tab"
              exact-active-class="is-active">Users</router-link>
            <router-link
              to="settings"
              class="navbar-item is-tab"
              exact-active-class="is-active">Settings</router-link>
            <router-link
              to="posts"
              class="navbar-item is-tab"
              exact-active-class="is-active">Posts</router-link>
            <a class="navbar-item is-tab" @click="logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
  data () {
    return {
      showNav: false
    }
  },
  methods: {
    logout () {
      fb.auth.signOut().then(() => {
        this.$store.dispatch('clearData')
        this.$router.push('/login')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    $route (to, from) {
      this.showNav = false
    }
  }
}
</script>
