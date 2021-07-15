<template>
  <v-menu bottom left min-width="200" offset-y origin="top right">
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        @click="logout()"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-menu>
</template>

<script>
import axios from "axios";
export default {
  name: "DefaultAccount",
  data: () => ({}),
  methods: {
    logout() {
      const user = JSON.parse(this.$session.get("user"));
      window.Database.ref(`Students/${user.User.UserName}/IsOnline/`)
        .set(false)
        .then(() => {
          this.$session.destroy();
          this.$router.push("/login");
        });
    }
  }
};
</script>
