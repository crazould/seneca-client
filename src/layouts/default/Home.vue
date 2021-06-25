<template>
  <v-app>
    <!-- <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h3 mb-2">
            Seneca
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-combobox
              v-model="selectedSemester"
              :items="semesters"
              label="Semester"
              outlined
              dense
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="gotoDashboard()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Dashboard
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="gotoProjectBoard()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Project Board
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              logout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <default-bar />

    <default-drawer />

    <!-- <v-app-bar app>
      <v-app-bar-nav-icon @click="toogleDrawer()">
        <v-icon>
          {{ this.drawerIcon }}
        </v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ this.pageTitle }}
      </v-toolbar-title>
    </v-app-bar> -->

    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  components: {
    DefaultBar: () =>
      import(
        /* webpackChunkName: "default-app-bar" */
        "./AppBar"
      ),
    DefaultDrawer: () =>
      import(
        /* webpackChunkName: "default-drawer" */
        "./Drawer"
      ),
  },
  data: () => ({
    drawer: true,
    semesters: [],
    selectedSemester: null,
    pageTitle: "Dashboard",
    drawerIcon: "mdi-menu",
  }),
  mounted() {
    this.getSemesters();
  },
  computed: {},
  methods: {
    getSemesters() {
      axios
        .get("https://laboratory.binus.ac.id/lapi/api/Schedule/GetSemesters")
        .then((r) => this.setSemesters(r));
    },
    setSemesters(r) {
      this.semesters = r.data.map((e) => {
        return {
          text: e.Description,
          value: e.SemesterId,
        };
      });
      this.selectedSemester = this.semesters[0].text;
      this.$store.set("user/currSemesterId", this.semesters[0].value);
      console.log(this.$store.get("user/currSemesterId"));
    },
    logout() {
      this.$session.destroy();
      this.$router.push("/login");
    },
    gotoProjectBoard() {
      this.$router.push("/project-board");
      this.pageTitle = "Project Board";
    },
    gotoDashboard() {
      this.$router.push("/");
      this.pageTitle = "Dashboard";
    },
    toogleDrawer() {
      this.drawer = !this.drawer;
      if (this.drawer) {
        this.drawerIcon = "mdi-dots-vertical";
      } else {
        this.drawerIcon = "mdi-menu";
      }
    },
  },
};
</script>
