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
                <v-card-title width="100%" class="text-h1 mb-2">
                  Seneca
                </v-card-title>
                <v-card-subtitle>
                  Laboratory Project Management Tool
                </v-card-subtitle>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      outlined
                      dense
                      name="NIM"
                      label="NIM"
                      id="NIM"
                      type="text"
                      required
                      v-model="nim"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      dense
                      type="password"
                      name="Password"
                      label="Password"
                      id="Password"
                      required
                      v-model="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    @click="login()"
                    outlined
                    elevation="2"
                    tile
                    :loading="isLoading"
                    @keypress.enter="login()"
                  >
                    Login
                  </v-btn>
                  <!-- </v-layout> -->
                </v-card-actions>
                <v-alert v-if="isError" type="error">
                  {{ errorText }}
                </v-alert>
              </v-layout>
            </v-card>
          </v-layout>
        </v-img>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data: () => ({
    password: "",
    nim: "",
    isError: false,
    isLoading: false,
    errTxt: "",
  }),
  methods: {
    login() {
      this.isLoading = true;
      this.isError = false;

      axios
        .post("https://laboratory.binus.ac.id/lapi/api/Account/LogOnBinusian", {
          username: this.nim,
          password: this.password,
        })
        .then((r) => {
          this.isLoading = false;
          console.log(r.data);
          this.$session.start();
          // this.$session.set("user", JSON.stringify(data.user));
          // this.$router.push("/admin-home");

          this.$router.push("/");
        })
        .catch((error) => {
          // console.log(error);
          this.isLoading = false;
          this.errTxt = true;
          if (error.response.status == 401) {
            this.errorText = "Wrong NIM & password combination";
          } else {
            this.errorerrTxtText = "Server under maintenace";
          }
        });
    },
  },
};
</script>
