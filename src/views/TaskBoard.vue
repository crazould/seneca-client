<template lang="">
  <v-container fluid>
    <div class="text-h2">
      {{ currCourse.subject.Subject }}
    </div>

    <v-btn type="info"
      >Create
      {{ subject.Tasks === undefined ? "Backlog" : "Sprint" }}</v-btn
    >

    <v-list v-if="subject.Tasks !== undefined" dense class="mt-5">
      <v-subheader class="display-2">Backlog</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item v-for="(task, index) in subject.Tasks" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ task.Name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  name: "TaskBoard",
  components: {},
  computed: {
    ...sync("user", ["currCourse"]),
  },
  data: () => ({
    subject: {},
  }),
  mounted() {
    this.getSubject();
  },
  methods: {
    getSubject() {
      console.log(this.currCourse.subject.ClassTransactionId);
      window.Database.ref(
        "Subjects/" + this.currCourse.subject.ClassTransactionId
      ).on("value", (s) => {
        this.subject = [];
        const data = s.val();
        console.log(data);
        this.subject = data;
      });
    },
  },
};
</script>
<style lang=""></style>
