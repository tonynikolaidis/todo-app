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
        flat
    >

      <template v-slot:img="{ props }">
        <v-img
            v-bind="props"
            gradient="to top right, rgba(0,77,64,.75), rgba(128,222,234,.9)"
        ></v-img>
      </template>

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

          <v-btn
              icon
              @click="setShowCompleted(true)"
          >
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
          <v-menu
              rounded="md"
              offset-y
          >
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon>mdi-sort</v-icon>
              </v-btn>
            </template>

            <v-list class="pb-0">
              <v-list-item
                  dense
                  style="min-height: 30px"
              >
                <v-list-item-subtitle>Sort by</v-list-item-subtitle>
              </v-list-item>

              <v-list-item link @click="$store.commit('sortByDueDate')">
                <v-icon small class="mr-2">
                  mdi-calendar
                </v-icon>
                <v-list-item-title>Due date</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="$store.commit('sortByLabel')">
                <v-icon small class="mr-2">
                  mdi-label
                </v-icon>
                <v-list-item-title>Label</v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>
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
                {{ currentTime }}
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-text-field
              v-model="taskTitleBar"
              @click:append-outer="setForm({show: true, type: 0})"
              @keyup.enter="addTask"
              class="pa-4"
              outlined
              placeholder="Add task"
              append-outer-icon="mdi-plus"
              hide-details
              dense
              flat
          ></v-text-field>
        </v-row>
      </v-col>
    </v-app-bar>

    <v-dialog
        v-model="getForm.show"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
    >
      <v-card tile>
        <v-toolbar
            flat
            color="white"
        >
          <v-btn
              icon
              @click="getTaskToEdit === false ? setForm({show: false, type: null}) : stopEditing()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
              getForm.type === 0 || getForm.type === null ? 'Add task' : 'Edit task'
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
                text
                @click="[getForm.type === 0 || getForm.type === null ? addTask() : editTask(), setForm({show: false, type: null})]"
                color="primary"
                class="text-body-1 text-capitalize"
            >
              {{ getForm.type === 0 || getForm.type === null ? 'Add' : 'Done' }}
            </v-btn>
          </v-toolbar-items>
          <v-menu
              bottom
              right
              offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteTask()"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <div>
            <v-textarea
                v-model="currentTaskTitle"
                @keypress.13.prevent
                auto-grow
                rows="1"
                placeholder="Title"
                hide-details="true"
                class="font-weight-light text-h5 mb-2"
                id="title-input"
                dense
                color="rgb(117, 117, 117)"
            ></v-textarea>
            <v-textarea
                v-model="currentTaskDetails"
                auto-grow
                placeholder="Add details"
                rows="1"
                prepend-icon="mdi-text"
                class="mb-2"
                solo
                flat
                dense
                hide-details="auto"
                color="rgb(117, 117, 117)"
            ></v-textarea>
            <v-dialog
                ref="dateDialog"
                v-model="modal"
                :return-value.sync="currentTaskDueDate"
                persistent
                width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="getFormattedDate"
                    placeholder="Select due date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    hide-details="true"
                    solo
                    flat
                    dense
                    class="mb-2"
                    color="rgb(117, 117, 117)"
                    clearable
                    @click:clear="currentTaskDueTime = null"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-if="modal"
                  v-model="currentTaskDueDate"
                  scrollable
                  no-title
              >
                <!--                style="height: auto"-->
                <v-col>
                  <v-row>
                    <v-dialog
                        ref="timeDialog"
                        v-model="modal2"
                        :return-value.sync="currentTaskDueTime"
                        persistent
                        width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="getFormattedTime"
                            placeholder="Pick a time"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            solo
                            flat
                            dense
                            color="rgb(117, 117, 117)"
                            clearable
                        ></v-text-field>
                      </template>
                      <v-time-picker
                          v-if="modal2"
                          v-model="currentTaskDueTime"
                          format="24hr"
                          full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="modal2 = false"
                            class="text-body-1 text-capitalize text--secondary"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.timeDialog.save(currentTaskDueTime)"
                            class="text-body-1 text-capitalize"
                        >
                          Done
                        </v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="modal = false"
                        class="text-body-1 text-capitalize text--secondary"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dateDialog.save(currentTaskDueDate)"
                        class="text-body-1 text-capitalize"
                    >
                      Done
                    </v-btn>
                  </v-row>
                </v-col>
              </v-date-picker>
            </v-dialog>

            <v-combobox
                v-model="currentTaskLabels"
                :filter="filter"
                :hide-no-data="!labelSearch"
                :items="labels"
                :search-input.sync="labelSearch"
                hide-selected
                hide-details
                label="Select a label"
                multiple
                small-chips
                solo
                flat
                prepend-icon="mdi-label"
                class="mb-2"
                color="rgb(117, 117, 117)"
            >
              <template v-slot:no-data>
                <span class="subheading ml-3">Press <v-icon small>mdi-keyboard-return</v-icon> to create</span>
                <v-chip
                    :color="colors[colorIndex]"
                    text-color="white"
                    class="font-weight-medium ml-3"
                    small
                >
                  {{ labelSearch }}
                </v-chip>
              </template>
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <v-chip
                    v-if="item === Object(item)"
                    v-bind="attrs"
                    :color="item.color"
                    text-color="white"
                    class="font-weight-medium"
                    :input-value="selected"
                    small
                >
          <span class="pr-2">
            {{ item.text }}
          </span>
                  <v-icon
                      small
                      @click="parent.selectItem(item)"
                  >
                    mdi-close-circle
                  </v-icon>
                </v-chip>
              </template>
              <template v-slot:item="{ index, item }">
                <v-text-field
                    v-if="editing === item"
                    v-model="editing.text"
                    autofocus
                    flat
                    background-color="transparent"
                    hide-details
                    solo
                    style="width: 40vw"
                    @keyup.enter="editLabel(index, item)"
                ></v-text-field>
                <v-chip
                    v-else
                    :color="item.color"
                    text-color="white"
                    class="font-weight-medium"
                    small
                >
                  {{ item.text }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-list-item-action @click.stop>
                  <v-col class="pa-0">
                    <v-row>
                      <v-btn
                          class="mr-1"
                          icon
                          @click.stop.prevent="editLabel(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                      </v-btn>
                      <v-btn
                          icon
                          @click.stop.prevent="editing !== item ? removeLabel(index, item) : colorPicker = true"
                      >
                        <v-icon>{{ editing !== item ? 'mdi-delete' : 'mdi-eyedropper-variant' }}</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-list-item-action>
              </template>
            </v-combobox>

<!--            <v-dialog-->
<!--                v-model="colorPicker"-->
<!--                scrollable-->
<!--                max-width="300px"-->
<!--            >-->
<!--              <v-card>-->
<!--                <v-card-title>Select color</v-card-title>-->
<!--                <v-divider></v-divider>-->
<!--                <v-card-text style="height: 300px;">-->
<!--                  <v-list>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="rgb(117, 117, 117)">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Default</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="brown">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Brown</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="orange">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Orange</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="yellow">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Yellow</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="green">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Green</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="blue">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Blue</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="purple">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Purple</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="pink">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Pink</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                    <v-list-item link>-->
<!--                      <v-list-item-icon>-->
<!--                        <v-icon color="red">mdi-circle</v-icon>-->
<!--                      </v-list-item-icon>-->
<!--                      <v-list-item-title>Red</v-list-item-title>-->
<!--                    </v-list-item>-->
<!--                  </v-list>-->
<!--                </v-card-text>-->
<!--                <v-divider></v-divider>-->
<!--                <v-card-actions>-->
<!--                  <v-btn-->
<!--                      color="blue darken-1"-->
<!--                      text-->
<!--                      @click="colorPicker = false"-->
<!--                  >-->
<!--                    Close-->
<!--                  </v-btn>-->
<!--                  <v-btn-->
<!--                      color="blue darken-1"-->
<!--                      text-->
<!--                      @click="colorPicker = false"-->
<!--                  >-->
<!--                    Save-->
<!--                  </v-btn>-->
<!--                </v-card-actions>-->
<!--              </v-card>-->
<!--            </v-dialog>-->

          </div>

        </v-card-text>

        <div style="flex: 1000 0 auto;"></div>
      </v-card>
    </v-dialog>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import {db} from './db'
//
// const tasks = db.collection('tasks')
//
// tasks.get().then(querySnapshot => {
//   const documents = querySnapshot.docs.map(doc => console.log(doc.data()))
// })

import moment from "moment";
import {formatTime as getTime, getFormattedDate as getDate} from "@/store";

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
    newTaskTitle: '',
    details: '',
    date: null,
    time: null,
    modal: false,
    modal2: false,
    activator: null,
    attach: null,
    colorPicker: false,
    colors: ['red', 'light-green', 'deep-purple', 'blue', 'deep-orange', 'green', 'purple', 'indigo', 'pink', 'cyan', 'teal', 'orange'],
    colorIndex: 0,
    editing: null,
    editingIndex: -1,
    labelSearch: null,
    menu: false,
    x: 0,
    y: 0
  }),

  watch: {
    currentTaskLabels(val, prev) {
      if (val.length === prev.length) return

      this.currentTaskLabels = val.map(v => {
        if (typeof v === 'string') {
          if (v === '') {
            return null
          }
          let selectedColor = this.colors[this.colorIndex]
          v = {
            text: v,
            color: selectedColor,
          }

          this.$store.commit('appendToLabels', v)
          if (this.colorIndex === this.colors.length) {
            this.colorIndex = 0
          }
          this.colorIndex++
        }

        localStorage.setItem('labels', JSON.stringify(this.$store.state.labels))

        return v
      })
    },
  },

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
      if (this.currentTaskTitle !== '') {
        this.$store.commit('updateCurrentTaskId', Date.now())
        this.$store.dispatch('addTask')
      }
    },
    editTask() {
      this.$store.commit('editTask')
    },
    deleteTask() {
      if (this.$store.getters.getTaskToEdit === true) {
        this.$store.dispatch('deleteTask', this.$store.state.currentTask.id)
      }
      this.stopEditing()
    },
    formatTime(time) {
      return getTime(time)
    },
    editLabel(index, item) {
      if (!this.editing) {
        this.editing = item
        this.editingIndex = index
      } else {
        this.editing = null
        this.editingIndex = -1
      }
      localStorage.setItem('labels', JSON.stringify(this.$store.state.labels))
    },
    removeLabel(index, item) {
      this.$store.commit('removeLabel', item)

      this.colorIndex++
    },
    filter(item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
    },
    setForm(form) {
      this.$store.dispatch('setForm', form)
    },
    stopEditing() {
      this.$store.commit('stopEditing')

      this.setForm({show: false, type: null})
      this.$store.dispatch('setTaskToEdit', null)
    },
    setShowCompleted(boolean) {
      this.$store.commit('setShowCompleted', boolean)
    },
    selectColor() {

    }
  },

  computed: {
    taskTitleBar: {
      get() {
        let type = this.$store.state.form.type
        return type === 0 || type === null ? this.$store.state.currentTask.title : ''
      },
      set(value) {
        this.$store.commit('updateCurrentTaskTitle', value)
      }
    },
    currentTaskTitle: {
      get() {
        return this.$store.state.currentTask.title
      },
      set(value) {
        this.$store.commit('updateCurrentTaskTitle', value)
      }
    },
    currentTaskDetails: {
      get() {
        return this.$store.state.currentTask.details
      },
      set(value) {
        this.$store.commit('updateCurrentTaskDetails', value)
      }
    },
    currentTaskDueDate: {
      get() {
        return this.$store.state.currentTask.dueDate
      },
      set(value) {
        this.$store.commit('updateCurrentTaskDueDate', value)
      }
    },
    currentTaskDueTime: {
      get() {
        return this.$store.state.currentTask.dueTime
      },
      set(value) {
        this.$store.commit('updateCurrentTaskDueTime', value)
      }
    },
    currentTaskLabels: {
      get() {
        return this.$store.state.currentTask.labels
      },
      set(value) {
        this.$store.commit('updateCurrentTaskLabels', value)
      }
    },
    labels() {
      return this.$store.state.labels
    },
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
    },
    getFormattedTime: {
      get() {
        return this.formatTime(this.currentTaskDueTime)
      },
      set(value) {
        this.$store.commit('updateCurrentTaskDueTime', value)
      }
    },
    getFormattedDate: {
      get() {
        let date = this.$store.state.currentTask.dueDate
        let time = this.$store.state.currentTask.dueTime

        return getDate(date, time)
      },
      set(value) {
        this.$store.commit('updateCurrentTaskDueDate', value)
      }
    },
    getForm() {
      return this.$store.getters.getForm
    },
    getTaskToEdit() {
      return this.$store.getters.getTaskToEdit
    },
    showColorPicker: {
      get() {
        return this.colorPicker
      },
      set(value) {
        this.colorPicker = value
      }
    }
  }
}
</script>

<style lang="sass">
.v-autocomplete__content.v-menu__content
  border-radius: 4px !important

.v-label.theme--light
  color: rgba(0, 0, 0, 0.38) !important

#title-input
  max-height: 100px !important

.v-input__slot:before, :after
  border-color: transparent !important
  border-style: none !important

.v-input.expanding-search
  transition: max-width 300ms

  .v-input__slot
    cursor: pointer !important

    &:before, &:after
      border-color: transparent !important
      border-style: none !important

  &.closed
    max-width: 48px

    .v-input__slot
      background: transparent !important

  &.open
    max-width: calc(100vw - 172px)
    margin-right: 20px

</style>