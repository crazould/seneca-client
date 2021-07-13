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
      color="secondary"
      style="max-width: 240px"
      outlined
      dense
    />
    <default-notifications />
    <v-menu bottom left min-width="200" offset-y origin="top right">
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          @click="toggleTheme()"
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            {{
              $vuetify.theme.dark
                ? "mdi-moon-waning-crescent"
                : "mdi-white-balance-sunny"
            }}
          </v-icon>
        </v-btn>
      </template>
    </v-menu>

    <default-account />

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
    DefaultAccount: () => import("./widgets/Account"),
    DefaultDrawerToggle: () => import("./widgets/DrawerToggle"),
    DefaultNotifications: () => import("./widgets/Notifications")
  },
  data: () => ({
    semesters: [],
    courses: [],
    isLoading: false,

  }),
  mounted() {
    if(this.courses == this.currCourses) return
    this.getSemesters();

  },
  computed: {
    ...sync("app", ["drawer", "mini"]),
    ...sync("user", ["currSemester", "dark", "isShowMessage", "u"]),
    pageName: get("route/name"),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currSemester(newSemester) {
      // console.log(newSemester);
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

          if(this.courses.length === 0){
            this.isShowMessage = true;
          }

        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
    getSemesters() {
      axios
        .get("https://laboratory.binus.ac.id/lapi/api/Schedule/GetSemesters")
        .then(r => this.setSemesters(r));
    },
    setSemesters(r) {
      this.semesters = r.data;
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
      ).set(newSemester);
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
