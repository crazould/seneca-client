<template lang="">
  <v-container fluid>
    <v-dialog v-model="phaseDialog" max-width="500">
      <v-card>
        <v-card-title
          class="display-2 font-weight-light white--text"
          style="background-color: #2b3ff0"
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
                :error="isPhaseDueDateError"
                :error-messages="phaseDueDateMsg"
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
          style="background-color: #2b3ff0"
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
            />

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
                  :error="isTaskDueDateError"
                  :error-messages="taskDueDateMsg"
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
              v-if="changeTaskMode != 'ADD_CATEGORY_TASK'"
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
        style="background-color: #2b3ff0;"
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
import axios from "axios";

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
    phaseName: "",
    isAddTaskOnCategory: false,
    taskFormValidation: true,
    taskNameRules: [v => !!v || "Name can't be empty"],
    priorityRules: [
      v => (v && v > 0) || "Priority can't be lower than 1",
      v => !v.toString().startsWith("0") || "Priority can't starts with zero"
    ],
    noteRules: [v => !!v || "Note can't be empty"],
    isPhaseDueDateError: false,
    phaseDueDateMsg: [],
    isTaskDueDateError: false,
    taskDueDateMsg: [],
    changeTaskMode: ""
  }),
  computed: {
    ...sync("user", ["currCourse", "currCourses", "notifications"])
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
        let data = [];
        data = Object.assign(data, s.val());
        this.phases = data;
      });
    },
    setPhaseName() {
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
      this.phaseDueDateMsg = [];
      this.isPhaseDueDateError = false;
      // if (
      //   this.phaseName != "Backlog" &&
      //   this.phaseDueDate > this.phases[0].DueDate
      // ) {
      //   this.isPhaseDueDateError = true;
      //   // this.phaseDueDateMsg.push(`${this.phaseName} due date must be less than or equal to ${this.phases[0].Name}'s due date`);
      //   this.phaseDueDateMsg = [ ...this.phaseDueDateMsg, (`${this.phaseName} due date must be less than or equal to ${this.phases[0].Name}'s due date`)];
      //   return;
      // } else if (
      //   this.phases.length >= 2 &&
      //   this.phaseDueDate < this.phases[this.phases.length - 1].DueDate
      // ) {
      //   this.isPhaseDueDateError = true;
      //   // this.phaseDueDateMsg.push(`${this.phaseName} due date must be more than or equal to ${this.phases[this.phases.length - 1].Name}'s due date`);
      //   this.phaseDueDateMsg = [...this.phaseDueDateMsg, (`${this.phaseName} due date must be more than or equal to ${this.phases[this.phases.length - 1].Name}'s due date`)];
      //   return;
      // }

      this.phaseDueDateMsg = [];
      this.isPhaseDueDateError = false;
      this.isLoading = true;

      let idx = this.phaseIdx == -1 ? this.phases.length : this.phaseIdx;

      let currCategories = null;

      if (
        this.phases[idx] != undefined &&
        this.phases[idx].Categories == undefined
      ) {
        currCategories == this.phases[idx].Categories;
      }
      // console.log(this.phaseIdx);
      // console.log(this.phases.length);

      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${idx}`
      )
        .set({
          Name: this.phaseName,
          DueDate: this.phaseDueDate,
          Categories: currCategories
        })
        .then(() => {
          this.message =
            this.phaseIdx === -1
              ? "New phase has been added ✨"
              : "Change has been saved ✨";
          axios
            .post("http://localhost:3000/create-phase-notification", {
              ClassTransactionId: this.currCourse.subject.ClassTransactionId,
              GroupNumber: this.currCourse.group.Group.GroupNumber,
              PhaseIdx: idx,
              Students: this.currCourse.group.Group.Students,
              Subject: this.currCourse.subject.Subject
            })
            .then(() => {
              this.currCourses.forEach(course => {
                this.notifications = [];
                this.getNotifcations(
                  course.group.Group.ClassTransactionId,
                  course.group.Group.GroupNumber
                );
              });
            });
        })
        .catch(() => {
          this.message = "Something went wrong 😥";
        })
        .finally(() => {
          this.isShowMessage = true;
          this.phaseDialog = false;
          this.isLoading = false;
          this.phaseIdx = -1;
        });
    },
    getNotifcations(classId, groupNumber) {
      window.Database.ref(`Notifications/${classId}/${groupNumber}/`)
        .get()
        .then(s => {
          if (!s.exists()) return;
          let data = s.val();
          let notif = Object.entries(data).map(n => {
            return n[1];
          });
          if (notif === this.notifications) return;
          this.notifications = [...this.notifications, ...notif];
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
      if (!this.$refs.taskForm.validate()) return;

      // this.isTaskDueDateError = false;
      // this.taskDueDateMsg = [];
      // if (this.taskDueDate > this.phases[this.phaseIdx].DueDate) {
      //   this.isTaskDueDateError = false;
      //   this.taskDueDateMsg = [
      //     `Task due date must be less than or equal to ${
      //       this.phases[this.phaseIdx].Name
      //     }'s due date`
      //   ];
      //   return;
      // }
      // this.isTaskDueDateError = false;
      // this.taskDueDateMsg = [];

      this.isLoading = true;

      let update;
      let refer = `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}/Phases/${this.phaseIdx}/`;
      let categoryId;

      switch (this.changeTaskMode) {
        case "ADD_PHASE_TASK":
          categoryId = this.phases[this.phaseIdx].Categories ? -1 : 0;

          update = {
            Name: this.taskCategory,
            Tasks: [
              {
                Name: this.taskName,
                DueDate: this.taskDueDate,
                Priority: this.taskPriority,
                Note: this.taskNote
              }
            ]
          };

          if (categoryId == -1) {
            categoryId = this.phases[this.phaseIdx].Categories.findIndex(e => {
              return e.Name === this.taskCategory;
            });

            if (categoryId == -1) {
              categoryId = this.phases[this.phaseIdx].Categories.length;
            } else {
              this.phases[this.phaseIdx].Categories[categoryId].Tasks = [
                ...this.phases[this.phaseIdx].Categories[categoryId].Tasks,
                {
                  Name: this.taskName,
                  DueDate: this.taskDueDate,
                  Priority: this.taskPriority,
                  Note: this.taskNote
                }
              ];
              update = {
                Name: this.taskCategory,
                Tasks: this.phases[this.phaseIdx].Categories[categoryId].Tasks
              };
            }
          }
          refer = refer + "Categories/" + categoryId;
          break;
        case "ADD_CATEGORY_TASK":
          categoryId = this.categoryIdx;
          let taskIdx = 0;

          if (this.phases[this.phaseIdx].Categories[categoryId].Tasks) {
            taskIdx = this.phases[this.phaseIdx].Categories[categoryId].Tasks.length;
          }

          update = {
            Name: this.taskName,
            DueDate: this.taskDueDate,
            Priority: this.taskPriority,
            Note: this.taskNote
          };

          refer = refer + "Categories/" + categoryId + "/Tasks/" + taskIdx;

          break;
        case "EDIT_TASK":
          categoryId = this.phases[this.phaseIdx].Categories.findIndex(e => {
            return e.Name === this.taskCategory;
          });

          let taskId = this.taskIdx;

          if (categoryId == this.categoryIdx) {
            refer = refer + "Categories/" + categoryId + "/Tasks/" + taskId;
            update = {
              Name: this.taskName,
              DueDate: this.taskDueDate,
              Priority: this.taskPriority,
              Note: this.taskNote
            };
          } else if (categoryId != this.categoryIdx) {

            // check category exist
            if (categoryId == -1) {
              // if not create category with task in it
              categoryId = this.phases[this.phaseIdx].Categories.length;
              refer = refer + "Categories/" + categoryId;
              update = {
                Name: this.taskCategory,
                Tasks: [
                  {
                    Name: this.taskName,
                    DueDate: this.taskDueDate,
                    Priority: this.taskPriority,
                    Note: this.taskNote
                  }
                ]
              };

            } else if(categoryId != -1){

              // if category exist
              // check if tasks exist
              refer = refer + "Categories/";
              // delete task before
              this.phases[this.phaseIdx].Categories[this.categoryIdx].Tasks.splice(this.taskIdx, 1)
              console.log(refer)
              if (this.phases[this.phaseIdx].Categories[categoryId].Tasks) {
                // if yes, then push current tasks
                console.log("TASKS EXIST")

                this.phases[this.phaseIdx].Categories[categoryId].Tasks = [
                  ...this.phases[this.phaseIdx].Categories[categoryId].Tasks,
                  {
                    Name: this.taskName,
                    DueDate: this.taskDueDate,
                    Priority: this.taskPriority,
                    Note: this.taskNote
                  }
                ];
              } else {
                // if tasks not exist then create Tasks
                this.phases[this.phaseIdx].Categories[categoryId] = {
                  Name: this.taskCategory,
                  Tasks: [{
                    Name: this.taskName,
                    DueDate: this.taskDueDate,
                    Priority: this.taskPriority,
                    Note: this.taskNote
                  }]
                }
              }
              update = this.phases[this.phaseIdx].Categories
            }
          }
          break;
      }
      window.Database.ref(refer)
        .set(update)
        .then(() => {
          this.message = "New task has been added ✨";
          axios
            .post("http://localhost:3000/create-task-notification", {
              ClassTransactionId: this.currCourse.subject.ClassTransactionId,
              GroupNumber: this.currCourse.group.Group.GroupNumber,
              PhaseIdx: this.phaseIdx,
              CategoryIdx: categoryId,
              TaskIdx: taskId,
              Students: this.currCourse.group.Group.Students,
              Subject: this.currCourse.subject.Subject
            })
            .then(() => {
              this.currCourses.forEach(course => {
                this.notifications = [];
                this.getNotifcations(
                  course.group.Group.ClassTransactionId,
                  course.group.Group.GroupNumber
                );
              });
            });
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
          this.isAddTaskOnCategory = false;
          this.changeTaskMode = "";
        });
     
    },
    addTaskOnCategory(phaseIdx, categoryIdx) {
      this.isAddTaskOnCategory = true;
      this.changeTaskMode = "ADD_CATEGORY_TASK";

      this.phaseIdx = phaseIdx;
      this.categoryIdx = categoryIdx;

      this.resetTaskFormInput();

      this.categoryDialog = !this.categoryDialog;
    },
    addTaskOnPhase(idx) {
      this.isAddTaskOnCategory = false;
      this.changeTaskMode = "ADD_PHASE_TASK";

      this.phaseIdx = idx;

      this.resetTaskFormInput();

      this.categoryDialog = !this.categoryDialog;
    },
    editTask(phaseIdx, categoryIdx, taskIdx) {
      this.isAddTaskOnCategory = false;
      this.changeTaskMode = "EDIT_TASK";

      this.phaseIdx = phaseIdx;
      this.categoryIdx = categoryIdx;
      this.taskIdx = taskIdx;

      let category = this.phases[phaseIdx].Categories[categoryIdx];
      let task = category.Tasks[taskIdx];

      this.taskName = task.Name;
      this.taskDueDate = task.DueDate;
      this.taskPriority = task.Priority;
      this.taskNote = task.Note;
      this.taskCategory = category.Name;

      this.categoryDialog = !this.categoryDialog;
    },
    resetTaskFormInput() {
      this.taskName = "";
      this.taskDueDate = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.taskNote = "";
      this.taskPriority = 1;
      this.taskCategory = "Open";
    },
    editPhase(idx) {
      this.phaseIdx = idx;
      this.phaseName = this.phases[idx].Name;
      this.phaseDueDate = this.phases[idx].DueDate;
      this.phaseName = this.phases[idx].Name;
      this.phaseDialog = !this.phasesDialog;
    },
    changeDateFormat(oldDate) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let newDate = new Date(oldDate);
      let dateNumber = newDate.getDate();
      let month = months[newDate.getMonth()];
      let year = newDate.getFullYear();
      return `${month} ${dateNumber}, ${year}`;
    }
  }
};
</script>
