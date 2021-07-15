<template>
  <v-container fluid>
    <v-progress-linear
      :active="isLoading"
      :indeterminate="isLoading"
      absolute
      top
    ></v-progress-linear>
    <div v-if="courses.length != 0">
      <v-row v-for="(course, index) in courses" :key="index">
        <v-col>
          <v-card min-height="180">
            <v-card-title
              class="font-weight-light text-h4 text-sm-h3 text-md-h2 text-truncate"
              style="display: block"
            >
              {{ course.subject.Subject }}
            </v-card-title>
            <v-card-subtitle
              class="font-weight-light text-h6 text-sm-h5 text-md-h4"
            >
              {{ course.subject.Class }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                :color="$vuetify.theme.themes.dark.primary"
                link
                class="white--text"
                absolute
                bottom
                @click="setCurrCourse(course)"
              >
                Manage Project
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <material-alert
            icon="mdi-alert"
            class="text-body-1"
          >
            No data available 😣
          </material-alert>
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
      
      window.Database.ref(`Subjects/${course.group.Group.ClassTransactionId}/`).get().then(s => {
        if(s.exists()) return

        window.Database.ref(`Subjects/${course.group.Group.ClassTransactionId}/`).set({
          ClassTransactionId: course.group.Group.ClassTransactionId,
          Subject: course.subject.Subject,
        })

      })

      window.Database.ref(`Subjects/${course.group.Group.ClassTransactionId}/Groups/${course.group.Group.GroupNumber}/`).get().then(s => {
        if(s.exists()) return
        window.Database.ref(`Subjects/${course.group.Group.ClassTransactionId}/Groups/${course.group.Group.GroupNumber}/`).set({
          GroupNumber: course.group.Group.GroupNumber,
        })
      })

    }
  }
};
</script>
