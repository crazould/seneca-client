<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
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
            dense/>
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
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Seneca</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: "Home",
  components: {},
  data: () => ({
    drawer: null,
    semesters: [],
    selectedSemester: null,
  }),
  mounted() {
    axios
      .get("https://laboratory.binus.ac.id/lapi/api/Schedule/GetSemesters")
      .then((data) => {
        let semesters = data.data
        this.semesters = semesters.map((e) => e.Description)
        this.selectedSemester = this.semesters[0]
      });
  },
  methods: {
    logout() {
      this.$router.push({ path: "/login" });
    },
    gotoProjectBoard() {
      this.$router.push({ path: "/project-board" });
    },
  },
};
</script>
