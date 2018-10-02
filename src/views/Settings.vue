<template>
  <section id="settings">
    <div class="col1">
      <div class="is-inline-block">
        <h1 class="title is-2">Settings</h1>
        <p>Update your profile</p>

        <transition name="fade">
          <p v-if="showSuccess" class="success">Profile updated</p>
        </transition>
      </div>

      <div class="image is-96x96 is-pulled-right">
        <img class="is-rounded" :src="userProfile.avatar" />
      </div>

      <form @submit.prevent class="settings-form">
        <div class="columns">
          <div class="column">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              v-model.trim="userProfile.title"
              autocomplete="off">
          </div>
          <div class="column is-three-quarters">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              v-model.trim="userProfile.name"
              autocomplete="off">
          </div>
        </div>

        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model.trim="userProfile.email"
          autocomplete="off">

        <label for="location">Location</label>
        <input
          type="text"
          id="location"
          v-model.trim="userProfile.location"
          autocomplete="off">

        <label for="website">Website</label>
        <input
          type="text"
          id="website"
          v-model.trim="userProfile.website"
          autocomplete="off">

        <label for="avatar">Avatar</label>
        <input
          type="text"
          id="avatar"
          v-model.trim="userProfile.avatar"
          autocomplete="off">

        <button @click="updateProfile" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['currentUser', 'userProfile'])
  },
  data () {
    return {
      showSuccess: false
    }
  },
  methods: {
    updateProfile () {
      this.$store.dispatch('updateProfile', {
        name: this.userProfile.name,
        title: this.userProfile.title,
        avatar: this.userProfile.avatar,
        location: this.userProfile.location,
        website: this.userProfile.website
      })

      this.$store.dispatch('updateEmailAddress', {
        email: this.userProfile.email,
        user: this.currentUser
      })

      this.showSuccess = true

      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.settings-form {
  .columns {
    margin-bottom: 0;
    .column {
      padding-bottom: 0;
      padding-top: 0;
    }
  }
}
#settings {
  padding: 2rem 0;

  .col1 {
    max-width: 600px;
    margin: 5vh auto 0;
    background: $white;
    padding: 2rem;
  }

  form {
    margin-top: 3rem;
  }

  .success {
    color: $success;
    margin: 0.5rem 0 -2rem;
  }

  .button {
    margin-top: 1rem;
  }
}
</style>
