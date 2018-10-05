<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="columns is-gapless">
        <div class="column col1">
          <div class="content">
            <h1 class="title is-3">Dinosaurs</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </div>
        <div class="column col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
          <div class="content">
            <form @submit.prevent v-if="showLoginForm">
              <h1 class="title is-3">Welcome Back</h1>
              <label for="email1">Email</label>
              <input
                type="text"
                placeholder="you@email.com"
                id="email1"
                autocomplete="email"
                v-model.trim="loginForm.email">

              <label for="password1">Password</label>
              <input
                type="password"
                id="password1"
                autocomplete="current-password"
                v-model.trim="loginForm.password">

              <button @click="login" class="button">Log In</button>

              <div class="extras">
                <a @click="togglePasswordReset">Forgot Password</a>
                <a @click="toggleForm">Create an Account</a>
              </div>
            </form>

            <form @submit.prevent v-if="!showLoginForm && !showForgotPassword">
              <h1 class="title is-3">Get Started</h1>

              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                v-model.trim="signupForm.name"
                autocomplete="name">

              <label for="email2">Email</label>
              <input
                type="text"
                id="email2"
                v-model.trim="signupForm.email"
                autocomplete="email">

              <label for="password2">Password</label>
              <input
                type="password"
                id="password2"
                v-model.trim="signupForm.password"
                autocomplete="new-password">

              <button @click="signup" class="button">Sign Up</button>

              <div class="extras">
                <a @click="toggleForm">Back to Log In</a>
              </div>
            </form>

            <form @submit.prevent v-if="showForgotPassword" class="password-reset">
              <div v-if="!passwordResetSuccess">
                <h1 class="title is-3">Reset Password</h1>
                <p>We will send you an email to reset your password</p>

                <label for="email3">Email</label>
                <input
                  type="text"
                  placeholder="you@email.com"
                  id="email3"
                  v-model.trim="passwordForm.email"
                  autocomplete="current-email">

                <button @click="resetPassword" class="button">Submit</button>

                <div class="extras">
                  <a @click="togglePasswordReset">Back to Log In</a>
                </div>
              </div>
              <div v-else>
                <h1>Email Sent</h1>
                <p>Check your email for a link to reset your password</p>
                <button @click="togglePasswordReset" class="button">Back to Log In</button>
              </div>
            </form>

            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebaseConfig.js')

export default {
  data () {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        email: '',
        password: ''
      },
      passwordForm: {
        email: ''
      },
      showLoginForm: true,
      performingRequest: false,
      showForgotPassword: false,
      passwordResetSuccess: false,
      errorMsg: ''
    }
  },
  methods: {
    toggleForm () {
      this.errorMsg = ''
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset () {
      if (this.showForgotPassword) {
        this.showLoginForm = true
        this.showForgotPassword = false
        this.passwordResetSuccess = false
      } else {
        this.showLoginForm = false
        this.showForgotPassword = true
      }
    },
    login () {
      this.performingRequest = true

      fb.auth.signInWithEmailAndPassword(
        this.loginForm.email,
        this.loginForm.password
      ).then(user => {
        this.$store.commit('setCurrentUser', user.user)
        this.$store.dispatch('fetchUserProfile')
        this.performingRequest = false
        this.$router.push('/dash')
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    },
    signup () {
      this.performingRequest = true

      fb.auth.createUserWithEmailAndPassword(
        this.signupForm.email,
        this.signupForm.password
      ).then(user => {
        this.$store.commit('setCurrentUser', user.user)
        fb.usersCollection.doc(user.user.uid).set({
          name: this.signupForm.name,
          avatar: `https://api.adorable.io/avatars/300/${user.user.uid}@adorable.io.png`,
          email: this.signupForm.email,
          createdAt: fb.timestamp,
          updatedAt: fb.timestamp
        }).then(() => {
          this.$store.dispatch('fetchUserProfile')
          this.performingRequest = false
          this.$router.push('/dash')
        }).catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    },
    resetPassword () {
      this.performingRequest = true

      fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
        this.performingRequest = false
        this.passwordResetSuccess = true
        this.passwordForm.email = ''
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/_variables.scss';

#login {
  background: linear-gradient(to right, $primary 0%, $primary 50%, $white 50%, $white 100%);
  @media screen and (max-width: 742px) {
    height: 100vh;
    background: $white;
  }

  .columns {
    height: 100vh;
    padding-top: 30vh;

    @media screen and (max-width: 742px) {
      height: auto;
      padding-top: 20vh;
    }
  }

  .col1 {
    color: $white;
    @media screen and (max-width: 742px) {
      display: none;
    }

    p {
      max-width: 490px;
      margin-top: 2rem;
      line-height: 1.8;
    }

    a {
      color: $white;
      text-decoration: underline;
    }
  }

  .signup-form {
    padding-top: 20vh;

    @media screen and (max-width: 742px) {
      padding-top: 10vh;
    }
  }

  .col2 {
    h1 {
      margin-bottom: 2rem;
    }
    form {
      max-width: 450px;
      margin: 0 auto;
    }
    .extras {
      float: right;
      text-align: right;
      a {
        display: block;
        margin-bottom: 0.5rem;
      }
    }

    .password-reset {
      h1 {
        margin-bottom: 1rem;
      }
      p {
        margin-bottom: 2rem;
      }
    }
  }
  .content {
    max-width: 90%;
    margin: 0 auto;
  }
}
</style>
