<template lang="">
  <v-container fluid>
    <v-dialog v-model="phaseDialog" max-width="500">
      <v-card>
        <v-card-title
          class="display-2 font-weight-light white--text"
          style="background-color: #0090D1"
        >
          Phase Form
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
            transition="scroll-y-transition"
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
          Task Form
        </v-card-title>

        <v-form ref="taskForm" v-model="taskFormValidation" lazy-validation>
          <v-card-text>
            <v-text-field
              label="Name"
              prepend-icon="mdi-file-edit-outline"
              v-model="taskName"
              :rules="taskNameRules"
              required
            ></v-text-field>

            <v-menu
              v-model="categoryDatePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scroll-y-transition"
              offset-y
              required
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="taskDueDate"
                  label="Due Date"
                  prepend-icon="mdi-calendar-outline"
                  readonly
                  v-bind="attrs"
                  required
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
              prepend-icon="mdi-calendar-alert"
              :rules="priorityRules"
            ></v-text-field>

            <v-select
              v-if="isAddTaskOnCategory == false"
              v-model="taskCategory"
              :items="inputCategories"
              required
              label="Category"
              prepend-icon="mdi-folder-plus-outline  "
            >
            </v-select>

            <v-textarea
              outlined
              label="Note"
              required
              v-model="taskNote"
              prepend-icon="mdi-note-outline"
              :rules="noteRules"
            ></v-textarea>
            <v-spacer></v-spacer>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="changeTask()" :loading="isLoading">
              Submit
            </v-btn>
            <v-btn color="error" @click="categoryDialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-title
        class="white--text font-weight-light text-h4 text-sm-h3 text-md-h2 text-truncate"
        style="background-color: #0090D1;"
      >
        {{ currCourse.subject.Subject }}
      </v-card-title>

      <v-card-actions>
        <v-btn color="primary" dense text @click="setPhaseName()"
          >Add New Phase</v-btn
        >
        <v-btn color="primary" dense text>Group Discussion</v-btn>
      </v-card-actions>
      <v-divider></v-divider>

      <v-list v-if="phases.length === 0" class="my-5 py-5" nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center text-h3">
              Your group haven't create a product backlog
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-else class="my-5 py-5" nav>
        <v-list-group
          v-for="(phase, i) in phases"
          :key="i"
          :value="false"
          append-icon="mdi-arrow-down-drop-circle-outline"
        >
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="display-2">{{
                  phase.Name
                }}</v-list-item-title>
                <v-list-item-subtitle
                  v-text="changeDateFormat(phase.DueDate)"
                  class="text--error"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu
                  offset-y
                  min-width="150"
                  transition="scroll-y-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>
                        mdi-format-list-bulleted-square
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list nav>
                    <v-list-item @click="addTaskOnPhase(i)">
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
            </v-list-item>
          </template>

          <v-list-item v-if="!phase.Categories" class="text-center">
            <v-list-item-content>
              <v-list-item-title class="text-h3">
                empty 😅
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-for="(category, j) in phase.Categories"
            :key="j"
            sub-group
            prepend-icon="mdi-arrow-down-drop-circle-outline"
            color="primary"
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="display-1">{{
                    category.Name
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-menu
                    offset-y
                    min-width="150"
                    transition="scroll-y-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon> mdi-format-list-bulleted-square </v-icon>
                      </v-btn>
                    </template>
                    <v-list nav>
                      <v-list-item @click="addTaskOnCategory(i, j)">
                        <v-list-item-title>Add task</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteCategory(i, j)">
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>

            <v-list-item v-if="!category.Tasks" class="text-center">
              <v-list-item-content>
                <v-list-item-title class="text-h3">
                  empty 😅
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-for="(task, k) in category.Tasks" :key="k">
              <v-list-item-content>
                <v-list-item-title v-text="task.Name"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="changeDateFormat(task.DueDate)"
                ></v-list-item-subtitle>
                {{ task.Priority }}
                {{ task.Note }}
              </v-list-item-content>
              <v-list-item-action>
                <v-menu
                  offset-y
                  min-width="150"
                  transition="scroll-y-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>
                        mdi-format-list-bulleted-square
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list nav>
                    <v-list-item @click="editTask(i, j, k)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteTask(i, j, k)">
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
    <v-snackbar
      transition="scroll-y-reverse-transition"
      class="mb-5"
      v-model="isShowMessage"
      :timeout="3000"
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="error" text v-bind="attrs" @click="isShowMessage = false">
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
    inputCategories: ["Open", "On Progress", "Pending", "Completed"],
    categoryDatePicker: false,
    phaseIdx: -1,
    categoryIdx: -1,
    taskIdx: -1,
    phaseName: false,
    isAddTaskOnCategory: false,
    taskFormValidation: false,
    taskNameRules: [v => !!v || "Name can't be empty" ],
    priorityRules: [v => (v && v > 0) || "Priority can't be lower than 1", v => !v.toString().startsWith('0') || "Priority can't starts with zero"],
    noteRules: [v => !!v || "Note can't be empty"],
  }),
  computed: {
    ...sync("user", ["currCourse"])
  },
  mounted() {
    this.getGroupDetail();
  },
  watch: {
    currCourse(newSemester) {
      this.getGroupDetail(newSemester);
    }
  },
  methods: {
    getGroupDetail() {
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases`
      ).on("value", s => {
        this.phases = [];
        this.phases = Object.assign(this.phases, s.val());
        console.log(this.phases);
      });
    },
    setPhaseName() {
      console.log(this.phases.length == 0);
      console.log(this.phases == null);
      console.log(this.phases == undefined);
      if (
        this.phases.length == 0 ||
        this.phases == null ||
        this.phases == undefined
      ) {
        this.phaseName = "Backlog";
      } else {
        this.phaseName = `Sprint ${this.phases.length}`;
      }

      this.phaseDialog = !this.phaseDialog;
    },
    addPhase() {
      this.isLoading = true;
      let idx = this.phaseIdx == -1 ? this.phases.length : this.phaseIdx;
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${idx}`
      )
        .set({
          Name: this.phaseName,
          DueDate: this.phaseDueDate
        })
        .then(() => {
          this.message =
            this.phaseIdx === -1
              ? "New phase has been added ✨"
              : "Change has been saved ✨";
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
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
          this.message = "Phase has been removed ✨";
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.isLoading = false;
        });
    },
    deleteTask(phaseIdx, categoryIdx, taskIdx) {
      this.isLoading = true;
      this.phases[phaseIdx].Categories[categoryIdx].Tasks.splice(taskIdx, 1);
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${phaseIdx}/Categories/${categoryIdx}/Tasks/`
      )
        .set(this.phases[phaseIdx].Categories[categoryIdx].Tasks)
        .then(() => {
          this.message = "Task has been removed ✨";
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.isLoading = false;
        });
    },
    deleteCategory(phaseIdx, categoryIdx) {
      this.isLoading = true;
      this.phases[phaseIdx].Categories.splice(categoryIdx, 1);

      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${phaseIdx}/Categories/`
      )
        .set(this.phases[phaseIdx].Categories)
        .then(() => {
          this.message = "Category has been removed ✨";
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.isLoading = false;
        });
    },
    changeTask() {

      if(!this.$refs.taskForm.validate()) return

      this.isLoading = true;

      let task = {
        Name: this.taskName,
        DueDate: this.taskDueDate,
        Priority: this.taskPriority,
        Note: this.taskNote
      };

      let categoryId;

      if (this.categoryIdx == -1) {
        categoryId = !this.phases[this.phaseIdx].Categories ? 0 : -1;
      } else {
        categoryId = this.categoryIdx;
      }

      if (categoryId == -1) {
        categoryId = this.phases[this.phaseIdx].Categories.findIndex(e => {
          console.log(typeof e.Name);
          console.log(typeof this.taskCategory);
          return e.Name === this.taskCategory;
        });
        console.log(categoryId);
        if (categoryId == -1) {
          categoryId = this.phases[this.phaseIdx].Categories.length;
        }
      }

      let taskId;
      let refLink = `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${this.phaseIdx}/Categories/${categoryId}`;

      // check if current category is exist
      if (
        this.phases[this.phaseIdx].Categories &&
        this.phases[this.phaseIdx].Categories[categoryId]
      ) {
        // if exist then check if has a Tasks or not, or is in edit state
        console.log(this.taskIdx);

        if (this.taskIdx != -1) {
          // if in edit state then use taskIdx
          taskId = this.taskIdx;
        } else if (this.phases[this.phaseIdx].Categories[categoryId].Tasks) {
          // if exist then get the last idx
          taskId = this.phases[this.phaseIdx].Categories[categoryId].Tasks
            .length;
        } else {
          // if not, assign task idx to 0
          taskId = 0;
        }

        // finally change refLink to that task
        refLink = refLink + `/Tasks/${taskId}`;
      } else {
        // if not exist, then create a category
        task = {
          Name: this.taskCategory,
          Tasks: [task]
        };
      }

      console.log(task);
      console.log(taskId);

      window.Database.ref(refLink)
        .set(task)
        .then(() => {
          this.message = "New task has been added ✨";
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
        })
        .finally(() => {
          this.categoryDialog = false;
          this.isShowMessage = true;
          this.isLoading = false;
          this.phaseIdx = -1;
          this.categoryIdx = -1;
          this.taskIdx = -1;
        });
    },
    addTaskOnCategory(phaseIdx, categoryIdx) {
      this.isAddTaskOnCategory = true;
      this.phaseIdx = phaseIdx;
      this.categoryIdx = categoryIdx;

      this.taskName = "";
      this.taskDueDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.taskNote = "";
      this.taskPriority = 1;

      this.categoryDialog = !this.categoryDialog;
    },
    addTaskOnPhase(idx) {
      this.isAddTaskOnCategory = false;
      this.phaseIdx = idx;

      this.taskName = "";
      this.taskDueDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.taskNote = "";
      this.taskPriority = 1;
      this.taskCategory = "Open";

      this.categoryDialog = !this.categoryDialog;
    },
    editTask(phaseIdx, categoryIdx, taskIdx) {
      this.isAddTaskOnCategory = false;
      this.phaseIdx = phaseIdx;
      this.categoryIdx = categoryIdx;
      this.taskIdx = taskIdx;

      let category = this.phases[phaseIdx].Categories[categoryIdx];
      let task = category.Tasks[taskIdx];

      console.log(category);
      console.log(task);

      this.taskName = task.Name;
      this.taskDueDate = task.DueDate;
      this.taskPriority = task.Priority;
      this.taskNote = task.Note;
      this.taskCategory = category.Name;

      this.categoryDialog = !this.categoryDialog;
    },
    editPhase(idx) {
      this.phaseIdx = idx;
      this.phaseDialog = !this.phasesDialog;
      this.phaseName = this.phases[idx].Name;
      this.phaseDueDate = this.phases[idx].DueDate;
      this.phaseName = this.phases[idx].Name;
    },
    changeDateFormat(oldDate){
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let newDate = new Date(oldDate)
      let dateNumber = newDate.getDate()
      let month = months[newDate.getMonth()]
      let year = newDate.getFullYear()
      return `${month} ${dateNumber}, ${year}` 
    }
  }
};
</script>
<style lang=""></style>
