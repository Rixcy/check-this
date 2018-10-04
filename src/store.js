import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')

    fb.postsCollection.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      let createdByCurrentUser
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges()[0].doc.data().userId
      }

      if (querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
        let post = querySnapshot.docChanges()[0].doc.data()
        post.id = querySnapshot.docChanges()[0].doc.id

        store.commit('setHiddenPosts', post)
      } else {
        let postsArray = []

        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })

        store.commit('setPosts', postsArray)
      }
    })

    fb.notesCollection.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      let createdByCurrentUser
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges()[0].doc.data().userId
      }

      if (querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
        let note = querySnapshot.docChanges()[0].doc.data()
        note.id = querySnapshot.docChanges()[0].doc.id

        store.commit('setHiddenNotes', note)
      } else {
        let notesArray = []

        querySnapshot.forEach(doc => {
          let note = doc.data()
          note.id = doc.id
          notesArray.push(note)
        })

        store.commit('setNotes', notesArray)
      }
    })

    fb.usersCollection.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      let usersArray = []

      querySnapshot.forEach(doc => {
        let usr = doc.data()
        usr.id = doc.id
        usersArray.push(usr)
      })

      store.commit('setUsers', usersArray)
    })

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      let data = doc.data()
      store.commit('setUserProfile', data)
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: [],
    notes: [],
    hiddenNotes: [],
    users: []
  },
  actions: {
    fetchUserProfile ({ commit, state }) {
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        let data = res.data()
        commit('setUserProfile', data)
      }).catch(err => {
        console.log(err)
      })
    },
    clearData ({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setPosts', null)
      commit('setHiddenPosts', null)
      commit('setNotes', null)
      commit('setHiddenNotes', null)
      commit('setUsers', null)
    },
    updateProfile ({ commit, state }, data) {
      let name = data.name ? data.name : null
      let title = data.title ? data.title : null
      let avatar = data.avatar ? data.avatar : null
      let location = data.location ? data.location : null
      let website = data.website ? data.website : null
      let email = data.email ? data.email : null

      fb.usersCollection.doc(state.currentUser.uid).update({
        name: name,
        title: title,
        avatar: avatar,
        location: location,
        website: website,
        email: email
      }).then(user => {
        fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
              userName: name,
              avatar: avatar
            })
          })
        })

        fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
              userName: name,
              avatar: avatar
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateAuthEmail ({ commit, state }, email) {
      return new Promise((resolve, reject) => {
        state.currentUser.updateEmail(email).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setUserProfile (state, val) {
      state.userProfile = val
    },
    setPosts (state, val) {
      state.posts = val
    },
    setHiddenPosts (state, val) {
      if (val) {
        // so we don't add dupes
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val)
        }
      } else {
        state.hiddenPosts = []
      }
    },
    setNotes (state, val) {
      state.notes = val
    },
    setHiddenNotes (state, val) {
      if (val) {
        // so we don't add dupes
        if (!state.hiddenNotes.some(x => x.id === val.id)) {
          state.hiddenNotes.unshift(val)
        }
      } else {
        state.hiddenNotes = []
      }
    },
    setUsers (state, val) {
      state.users = val
    },
    updateProfileData (state, payload) {
      if (payload.type === 'authEmail') {
        state.currentUser.email = payload.value
      } else {
        state.userProfile[`${payload.type}`] = payload.value
      }
    }
  }
})
