<template>
  <div>
    <h1>
      Project Board
    </h1>

    <h3 v-if="courses.length === 0">
      you don't have any courses in current semester 😅
    </h3>

    <v-list v-else v-for="(course, index) in courses" :key="index">
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
  }),
  computed: {
    ...sync("user", ["currSemester"]),
  },
  watch: {
    currSemester(newSemester) {
      this.getCourses(newSemester)
    },
  },
  created() {},
  methods: {
    getCourses(newSemester) {
      const user = JSON.parse(this.$session.get("user"));
      // console.log(user);
      // console.log(`username: ${user.User.UserName}`);
      // console.log(`token: ${user.Token.token}`);
      // console.log(`semester: ${this.currSemester.value}`);
      console.log("loading . . .");
      const headers = {
        headers: {
          Authorization: `Bearer ${user.Token.token}`,
        },
      };
      axios
        .get(
          `https://laboratory.binus.ac.id/lapi/api/Binusmaya/GetStudentSubjectsInSemesterWithGroup?semesterId=${newSemester.value}&binusianNumber=${user.User.UserName}`,
          headers
        )
        .then((res) => {
          console.log(res.data);
          this.courses = res.data;
          console.log("finish!");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
