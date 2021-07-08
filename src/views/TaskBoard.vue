<template lang="">
  <v-container fluid>
    <v-dialog v-model="phaseDialog" max-width="500">
      <v-card>
        <v-card-title
          class="display-2 font-weight-light white--text"
          style="background-color: #0090D1"
        >
          Add new phase
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Phase"
            disabled
            prepend-icon="mdi-briefcase-clock"
            v-model="phaseName"
          ></v-text-field>

          <v-menu
            v-model="phaseDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="phaseDueDate"
                label="Due Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="phaseDueDate"
              @input="phaseDatePicker = false"
            ></v-date-picker>
          </v-menu>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addPhase()" :loading="isLoading">
            Submit
          </v-btn>
          <v-btn color="error" @click="phaseDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="categoryDialog" max-width="500">
      <v-card>
        <v-card-title
          class="display-2 font-weight-light white--text"
          style="background-color: #0090D1"
        >
          Add Task
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Name"
            prepend-icon="mdi-briefcase-clock"
            v-model="taskName"
          ></v-text-field>

          <v-menu
            v-model="categoryDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="taskDueDate"
                label="Due Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="taskDueDate"
              @input="categoryDatePicker = false"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            label="Priority"
            type="number"
            v-model="taskPriority"
            prepend-icon="mdi-briefcase-clock"
          ></v-text-field>

          <v-combobox
            v-model="taskCategory"
            :items="inputCategories"
            label="Category"
            prepend-icon="mdi-briefcase-clock"
          >
          </v-combobox>

          <v-textarea
            outlined
            label="Note"
            v-model="taskNote"
            prepend-icon="mdi-briefcase-clock"
          ></v-textarea>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addTaskOnPhase()" :loading="isLoading">
            Submit
          </v-btn>
          <v-btn color="error" @click="categoryDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title class="text-h2">
        {{ currCourse.subject.Subject }}
      </v-card-title>

      <v-card-actions>
        <v-btn class="mr-5" color="primary" dense text @click="setPhaseName()">Add New Phase</v-btn>
        <v-btn color="primary" dense text>Group Discussion</v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <v-list v-if="phases !== null" class="mt-5 py-5" nav>
        <v-list-group
          v-for="(phase, i) in phases"
          :key="i"
          append-icon="mdi-arrow-down-drop-circle-outline"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="display-2">{{
                phase.Name
              }}</v-list-item-title>
              <v-list-item-subtitle
                v-text="phase.DueDate"
                class="text--error"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu offset-y min-width="150" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>
                      mdi-format-list-bulleted-square
                    </v-icon>
                  </v-btn>
                </template>
                <v-list nav>
                  <v-list-item @click="showCategoryDialog(i)">
                    <v-list-item-title>Add task</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="editPhase(i)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deletePhase(i)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </template>

          <v-list-group
            v-for="(category, j) in phase.Categories"
            :key="j"
            sub-group
            prepend-icon="mdi-arrow-down-drop-circle-outline"
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title  class="display-1">{{ category.Name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu offset-y min-width="150" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>
                        mdi-format-list-bulleted-square
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list nav>
                    <v-list-item>
                      <v-list-item-title>Add task</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </template>
            <v-list-item v-for="(task, k) in category.Tasks" :key="k">
              <v-list-item-content>
                <v-list-item-title v-text="task.Name"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="task.DueDate"
                ></v-list-item-subtitle>
                {{ task.Priority }}
                {{ task.Note }}
              </v-list-item-content>
              <v-list-item-action>
                <v-menu offset-y min-width="150" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>
                        mdi-format-list-bulleted-square
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list nav>
                    <v-list-item>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-card>
    <v-snackbar v-model="isShowMessage" :timeout="3000">
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="isShowMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "TaskBoard",
  components: {},
  data: () => ({
    phases: false,
    isShowMessage: false,
    message: "Success",
    isLoading: false,
    phaseDialog: false,
    categoryDialog: false,
    taskDialog: false,
    phaseDueDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    phaseDatePicker: false,
    taskName: "",
    taskDueDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    taskPriority: "",
    taskNote: "",
    taskCategory: "",
    inputCategories: ["Open", "On Progress", "Pending", "Compeleted"],
    categoryDatePicker: false,
    phaseIdx: -1,
    categoryIdx: -1,
    phaseName: false,
  }),
  computed: {
    ...sync("user", ["currCourse"]),
  },
  created() {
    this.getGroupDetail();
  },
  methods: {
    getGroupDetail() {
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases`
      ).on("value", (s) => {
        this.phases = [];
        this.phases = Object.assign(this.phases, s.val());
        console.log(this.phases);
      });
    },
    setPhaseName() {
      if (this.phases == null || this.phases == undefined)
        this.phaseName = "Backlog";
      this.phaseName = `Sprint ${this.phases.length}`;
      this.phaseDialog = !this.phaseDialog;
    },
    addPhase() {
      this.isLoading = true;

      let idx = this.phaseIdx == -1 ? this.phases.length : this.phaseIdx;

      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${idx}`
      )
        .set({ Name: this.phaseName, DueDate: this.phaseDueDate })
        .then(() => {
          this.message =
            this.phaseIdx === -1
              ? "New phase has been added 😉"
              : "Change has been saved 😉";
        })
        .catch(() => {
          this.message = "Something went wrong 😢";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.phaseDialog = false;
          this.isLoading = false;
          this.phasesIdx = -1;
        });
    },
    deletePhase(phaseIdx) {
      this.isLoading = true;
      this.phases.splice(phaseIdx, 1);

      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/`
      )
        .set(this.phases)
        .then(() => {
          this.message = "Phase has been removed 😉";
        })
        .catch(() => {
          this.message = "Something went wrong 😢";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.isLoading = false;
          this.phaseIdx = -1;
        });
    },
    addTaskOnPhase() {
      this.isLoading = true;
      let task = {
        Name: this.taskName,
        DueDate: this.taskDueDate,
        Priority: this.taskPriority,
        Note: this.taskNote,
      };

      let categoryId = -1;
      switch (this.taskCategory) {
        case "Open":
          categoryId = 0;
          break;
        case "On Progress":
          categoryId = 1;
          break;
        case "Pending":
          categoryId = 2;
          break;
        case "Completed":
          categoryId = 3;
          break;
      }

      let taskId = this.phases[this.phaseIdx].Categories[categoryId].Tasks
        .length;
      let refLink = `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${this.phaseIdx}/Categories/${categoryId}`;

      if (taskId) {
        refLink = refLink + `/Tasks/${taskId}`;
      } else {
        // change task to category
        task = {
          Name: this.taskCategory,
          Tasks: [task],
        };
      }

      window.Database.ref(refLink)
        .set(task)
        .then(() => {
          this.message = "New task has been added 😉";
        })
        .catch(() => {
          this.message = "Something went wrong 😢";
        })
        .finally(() => {
          this.categoryDialog = false;
          this.isShowMessage = true;
          this.isLoading = false;
          this.phaseIdx = -1;
        });
    },
    showCategoryDialog(idx) {
      this.phaseIdx = idx;
      this.categoryDialog = !this.categoryDialog;
    },
    editPhase(idx) {
      this.phaseIdx = idx;
      this.phaseDialog = !this.phasesDialog;
      this.phaseName = this.phases[idx].Name;
      this.phaseDueDate = this.phases[idx].DueDate;
      // console.log(this.phases[idx].Name)
      // console.log(this.phaseName)
      this.phaseName = this.phases[idx].Name;
      // console.log(this.phases[idx].Name)
      // console.log(this.phaseName)
    },
  },
};
</script>
<style lang=""></style>
