<template>
  <header>
    <section>
      <div class="col1">
        <h3><router-link to="dash">Ricko</router-link></h3>
        <ul class="inline">
          <li><router-link to="dash">Dash</router-link></li>
          <li><router-link to="settings">Settings</router-link></li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
  methods: {
    logout: function () {
      fb.auth.signOut().then(() => {
        this.$store.dispatch('clearData')
        this.$router.push('/login')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

</script>
