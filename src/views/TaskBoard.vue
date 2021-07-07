<template lang="">
  <v-container fluid>
    <div class="text-h2">
      {{ currCourse.subject.Subject }}
    </div>

    <v-dialog v-model="phaseDialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" text v-bind="attrs" v-on="on" @click="setPhase()"
          >Create New Phase</v-btn
        >
      </template>

      <v-card>
        <v-card-title
          class="display-2 font-weight-light white--text"
          style="background-color: #0090D1"
        >
          Create new phase
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Phase"
            disabled
            prepend-icon="mdi-briefcase-clock"
            v-model="phaseName"
          ></v-text-field>

          <v-menu
            v-model="datePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="phaseDueDate"
                label="Phase Due Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="phaseDueDate"
              @input="datePicker = false"
            ></v-date-picker>
          </v-menu>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addPhase()">
            Submit
          </v-btn>
          <v-btn color="secondary" @click="phaseDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn color="primary" text>Discussion</v-btn>

    <v-list v-if="group !== null" class="mt-5 px-2">
      <v-list-group
        v-for="(phase, i) in group.Phases"
        :value="false"
        :key="i"
        color="info"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="display-2">{{
              phase.Name
            }}</v-list-item-title>
            <v-list-item-subtitle v-text="phase.DueDate"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small text color="primary">add task</v-btn>
            <v-btn small text color="warning">edit</v-btn>
            <v-btn small text color="error">delete</v-btn>
          </v-list-item-action>
        </template>

        <v-list-group
          v-for="(category, j) in phase.Categories"
          :key="j"
          :value="false"
          sub-group
          no-action
          color="info"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ category.Name }}</v-list-item-title>
              <v-list-item-action>
                <v-btn small text color="primary">add task</v-btn>
                <v-btn small text color="error">delete</v-btn>
              </v-list-item-action>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(task, k) in category.Tasks" :key="k">
            <v-list-item-content>
              <v-list-item-title v-text="task.Name"></v-list-item-title>
              <v-list-item-subtitle
                v-text="task.DueDate"
              ></v-list-item-subtitle>
              {{ task.Priority }}
              <v-list-item-action>
                <v-btn small text color="warning">edit</v-btn>
                <v-btn small text color="error">delete</v-btn>
              </v-list-item-action>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "TaskBoard",
  components: {},
  data: () => ({
    group: {
      'Students': {
        'StudentNumber': 'Muhammad At Thariq Filardi'
      },
      'Phases': [
        {
          'Name': 'Phase Name',
          'DueDate': 'Phases DueDate',
          'Categories': [
            {
              'Name': 'Category Name',
              'Tasks': [
                {
                  'Name': 'Task Name',
                  'DueDate': 'Task DueDate',
                  'Priority': 3,
                  'Note': 'Task note'
                }
              ]
            }
          ]
        }
      ]
    },
    phaseDialog: false,
    categoryDialog: false,
    taskDialog: false,
    phaseDueDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    datePicker: false,
  }),
  computed: {
    ...sync("user", ["currCourse"]),
    phaseName: function() {
      if (this.group == null || this.group.Phases == undefined) return "Backlog";
      return `Sprint ${this.group.Phases.length}`;
    },
  },
  created() {
    this.getGroupDetail();
  },
  methods: {
    getGroupDetail() {
      console.log(this.currCourse.subject.ClassTransactionId);
      console.log(this.currCourse.group.Group.GroupNumber);
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}`
      ).on("value", (s) => {
        this.group = [];
        this.group = s.val();
      });
    },
    setPhase() {},
  },
  addPhase() {},
};
</script>
<style lang=""></style>
