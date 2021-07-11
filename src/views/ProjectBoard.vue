<template>
  <v-container fluid>
    <v-progress-linear
      :active="isLoading"
      :indeterminate="isLoading"
      absolute
      top
    ></v-progress-linear>

    <material-alert
      border="left"
      text
      type="info"
      colored-border
      v-if="message != ''"
      dismissible
    >
      {{ message }}
    </material-alert>

    <v-row v-for="(course, index) in courses" :key="index">
      <v-col>
        <v-card min-height="180">
          <v-card-title class="font-weight-light text-h3">
            {{ course.subject.Subject }}
          </v-card-title>
          <v-card-subtitle>
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
  </v-container>
</template>

<script>
import axios from "axios";
import { sync } from "vuex-pathify";
import MaterialAlert from "../components/MaterialAlert.vue";
export default {
  name: "ProjectBoard",
  components: { MaterialAlert },
  data: () => ({
    courses: [],
    isLoading: false,
    message: ""
  }),
  computed: {
    ...sync("user", ["currSemester"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currSemester(newSemester) {
      this.getCourses(newSemester);
    }
  },
  mounted() {
    this.getCourses(this.currSemester);
  },
  methods: {
    getCourses(newSemester) {
      if (newSemester.value == undefined) return;

      this.isLoading = true;
      this.courses = 0;
      this.message = "";
      // console.log(newSemester.value)
      // console.log(user.Token.token)

      axios
        .get(
          `https://laboratory.binus.ac.id/lapi/api/Binusmaya/GetStudentSubjectsInSemesterWithGroup?semesterId=${newSemester.value}&binusianNumber=${this.user.User.UserName}`,
          {
            headers: {
              Authorization: `Bearer ${this.user.Token.token}`
            }
          }
        )
        .then(res => {
          // console.log(res.data);
          this.courses = res.data.filter(e => {
            return e.group !== null && e.group.Status !== "none";
          });

          // Uncomment this to debugging the UI of Project Component
          // let temp = this.courses;
          // temp.forEach((element) => {
          //   this.courses.push(element);
          // });
          // temp.forEach((element) => {
          //   this.courses.push(element);
          // });
          // console.log(this.courses);
          // this.courses = temp;

          this.message =
            this.courses.length === 0
              ? "You don't have any project in current semester 😅"
              : "Please form a group in bluejack website first, before proceed to manage your project here.";
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
    setCurrCourse(course) {
      // console.log(course)
      window.Database.ref(`Students/${this.user.User.UserName}/currCourse/`)
        .set(course)
        .then(() => {
          this.$router.push("/task-board");
        });
    }
  }
};
</script>
