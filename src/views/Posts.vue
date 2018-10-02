<template>
  <div id="posts">
    <section class="section">
      <div class="container">
        <h1 class="title is-2">Posts</h1>
        <transition name="fade">
          <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
            <p>
              Click to show <span class="new-posts">{{ hiddenPosts.length }}</span>
              new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>.
            </p>
          </div>
        </transition>
        <div
          v-if="posts.length"
          class="columns is-multiline">
          <div
            v-for="(post, key) in posts"
            :key="key"
            class="column is-4">
            <div class="box">
              <article class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>{{ post.userName }} - </strong>
                      <small>{{ post.createdAt | formatDate }}</small>
                      <br>
                      {{ post.content }}
                    </p>
                  </div>
                  <nav class="level is-mobile">
                    <div class="level-left">
                      <a class="level-item" aria-label="comment">
                        <span
                          @click="openCommentModal(post)"
                          class="icon is-small"
                          style="margin-right: 5px">
                          <font-awesome-icon icon="reply" aria-hidden="true" />
                          {{ post.comments }}
                        </span>
                      </a>
                      <a class="level-item" aria-label="like">
                        <span
                          @click="likePost(post.id, post.likes)"
                          class="icon is-small"
                          style="margin-right: 5px">
                          <font-awesome-icon icon="heart" aria-hidden="true" />
                          {{ post.likes }}
                        </span>
                      </a>
                      <a class="level-item" aria-label="delete">
                        <span
                          @click="deletePost(post)"
                          class="icon is-small"
                          style="margin-right: 5px">
                          <font-awesome-icon icon="times" aria-hidden="true" />
                        </span>
                      </a>
                    </div>
                  </nav>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
const fb = require('../firebaseConfig.js')

export default {
  data () {
    return {
      post: {
        content: ''
      },
      comment: {
        postId: '',
        userId: '',
        content: '',
        postComments: 0
      },
      showCommentModal: false,
      showPostModal: false,
      fullPost: {},
      postComments: []
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
  },
  methods: {
    createPost () {
      fb.postsCollection.add({
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.post.content,
        userId: this.currentUser.uid,
        userName: this.userProfile.name,
        comments: 0,
        likes: 0
      }).then(ref => {
        this.post.content = ''
      }).catch(err => {
        console.log(err)
      })
    },
    deletePost (post) {
      fb.postsCollection.doc(post.id).delete().then(() => {
        console.log('deleted')
      }).catch(err => {
        console.log(err)
      })
    },
    showNewPosts () {
      let updatedPostsArray = this.hiddenPosts.concat(this.posts)
      // clear hiddenPosts array and update posts array
      this.$store.commit('setHiddenPosts', null)
      this.$store.commit('setPosts', updatedPostsArray)
    },
    openCommentModal (post) {
      this.comment.postId = post.id
      this.comment.userId = post.userId
      this.comment.postComments = post.comments
      this.showCommentModal = true
    },
    closeCommentModal () {
      this.comment.postId = ''
      this.comment.userId = ''
      this.comment.content = ''
      this.showCommentModal = false
    },
    addComment () {
      let postId = this.comment.postId
      let postComments = this.comment.postComments

      fb.commentsCollection.add({
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.comment.content,
        postId: postId,
        userId: this.currentUser.uid,
        userName: this.userProfile.name
      }).then(doc => {
        fb.postsCollection.doc(postId).update({
          comments: postComments + 1
        }).then(() => {
          this.closeCommentModal()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    likePost (postId, postLikes) {
      let docId = `${this.currentUser.uid}_${postId}`

      fb.likesCollection.doc(docId).get().then(doc => {
        if (doc.exists) return
        fb.likesCollection.doc(docId).set({
          postId: postId,
          userId: this.currentUser.uid
        }).then(() => {
          fb.postsCollection.doc(postId).update({
            likes: postLikes + 1
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    viewPost (post) {
      fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
        let commentsArray = []

        docs.forEach(doc => {
          let comment = doc.data()
          comment.id = doc.id
          commentsArray.push(comment)
        })

        this.postComments = commentsArray
        this.fullPost = post
        this.showPostModal = true
      }).catch(err => {
        console.log(err)
      })
    },
    closePostModal () {
      this.postComments = []
      this.showPostModal = false
    }
  },
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength (val) {
      if (val.length < 200) {
        return val
      }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>
