<template>
  <v-app>
    <v-container fluid style="width:100vw; padding: 0;" class="white">
      <v-row no-gutters>
        <v-col xl="10" align-self="center" md="9" sm="8">
          <v-img src="../assets/bgr.svg" contain />
        </v-col>
        <v-col >
          <v-card
            height="100vh"
            :dark="false"
            absolute
            right
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
              <v-card-subtitle class="text-center">
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
              </v-card-actions>
              <v-alert v-if="isError" type="error">
                {{ errorText }}
              </v-alert>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
          // console.log(r.data);
          this.$session.start();
          this.$session.set("user", JSON.stringify(r.data));
          // let currentUser = JSON.parse(this.$session.get("user"));
          // console.log(currentUser);
          this.$router.push("/");
        })
        .catch((error) => {
          // console.log(error);
          this.isLoading = false;
          this.errTxt = true;
          if (error.status == 401) {
            this.errorText = "Wrong NIM & password combination";
          } else {
            this.errorerrTxtText = "Server under maintenace";
          }
        });
    },
  },
};
</script>
