<template>
  <v-container>
    <div v-if="courses.length == 0">
      <v-row>
        <v-col>
          <material-alert icon="mdi-alert" class="text-body-1">
            No data available 😣
          </material-alert>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row v-for="(course, index) in courses" :key="index" class="mb-8">
        <v-col>
          <material-card color="primary" full-header >
            <template #heading>
              <div
                class="pa-5 pr-6 white--text font-weight-light text-body-1 text-truncate"
              >
                <v-icon class="mr-3">
                  mdi-clipboard-list
                </v-icon>
                {{ course.subject.Subject }}
              </div>
            </template>

            <template #subtitle>
              <div class=" px-5 mt-2 mb-5 text-body-1 font-weight-black">
                Class: {{ course.subject.Class }} <br />
                Group: {{ course.group.Group.GroupNumber }} <br />
                Member:
              </div>
            </template>

              <v-data-table
                :headers="[
                  { text: 'NIM', value: 'StudentNumber' },
                  { text: 'Student Name', value: 'Name' }
                ]"
                :items="course.group.Group.Students"
                :items-per-page="10"
                :disable-pagination="false"
                :disable-filtering="false"
                hide-default-footer
                disable-sort
                class="mx-8 elevation-3"
              >
              </v-data-table>

            <template #actions>
              <div class="py-5 ml-3">
                <v-btn color="secondary" @click="setCurrCourse(course)">
                  Manage Project
                </v-btn>
              </div>
            </template>
          </material-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "Projects",
  data: () => ({
    courses: [],
    isLoading: false
  }),
  computed: {
    ...sync("user", ["currSemester", "currCourses"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currCourses(newValue) {
      this.courses = newValue;
    }
  },
  mounted() {
    this.courses = this.$store.get("user/currCourses");
  },
  methods: {
    setCurrCourse(course) {
      window.Database.ref(`Students/${this.user.User.UserName}/currCourse/`)
        .set(course)
        .then(() => {
          this.$router.push("/task-board");
        });

      window.Database.ref(`Subjects/${course.group.Group.ClassTransactionId}/`)
        .get()
        .then(s => {
          if (s.exists()) return;

          window.Database.ref(
            `Subjects/${course.group.Group.ClassTransactionId}/`
          ).set({
            ClassTransactionId: course.group.Group.ClassTransactionId,
            Subject: course.subject.Subject
          });
        });

      window.Database.ref(
        `Subjects/${course.group.Group.ClassTransactionId}/Groups/${course.group.Group.GroupNumber}/`
      )
        .get()
        .then(s => {
          if (s.exists()) return;
          window.Database.ref(
            `Subjects/${course.group.Group.ClassTransactionId}/Groups/${course.group.Group.GroupNumber}/`
          ).set({
            GroupNumber: course.group.Group.GroupNumber
          });
        });
    }
  }
};
</script>
