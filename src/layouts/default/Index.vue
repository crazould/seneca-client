<template>
  <v-app>
    <default-bar />

    <default-drawer />

    <default-view />
  </v-app>
</template>

<script>
// import { sync } from 'vuex-pathify';
export default {
  name: "DefaultLayout",

  components: {
    DefaultBar: () => import("./AppBar"),
    DefaultDrawer: () => import("./Drawer"),
    DefaultView: () => import("./View")
  },
  computed: {
    // ...sync("user", ["currCourse, dark, currSemester"])
  },
  data: () => ({
    res: false
  }),
  mounted() {
    // let settings = this.$vuetify.theme.options.themeCache.get('vuetify@user')
    // console.log(settings)
    // this.$vuetify.theme.options.themeCache.set('vuetify@user', settings)
    this.initUserData();
      // const user = JSON.parse(this.$session.get("user"));
      // window.Database.ref(
      //   `Students/${user.User.UserName}`
      // ).on("value", s => {
      //   let data = {};
      //   data = Object.assign(data, s.val());
      //   this.$store.set("user/currSemester", data.currSemester);
      //   this.$store.set("user/currCourse", data.currCourse);
      //   if (data.dark == true) {
      //     this.$vuetify.theme.dark = true;
      //   } else {
      //     this.$vuetify.theme.dark = false;
      //   }
      // });
},
  methods: {
    initUserData() {
      const user = JSON.parse(this.$session.get("user"));
      window.Database.ref(
        `Students/${user.User.UserName}`
      ).on("value", s => {
        let data = {};
        data = Object.assign(data, s.val());
        this.$store.set("user/currSemester", data.currSemester);
        console.log(data.currSemester)
        this.$store.set("user/currCourse", data.currCourse);
        if (data.dark == true) {
          this.$vuetify.theme.dark = true;
        } else {
          this.$vuetify.theme.dark = false;
        }
      });
    }
  }
};
</script>
