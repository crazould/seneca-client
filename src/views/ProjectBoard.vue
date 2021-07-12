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
    ...sync("user", ["currSemester", "currCourses"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currCourses(newValue) {
      this.courses = newValue
    }
  },
  mounted() {
    this.courses = this.$store.get('user/currCourses')
  },
  methods: {
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
