<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

    <default-drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title class="font-weight-light text-h5" v-text="pageName" />

    <v-spacer />
    <v-select
      v-on:change="changeSemester"
      :items="semesters"
      :value="currSemester"
      label="Semester"
      class="mt-8"
      color="primary"
      style="max-width: 260px;"
      outlined
      dense
    />
    <v-progress-linear
      :active="isLoading"
      :indeterminate="isLoading"
      absolute
      bottom
    ></v-progress-linear>
  </v-app-bar>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";
import axios from "axios";

export default {
  name: "DefaultBar",

  components: {
    DefaultDrawerToggle: () => import("./widgets/DrawerToggle")
  },
  data: () => ({
    semesters: [],
    courses: [],
    isLoading: false
  }),
  mounted() {
    // if (this.courses == this.currCourses) return;
    if (this.semesters.length != 0) return;

    this.getSemesters();
  },
  computed: {
    ...sync("app", ["drawer", "mini"]),
    ...sync("user", ["currSemester", "dark", "isShowMessage", "notifications"]),
    pageName: get("route/name"),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currSemester(newSemester) {
      this.changeSemester(newSemester);
    }
  },
  methods: {
    getCourses(newSemester) {
      if (newSemester == undefined) return;
      this.courses = 0;
      axios
        .get(
          `https://laboratory.binus.ac.id/lapi/api/Binusmaya/GetStudentSubjectsInSemesterWithGroup?semesterId=${newSemester}&binusianNumber=${this.user.User.UserName}`,
          {
            headers: {
              Authorization: `Bearer ${this.user.Token.token}`
            }
          }
        )
        .then(res => {

          this.courses = res.data.filter(e => {
            return e.group !== null && e.group.Status !== "none";
          });

          this.$store.set("user/currCourses", this.courses);
          this.notifications = [];

          if (this.courses.length === 0) {
            this.isShowMessage = true;
          } else {
            this.courses.forEach(course => {
              this.getNotifcations(
                course.group.Group.ClassTransactionId,
                course.group.Group.GroupNumber
              );
            });
          }

        })
        .finally(() => (this.isLoading = false));
    },
    getNotifcations(classId, groupNumber) {
      window.Database.ref(`Notifications/${classId}/${groupNumber}/`).get().then(
        s => {
          if (!s.exists()) return;

          let data = s.val();
          let notif = Object.entries(data).map(n => n[1]);

          if (notif === this.notifications) return;
          this.notifications = [...this.notifications, ...notif]

        }
      );
    },
    getSemesters() {
      axios
        .get("https://laboratory.binus.ac.id/lapi/api/Schedule/GetSemesters")
        .then(r => this.setSemesters(r));
    },
    setSemesters(r) {
      this.semesters = r.data
        .filter(e => {
          return !e.Description.includes("BCA");
        })
        .map(e => {
          return {
            text: e.Description,
            value: e.SemesterId
          };
        });
    },
    changeSemester(newSemester) {
      this.isLoading = true;
      window.Database.ref(
        `Students/${this.user.User.UserName}/currSemester/`
      ).set(newSemester)
      this.getCourses(newSemester);
    },
    toggleTheme() {
      window.Database.ref(`Students/${this.user.User.UserName}/dark`).set(
        !this.$vuetify.theme.dark
      );
    }
  }
};
</script>
