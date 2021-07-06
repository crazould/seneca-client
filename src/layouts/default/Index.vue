<template>
  <v-app>
    <default-bar />

    <default-drawer />

    <default-view />
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",

  components: {
    DefaultBar: () => import("./AppBar"),
    DefaultDrawer: () => import("./Drawer"),
    DefaultView: () => import("./View"),
  },
  beforeCreate() {
    // let settings = this.$vuetify.theme.options.themeCache.get('vuetify@user')
    // console.log(settings)
    // this.$vuetify.theme.options.themeCache.set('vuetify@user', settings)
  }
};
</script>
