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
    <v-combobox
      v-model="currSemester"
      :items="semesters"
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
    semesters: []
  }),
  mounted() {
    this.getSemesters();
  },
  computed: {
    ...sync("app", ["drawer", "mini"]),
    ...sync("user", ["currSemester", "dark"]),
    pageName: get("route/name"),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currSemester(newSemester) {
      // console.log(newSemester);
      window.Database.ref(
        `Students/${this.user.User.UserName}/currSemester/`
      ).set(newSemester);
    }
  },
  methods: {
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
    toggleTheme() {
      window.Database.ref(`Students/${this.user.User.UserName}/dark`).set(
        !this.$vuetify.theme.dark
      );
    }
  }
};
</script>
