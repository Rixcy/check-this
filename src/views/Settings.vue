<template>
  <section id="settings">
    <div class="col1">
      <div class="level">
        <div class="level-left">
          <div class="level-item has-text-centered">
            <h1 class="title is-2">Settings</h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <div class="image is-96x96 is-pulled-right">
              <img class="is-rounded" :src="avatar" />
            </div>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="errorMsg !== ''" class="error-msg">
          <p>{{ errorMsg.message }}</p>
        </div>
      </transition>

      <form @submit.prevent class="settings-form">
        <div class="columns">
          <div class="column">
            <label class="label" for="title">Title</label>
            <input
              type="text"
              id="title"
              :value="title"
              @input="updateProfileData"
              autocomplete="off">
          </div>
          <div class="column is-three-quarters">
            <label class="label" for="name">Name</label>
            <div class="field">
              <p class="control has-icons-right">
                <input
                  type="text"
                  id="name"
                  :value="name"
                  @input="updateProfileData"
                  autocomplete="off">
                <span class="icon is-small is-right" aria-hidden="true">
                  <font-awesome-icon icon="user"></font-awesome-icon>
                </span>
              </p>
            </div>
          </div>
        </div>

        <label class="label" for="email">Auth Email</label>
        <div class="field">
          <p class="control has-icons-right">
            <input
              type="email"
              id="authEmail"
              :value="authEmail"
              @input="updateProfileData"
              autocomplete="off">
              <span class="icon is-small is-right" aria-hidden="true">
                <font-awesome-icon icon="lock"></font-awesome-icon>
              </span>
          </p>
        </div>

        <label class="label" for="email">Email</label>
        <div class="field">
          <p class="control has-icons-right">
            <input
              type="email"
              id="email"
              :value="email"
              @input="updateProfileData"
              autocomplete="off">
            <span class="icon is-small is-right" aria-hidden="true">
              <font-awesome-icon icon="envelope"></font-awesome-icon>
            </span>
          </p>
        </div>

        <label class="label" for="location">Location</label>
        <div class="field">
          <p class="control has-icons-right">
            <input
              type="text"
              id="location"
              :value="location"
              @input="updateProfileData"
              autocomplete="off">
              <span class="icon is-small is-right" aria-hidden="true">
                <font-awesome-icon icon="map-marker-alt"></font-awesome-icon>
              </span>
          </p>
        </div>

        <label class="label" for="website">Website</label>
        <div class="field">
          <p class="control has-icons-right">
            <input
              type="text"
              id="website"
              :value="website"
              @input="updateProfileData"
              autocomplete="off">
              <span class="icon is-small is-right" aria-hidden="true">
                <font-awesome-icon icon="atlas"></font-awesome-icon>
              </span>
          </p>
        </div>

        <div class="field">
          <label class="label" for="avatar">Avatar</label>
          <p class="control has-icons-right">
            <input
              type="text"
              id="avatar"
              :value="avatar"
              @input="updateProfileData"
              autocomplete="off">
              <span class="icon is-small is-right" aria-hidden="true">
                <font-awesome-icon icon="user-circle"></font-awesome-icon>
              </span>
          </p>
        </div>

        <button @click="updateProfile" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  computed: {
    ...mapState(['currentUser']),
    ...mapState({
      title: state => state.userProfile.title,
      name: state => state.userProfile.name,
      authEmail: state => state.currentUser.email,
      email: state => state.userProfile.email,
      location: state => state.userProfile.location,
      website: state => state.userProfile.website,
      avatar: state => state.userProfile.avatar
    })
  },
  data () {
    return {
      errorMsg: '',
      originalAuthEmail: '',
      reAuthForm: {
        password: ''
      }
    }
  },
  methods: {
    updateProfileData (e) {
      this.$store.commit('updateProfileData', {
        type: e.target.id,
        value: e.target.value
      })
    },
    updateProfile () {
      this.$store.dispatch('updateProfile', {
        name: this.name,
        title: this.title,
        avatar: this.avatar,
        location: this.location,
        website: this.website,
        email: this.email
      }).then(() => {
        if (this.authEmail !== this.originalAuthEmail) {
          this.$dialog.prompt({
            message: 'Please enter your current password to re-authenticate',
            inputAttrs: {
              placeholder: 'Enter your password',
              type: 'password',
              autocomplete: 'current-password'
            },
            onConfirm: val => {
              this.reAuthenticate(val).then(() => {
                this.$store.dispatch('updateAuthEmail', this.authEmail).then(() => {
                  this.originalAuthEmail = this.authEmail

                  this.$toast.open({
                    message: 'Profile updated successfully',
                    type: 'is-success'
                  })
                }).catch(err => {
                  console.log(err)
                  this.errorMsg = err
                })
              }).catch(err => {
                console.log(err)
                this.errorMsg = err
              })
            }
          })
        }
      }).catch(err => {
        console.log(err)
        this.errorMsg = err
      })
    },
    reAuthenticate (password) {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.originalAuthEmail, password
      )
      return new Promise((resolve, reject) => {
        this.currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
          .then(() => {
            resolve()
          }).catch(err => {
            reject(err)
          })
      })
    }
  },
  mounted () {
    this.originalAuthEmail = this.$store.state.currentUser.email
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

  .button {
    margin-top: 1rem;
  }

  .control.has-icons-right input {
    padding-right: 2.25em;
  }
}
</style>
