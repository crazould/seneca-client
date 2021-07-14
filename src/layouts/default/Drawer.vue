<template>
  <v-navigation-drawer
    id="default-drawer"
    v-model="drawer"
    :dark="dark"
    :right="$vuetify.rtl"
    :mini-variant="mini"
    mini-variant-width="80"
    app
    width="260"
  >
    <div class="px-2">
      <default-drawer-header />
      <v-divider class="mx-3 mb-5" />
      <default-list :items="items" />
    </div>

    <template v-slot:append>
      <div class="px-2">
        <v-list expand nav>
          <v-list-item link style="background-color: #e62e62;" >
            <v-list-item-icon>
              <v-icon class=" align-self-center white--text">
                {{
                  $vuetify.theme.dark
                    ? "mdi-moon-waning-crescent"
                    : "mdi-white-balance-sunny"
                }}</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Dark Mode</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link style="background-color: #e62e62;" >
            <v-list-item-icon>
              <v-icon class=" align-self-center white--text">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";

export default {
  name: "DefaultDrawer",

  components: {
    DefaultDrawerHeader: () => import("./widgets/DrawerHeader"),
    DefaultList: () => import("./List")
  },

  computed: {
    ...get("user", ["dark"]),
    ...get("app", ["items"]),
    ...sync("app", ["drawer", "drawerImage", "mini"])
  }
};
</script>

<style lang="sass">
#default-drawer
  .v-list-item
    margin-bottom: 8px

  .v-list-item::before,
  .v-list-item::after
    display: none

  .v-list-group__header__prepend-icon,
  .v-list-item__icon
    margin-top: 12px
    margin-bottom: 12px
    margin-left: 4px

  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important
</style>
