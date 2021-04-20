<template>
  <div>
    <div
        v-if="showAllCaughtUp"
        class="d-flex flex-column justify-center align-center"
        style="height: calc(100vh - 218px)"
    >
      <div>
        <v-icon style="font-size: 175px" color="cyan lighten-5">mdi-check-bold</v-icon>
      </div>
      <div>
        All caught up!
      </div>
    </div>

    <v-list
        class="pt-0"
        flat
    >
      <div
          v-for="task in this.$store.getters.getTasks"
          :key="task.id"
      >
        <v-list-item
            v-if="!task.done"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-checkbox
                  @click="doneTask(task.id)"
                  :input-value="task.done"
                  color="primary"
                  on-icon="mdi-check"
                  off-icon="mdi-checkbox-blank-circle-outline"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content
                @click="[setTaskToEdit(task), setForm({show: true, type: 1})]"
            >
              <v-list-item-title
                  :class="{'text-decoration-line-through' : task.done}"
              >{{ task.title }}
              </v-list-item-title>

              <div>
                <v-chip
                    v-if="task.dueDate"
                    text-color="black"
                    x-small
                    class="mr-1 mt-1">
                  <v-icon left x-small>
                    mdi-calendar
                  </v-icon>
                  {{ getFormattedDate(task) }}
                </v-chip>
                <v-chip
                    v-for="label in task.labels"
                    :color="label.color"
                    text-color="white"
                    x-small
                    class="mr-1 mt-1 font-weight-medium"
                >
                  {{ label.text }}
                </v-chip>
              </div>

            </v-list-item-content>

          </template>
        </v-list-item>
        <!--        <v-divider></v-divider>-->
      </div>
    </v-list>
    <v-bottom-sheet
        v-model="showCompleted"
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
    >
      <v-card
          tile
          style="max-height: calc(100vh - 210px)"
      >
        <v-toolbar
            flat
            color="white"
        >
          <v-btn
              icon
              @click="setShowCompleted(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="max-width: 100vw">Completed tasks</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="ma-0 pa-0">
          <div>
            <v-list
                class="pt-0"
                flat
            >
              <div
                  v-for="task in this.$store.getters.getTasks"
                  :key="task.id"
              >
                <v-list-item
                    v-if="task.done"
                >
                  <template v-slot:default>
                    <v-list-item-action>
                      <v-checkbox
                          @click="doneTask(task.id)"
                          :input-value="task.done"
                          color="primary"
                          on-icon="mdi-check"
                          off-icon="mdi-checkbox-blank-circle-outline"
                      ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content
                        @click="[setTaskToEdit(task), setForm({show: true, type: 1})]"
                    >
                      <v-list-item-title
                          :class="{'text-decoration-line-through' : task.done}"
                      >{{ task.title }}
                      </v-list-item-title>

                      <div>
                        <v-chip
                            v-if="task.dueDate"
                            text-color="black"
                            x-small
                            class="mr-1 mt-1">
                          <v-icon left x-small>
                            mdi-calendar
                          </v-icon>
                          {{ getFormattedDate(task) }}
                        </v-chip>
                        <v-chip
                            v-for="label in task.labels"
                            :color="label.color"
                            text-color="white"
                            x-small
                            class="mr-1 mt-1 font-weight-medium"
                        >
                          {{ label.text }}
                        </v-chip>
                      </div>

                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn
                          @click.stop="deleteTask(task.id)"
                          icon
                      >
                        <v-icon color="rgb(117, 117, 117)">mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-list-item-action>

                  </template>
                </v-list-item>
<!--                <v-divider></v-divider>-->
              </div>
            </v-list>
          </div>
        </v-card-text>

        <div style="flex: 1000 0 auto;"></div>

      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import {getFormattedDate as getDate} from "@/store";

export default {
  name: 'Home',
  data() {
    return {
      newTaskTitle: '',
      tasks: [],
      model: false
    }
  },
  methods: {
    doneTask(id) {
      this.$store.dispatch('doneTask', id)
    },
    deleteTask(id) {
      this.$store.dispatch('deleteTask', id)
    },
    setTaskToEdit(task) {
      this.$store.dispatch('setTaskToEdit', task)
    },
    setForm(form) {
      this.$store.dispatch('setForm', form)
    },
    setShowCompleted(boolean) {
      this.$store.commit('setShowCompleted', boolean)
    },
    getFormattedDate(task) {
      let date = task.dueDate
      let time = task.dueTime

      return getDate(date, time)
    }
  },
  computed: {
    showAllCaughtUp() {
      if (this.$store.getters.getTasks) {
        if (this.$store.getters.getTasks.length === 0) {
          return true
        } else if (this.$store.getters.getTasks.filter(t => t.done === false).length === 0) {
          return true
        }
      }

      return false
    },
    showCompleted: {
      get() {
        if (this.$store.state.tasks.filter(t => t.done === true).length === 0) {
          this.$store.commit('setShowCompleted', false)
          return false
        } else {
          return this.$store.state.showCompleted
        }
      },
      set(value) {
        this.$store.commit('setShowCompleted', value)
      }
    }
  }
}
</script>

<style lang="sass">
@media screen and (max-device-width: 768px)
  .v-input--selection-controls__ripple:before
    background: transparent !important
  .v-btn:before
    background: transparent !important
</style>
