<template>
  <div id="users">
    <section class="section">
      <div class="container">
        <table class="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Website</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, key) in users" :key="key">
              <td>
                <figure class="image is-64x64">
                  <img :src="user.avatar" class="is-rounded">
                </figure>
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.location ? user.location : 'Not specified' }}</td>
              <td>{{ user.website ? user.website : 'Not specified' }}</td>
              <td>{{ user.createdAt | formatDate }}</td>
              <td>{{ user.updatedAt | formatDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data: function () {
    return {}
  },
  computed: {
    ...mapState(['users'])
  },
  methods: {},
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).format('DD/MM/YYYY')
    }
  }
}
</script>
