<template>
  <div>
    <h1>
      Project Board
    </h1>
    <router-link to="/task-board">Task Board</router-link>
  </div>
</template>

<script>
import axios from "axios";
import { sync } from "vuex-pathify";
export default {
  name: "ProjectBoard",
  components: {},
  data: () => ({}),
  computed: {
    ...sync("user", ["currSemester"]),
  },
  mounted() {
    let user = JSON.parse(this.$session.get("user"));
    console.log(user);
    console.log(user.User.UserName);
    console.log(user.Token.token);
    console.log(this.currSemester.value);

    axios
      .get(
        `https://laboratory.binus.ac.id/lapi/api/Course/GetStudentSubjectsInSemesterWithGroup?semesterId=${this.currSemester.value}&binusianNumber=${user.User.UserName}`,
        {
          headers: {
            Authorization: `token ${user.Token.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        console.log("masuk");
      })
      .catch((error) => {
        if (error.status == 401) {
          console.log("Wrong NIM & password combination");
        } else {
          console.log("Server under maintenace");
        }
      });
  },
  methods: {},
};
</script>
