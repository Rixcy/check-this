<template>
  <section id="settings">
    <div class="col1">
      <h3>Settings</h3>
      <p>Update your profile</p>

      <transition name="fade">
        <p v-if="showSuccess" class="success">Profile updated</p>
      </transition>

      <form @submit.prevent>
        <label for="title">Title</label>
        <input
          type="text"
          :placeholder="userProfile.title"
          id="title"
          v-model.trim="title"
          autocomplete="off">

        <label for="name">Name</label>
        <input
          type="text"
          :placeholder="userProfile.name"
          id="name"
          v-model.trim="name"
          autocomplete="off">

        <button @click="updateProfile" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      name: '',
      title: '',
      showSuccess: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile () {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title
      })

      this.name = ''
      this.title = ''

      this.showSuccess = true

      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    }
  }
}
</script>
