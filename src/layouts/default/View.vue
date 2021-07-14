<template>
  <v-main>
    <v-container fluid>
      <v-fade-transition mode="out-in">
        <router-view :key="$route.path" />
      </v-fade-transition>
      <v-snackbar transition="scroll-y-reverse-transition"  class="mb-5 " v-model="isShowMessage" timeout="-1">
        You don't have any project or you haven't create any group.
        <template v-slot:action="{ attrs }">
          <v-btn
            color="error"
            text
            v-bind="attrs"
            @click="isShowMessage = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "DefaultView",
  computed: {
    ...sync("user", ["isShowMessage"])
  }
};
</script>
