<template>
  <v-app onload="updateDate()">
    <v-navigation-drawer
        v-model="drawer"
        app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            To-do
          </v-list-item-title>
          <v-list-item-subtitle>
            Navigation
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          nav
      >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        color="primary"
        dark
        src="https://images.unsplash.com/photo-1502786129293-79981df4e689?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80"
        height="210px"
        prominent
    >
      <!--      shrink-on-scroll-->
      <template v-slot:img="{ props }">
        <v-img
            v-bind="props"
            gradient="to top right, rgba(0,77,64,.75), rgba(128,222,234,.9)"
        ></v-img>
      </template>
      <!--      gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"-->

      <v-col
          class="pl-0 pr-0"
      >
        <v-row>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

          <v-spacer></v-spacer>

          <v-text-field
              @focus="searchClosed = false"
              @blur="search !== null && search !== '' ? searchClosed = false : searchClosed = true"
              v-model="search"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              filled
              dense
              clearable
              class="expanding-search mt-1"
              :class="{'closed': searchClosed, 'open': !searchClosed}"
          ></v-text-field>

          <v-btn icon>
            <v-progress-circular
                :rotate="270"
                :size="30"
                :width="2"
                :value="progress"
            >

              <div
                  class="text-caption"
                  v-if="remainingTasks !== 0"
              >{{ remainingTasks }}
              </div>
              <v-icon
                  class="text-body-1"
                  v-if="remainingTasks === 0 && numberOfTasks !== 0"
              >mdi-check-bold
              </v-icon>
              <v-icon
                  class="text-body-1"
                  v-if="numberOfTasks === 0"
                  :class="{'grey--text text--darken-1': numberOfTasks === 0}"
                  style="opacity: 0.2"
              >mdi-check-bold
              </v-icon>
            </v-progress-circular>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-row>

        <v-row>
          <v-col>
            <v-row>
              <v-toolbar-title
                  class="text-h4 font-weight-light ml-4"
              >
                Anthony's list
              </v-toolbar-title>
            </v-row>

            <v-row>
              <div
                  class="subtitle-2 font-weight-regular ml-4"
              >
<!--                Tuesday, 2 Feb 1:38:34 PM-->
                {{currentTime}}
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-text-field
              v-model="newTaskTitle"
              @click:append-outer="addTask"
              @keyup.enter="addTask"
              class="pa-4"
              outlined
              placeholder="Add task"
              append-icon="mdi-pencil"
              append-outer-icon="mdi-plus"
              hide-details
              clearable
              dense
              flat
          ></v-text-field>
        </v-row>
      </v-col>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import {db} from './db'

const tasks = db.collection('tasks')

tasks.get().then(querySnapshot => {
  const documents = querySnapshot.docs.map(doc => console.log(doc.data()))
})

export default {
  data: () => ({
    drawer: null,
    items: [
      {title: 'To-do', icon: 'mdi-format-list-checks', to: '/'},
      {title: 'About', icon: 'mdi-information-outline', to: '/about'},
    ],
    right: null,
    searchClosed: true,
    search: null,
    newTaskTitle: ''
  }),
  methods: {
    getTasks() {
      return this.$store.getters.getTasks
    },
    getProgress() {
      let tasks = this.$store.getters.getTasks
      if (tasks !== null) {
        return tasks.length !== 0 ? tasks.filter(t => t.done === true).length / tasks.length * 100 : 0
      } else {
        return 0
      }
    },
    getRemainingTasks() {
      let tasks = this.$store.getters.getTasks
      if (tasks !== null) {
        return tasks.length !== 0 ? tasks.filter(t => t.done === false).length : 0
      } else {
        return 0
      }
    },
    updateDate() {
      this.$store.dispatch('updateDate')
    },
    addTask() {
      let task = {
        id: Date.now(),
        title: this.newTaskTitle,
        done: false
      }
      this.$store.dispatch('addTask', task)
      this.newTaskTitle = '';
    }
  },
  computed: {
    progress() {
      return this.getProgress()
    },
    remainingTasks() {
      return this.getRemainingTasks()
    },
    numberOfTasks() {
      let tasks = this.$store.getters.getTasks
      if (tasks !== null) {
        return tasks.length
      } else {
        return 0
      }
    },
    currentTime() {
      return this.$store.getters.getDate
    }
  }
}
</script>

<style lang="sass">
.v-input.expanding-search
  transition: max-width 300ms

  .v-input__slot
    cursor: pointer !important

    &:before, &:after
      border-color: transparent !important

  &.closed
    max-width: 48px

    .v-input__slot
      background: transparent !important

  &.open
    max-width: 45vw
    margin-right: 20px
</style>