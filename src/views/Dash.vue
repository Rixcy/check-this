<template>
  <div id="dash">
    <div class="hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <form @submit.prevent>
            <div class="field">
              <div class="control">
                <textarea
                  v-model.trim="note.content"
                  class="textarea is-medium dash-textarea"
                  type="text"
                  placeholder="Enter some text"
                  @keydown="inputHandler"></textarea>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="container">
      <section class="articles">
        <transition name="fade">
          <div v-if="hiddenNotes.length" @click="showNewNotes" class="card article">
            <div class="card-content text-center">
              Click to show <span class="new-notes">{{ hiddenNotes.length }}</span>
              new <span v-if="hiddenNotes.length > 1">notes</span><span v-else>note</span>.
            </div>
          </div>
        </transition>
        <div v-if="notes.length">
          <div class="card article" v-for="note in notes" :key="note.id">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <p class="image is-64x64">
                    <img
                      class="is-rounded"
                      :src="note.avatar" />
                  </p>
                </div>
                <div class="media-content">
                  <p style="margin-bottom: 15px">
                    {{ note.content }}
                  </p>
                  <div class="level">
                    <div class="tags has-addons level-item is-inline-block">
                      <span class="tag is-rounded is-info">{{ note.userName }}</span>
                      <span class="tag is-rounded">{{ note.createdAt | formatDate }}</span>
                    </div>
                  </div>
                </div>
                <div class="media-right">
                  <span class="is-pulled-right is-inline-block">
                    <a
                      @click="deleteNote(note)"
                      class="delete is-medium"></a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="card article">
            <div class="card-content">
              <div class="content article-body">
                There are currently no notes.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
const fb = require('../firebaseConfig.js')

export default {
  data () {
    return {
      note: {
        content: ''
      },
      showNoteModal: false
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'notes', 'hiddenNotes'])
  },
  methods: {
    inputHandler (e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        this.createNote()
      }
    },
    createNote () {
      fb.notesCollection.add({
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.note.content,
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        avatar: this.userProfile.avatar
      }).then(ref => {
        this.note.content = ''
      }).catch(err => {
        console.log(err)
      })
    },
    deleteNote (note) {
      fb.notesCollection.doc(note.id).delete().then(() => {
        console.log('deleted')
      }).catch(err => {
        console.log(err)
      })
    },
    showNewNotes () {
      let updatedNotesArray = this.hiddenNotes.concat(this.notes)
      // clear hiddenNotes array and update notes array
      this.$store.commit('setHiddenNotes', null)
      this.$store.commit('setNotes', updatedNotesArray)
    }
  },
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).fromNow()
    }
  }
}
</script>

<style lang="scss">
.dash-textarea {
  height: 200px;
  resize: none;
  background: rgba(0,0,0,0.2);
  color: white;
  border-color: rgba(255,255,255,0.2);
  &:hover {
    border-color: black;
  }
  &:active, &:focus {
    border-color: black;
    box-shadow: 0 0 0 0.125em rgba(0,0,0,0.2);
    -webkit-box-shadow: 0 0 0 0.125em rgba(0,0,0,0.2);
  }
}

.hero-body {
  background-image: url(https://images.unsplash.com/photo-1533282960533-51328aa49826?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c6356286e3e03c9ace1c1df4eb7721b4&auto=format&fit=crop&w=1630&q=80);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 300px;
}

.articles {
  margin-top: 1rem;
  .content {
    line-height: 1.9;
    text-align: center;
  }
  .article {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1rem;
  }
}
</style>
