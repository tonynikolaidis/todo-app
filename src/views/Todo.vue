<template>
  <div>
    <div
      v-if="this.$store.getters.getTasks.length === 0 || this.$store.getters.getTasks.filter(t => t.done === false).length === 0"
      class="d-flex flex-column justify-center align-center"
      style="height: 350px"
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
            @click="doneTask(task.id)"
            :class="{ 'blue lighten-5' : task.done }"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-checkbox
                  :input-value="task.done"
                  color="primary"
                  on-icon="mdi-check"
                  off-icon="mdi-checkbox-blank-circle-outline"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                  :class="{'text-decoration-line-through' : task.done}"
              >{{ task.title }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                  @click.stop="deleteTask(task.id)"
                  icon
              >
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>

          </template>
        </v-list-item>
        <!--        <v-divider></v-divider>-->
      </div>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      newTaskTitle: '',
      tasks: []
    }
  },
  methods: {
    doneTask(id) {
      this.$store.dispatch('doneTask', id)
    },
    deleteTask(id) {
      this.$store.dispatch('deleteTask', id)
    }
  }
}
</script>
