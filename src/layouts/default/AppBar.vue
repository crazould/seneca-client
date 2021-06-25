<template>
  <v-app-bar
    id="default-app-bar"
    app
    absolute
    class="v-bar--underline"
    color="transparent"
    :clipped-left="$vuetify.rtl"
    :clipped-right="!$vuetify.rtl"
    height="70"
    flat
  >
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />

    <default-drawer-toggle class="hidden-sm-and-down" />

    <v-toolbar-title class="font-weight-light text-h5" v-text="name" />

    <v-spacer />

    <v-combobox
      v-model="selectedSemester"
      :items="semesters"
      label="Semester"
      class="mt-8"
      color="secondary"
      style="max-width: 220px"
      outlined
      dense
    />

    <default-notifications />

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
    DefaultAccount: () =>
      import(
        "./widgets/Account"
      ),
    DefaultDrawerToggle: () =>
      import(
        /* webpackChunkName: "default-drawer-toggle" */
        "./widgets/DrawerToggle"
      ),
    DefaultNotifications: () =>
      import(
        /* webpackChunkName: "default-notifications" */
        "./widgets/Notifications"
      ),
  },
  data:() => ({
    semesters: [],
    selectedSemester: null,
  }),
  mounted() {
    this.getSemesters();
  },
  computed: {
    ...sync("app", ["drawer", "mini"]),
    name: get("route/name"),
  },
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
  },
};
</script>
