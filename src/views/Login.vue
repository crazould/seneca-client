<template>
  <v-container fluid>
    <h1>Login Page</h1>
    <button @click="login()">
      Login
    </button>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  methods: {
      login() {
          this.$router.push({path: '/dashboard'})
      }
  }
};
</script>
<style></style>
