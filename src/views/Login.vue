<template>
  <v-app>
    <v-main>
      <v-card>
        <v-img src="../assets/bgr.webp" height="100vh">
          <v-layout justify-end>
            <v-card
              max-width="380px"
              width="380px"
              height="100vh"
              :dark="false"
            >
              <v-layout
                column
                align-center
                justify-center
                fill-height
                class="mx-5"
              >
                <v-card-title width="100%" class="text-h2 mb-2">
                  Seneca
                </v-card-title>
                <v-card-subtitle>
                  Laboratory Project Management Tool
                </v-card-subtitle>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      clearable
                      outlined
                      dense
                      name="NIM"
                      label="NIM"
                      id="NIM"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      clearable
                      outlined
                      dense
                      type="password"
                      name="Password"
                      label="Password"
                      id="Password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-layout justify-center>
                    <v-btn @click="login()" outlined tile>
                      Login
                    </v-btn>
                  </v-layout>
                </v-card-actions>
              </v-layout>
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
      this.$router.push({ path: "/" });
    },
  },
};
</script>
<style></style>
