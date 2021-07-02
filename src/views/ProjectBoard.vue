<template>
  <div>
    <h1>
      Project Board
    </h1>

    <h3 v-text="message">
    </h3>

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
    message: "you don't have any courses in current semester 😅"
  }),
  computed: {
    ...sync("user", ["currSemester"]),
  },
  watch: {
    currSemester(newSemester) {
      this.getCourses(newSemester);
    },
  },
  created() {},
  methods: {
    getCourses(newSemester) {
      const user = JSON.parse(this.$session.get("user"));
      this.message = "Loading . . . "
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
          console.log(res.data);
          this.courses = res.data;
          this.message = this.courses.length === 0 ? 
          "you don't have any courses in current semester 😅" :
          ""
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
