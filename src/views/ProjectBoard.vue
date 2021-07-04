<template>
  <div>
    <v-progress-linear
      :active="isLoading"
      :indeterminate="isLoading"
      absolute
      top
    ></v-progress-linear>

    <v-alert
      border="left"
      text
      type="info"
      colored-border
      v-if="message != ''"
      dismissible
    >
    {{message}}
    </v-alert>

    <v-list v-for="(course, index) in courses" :key="index">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title v-text="course.subject.Subject" />
          <v-list-item-subtitle v-text="course.subject.Class" />
          <v-list-item-subtitle v-text="course.subject.Shift" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <router-link to="/task-board">
      Task Board
    </router-link>
  </div>
</template>

<script>
import axios from "axios";
import { sync } from "vuex-pathify";
export default {
  name: "ProjectBoard",
  components: {},
  data: () => ({
    courses: [],
    isLoading: false,
    message: "",
  }),
  computed: {
    ...sync("user", ["currSemester"]),
  },
  watch: {
    currSemester(newSemester) {
      this.getCourses(newSemester);
    },
  },
  mounted() {
    this.getCourses(this.currSemester);
  },
  methods: {
    getCourses(newSemester) {
      const user = JSON.parse(this.$session.get("user"));
      this.isLoading = true;
      // console.log(newSemester.value)
      axios
        .get(
          `https://laboratory.binus.ac.id/lapi/api/Binusmaya/GetStudentSubjectsInSemesterWithGroup?semesterId=${newSemester.value}&binusianNumber=${user.User.UserName}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token.token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          this.courses = res.data.filter((e) => {
            return e.group !== null && e.group.Status !== "none";
          });

          this.message =
            this.courses.length === 0
              ? "You don't have any project in current semester 😅"
              : "Please form a group in bluejack website first, before proceeding to manage your project here";
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
