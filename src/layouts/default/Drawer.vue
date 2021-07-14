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
      <v-list expand nav>
        <v-list-item
          :href="items[0].href"
          :rel="items[0].href ? 'nofollow' : undefined"
          :target="items[0].href ? '_blank' : undefined"
          :to="items[0].to"
          active-class="primary white--text"
          link
          class="py-1"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon v-text="items[0].icon" />
          </v-list-item-icon>

          <v-list-item-content v-if="items[0].title">
            <v-list-item-title v-text="items[0].title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :href="items[1].href"
          :rel="items[1].href ? 'nofollow' : undefined"
          :target="items[1].href ? '_blank' : undefined"
          :to="items[1].to"
          active-class="primary white--text"
          link
          class="py-1"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <v-list-item-icon class="my-2 align-self-center">
            <v-icon v-text="items[1].icon" />
          </v-list-item-icon>

          <v-list-item-content v-if="items[1].title">
            <v-list-item-title v-text="items[1].title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :href="items[2].href"
          :rel="items[2].href ? 'nofollow' : undefined"
          :target="items[2].href ? '_blank' : undefined"
          :to="items[2].to"
          active-class="primary white--text"
          link
          class="py-1"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <v-list-item-icon class="my-2 align-self-center">
              <v-badge bordered color="accent" overlap :value="notifications.length">
                <template v-slot:badge>
                  <span>{{ notifications.length }}</span>
                </template>
                <v-icon>mdi-bell</v-icon>
              </v-badge>
          </v-list-item-icon>

          <v-list-item-content v-if="items[2].title">
            <v-list-item-title v-text="items[2].title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <template v-slot:append>
      <div class="px-2">
        <v-list expand nav>
          <v-list-item
            link
            style="background-color: #e62e62;"
            @click="toggleTheme()"
          >
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
              <v-list-item-title class="white--text">{{
                $vuetify.theme.dark ? "Dark Mode" : "Light Mode"
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            @click="logout()"
            link
            style="background-color: #e62e62;"
          >
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
    DefaultDrawerHeader: () => import("./widgets/DrawerHeader")
  },
  data: () => ({
  }),
  computed: {
    ...sync("user", ["dark", "notifications"]),
    ...get("app", ["items"]),
    ...sync("app", ["drawer", "drawerImage", "mini"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  methods: {
    toggleTheme() {
      window.Database.ref(`Students/${this.user.User.UserName}/dark`).set(
        !this.$vuetify.theme.dark
      );
    },
    logout() {
      window.Database.ref(`Students/${this.user.User.UserName}/IsOnline/`)
        .set(false)
        .then(() => {
          this.$session.destroy();
          this.$router.push("/login");
        });
    }
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
