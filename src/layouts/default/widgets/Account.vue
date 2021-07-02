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
export default {
  name: "DefaultAccount",
  data: () => ({}),
  methods: {
    logout() {
      this.$session.destroy();
      this.$router.push("/login");
    },
  },
};
</script>
