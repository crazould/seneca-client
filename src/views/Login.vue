<template>
  <v-app>
    <v-main>
      <v-card>
        <v-img src="../assets/bgr.webp" height="100vh">
          <v-layout justify-end>
            <v-card max-width="380px" width="380px" height="100vh">
                <v-card-title class="display-1 text-center" width="100%">
                  Seneca
                </v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      name="NIM"
                      label="NIM"
                      id="NIM"
                    ></v-text-field>
                    <v-text-field
                      name="Password"
                      label="Password"
                      id="Password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-layout justify-center>
                    <v-btn @click="login()">
                      Login
                    </v-btn>
                  </v-layout>
                </v-card-actions>
            </v-card>
          </v-layout>
        </v-img>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  methods: {
    login() {
      this.$router.push({ path: "/dashboard" });
    },
  },
};
</script>
<style></style>
