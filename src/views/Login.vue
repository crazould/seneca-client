<template>
  <v-app>
    <v-container fluid style="width:100vw; padding: 0;" class="white">
      <v-row no-gutters>
        <v-col
          xl="10"
          class="justify-center align-center d-none d-sm-flex"
          md="9"
          sm="8"
        >
          <v-img
            class="d-none d-sm-flex"
            src="../assets/Data-analyse.svg"
            max-height="800"
            contain
          />
        </v-col>
        <v-col>
          <v-card height="100vh" absolute right :light="true">
            <v-layout
              column
              align-center
              justify-center
              fill-height
              class="mx-5"
              :light="true"
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
                  />
                  <v-text-field
                    outlined
                    dense
                    type="password"
                    name="Password"
                    label="Password"
                    id="Password"
                    required
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="login()"
                  outlined
                  elevation="3"
                  color="primary"
                  :loading="isLoading"
                  @keypress.enter="login()"
                >
                  Login
                </v-btn>
              </v-card-actions>
              <v-alert v-if="isError" type="error" class="text-center">
                {{ errTxt }}
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
    errTxt: ""
  }),
  methods: {
    login() {
      this.isLoading = true;
      this.isError = false;
      axios
        .post("https://laboratory.binus.ac.id/lapi/api/Account/LogOnBinusian", {
          username: this.nim,
          password: this.password
        })
        .then(r => {
          this.$session.start();
          this.$session.set("user", JSON.stringify(r.data));


          window.Database.ref(`Students/${r.data.User.UserName}`).once(
            "value",
            s => {
              let data = {};
              data = Object.assign(data, s.val());

              if (!data.StudentNumber) {
                window.Database.ref(`Students/${r.data.User.Username}`)
                  .set({
                    IsOnline: true,
                    Name: r.data.User.Name,
                    Notifications: false,
                    StudentNumber: r.data.User.Username,
                    dark: false
                  })
                  .then(() => {
                    this.$router.push("/");
                  });
              } else {
                window.Database.ref(`Students/${data.StudentNumber}/IsOnline/`)
                  .set(true)
                  .then(() => {
                    this.$router.push("/");
                  });
              }
            }
          );
        })
        .catch(error => {
          this.isError = true;
          if (error.response && error.response.status == 401) {
            this.errTxt = "Wrong NIM & password combination";
          } else {
            this.errTxt = "Server under maintenace";
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
