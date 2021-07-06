<template lang="">
  <v-container fluid>
    <div class="text-h2">
      {{ currCourse.subject.Subject }}
    </div>

    <v-btn type="info">Create New Phase</v-btn>

    <v-list v-if="group !== null" class="mt-5">
      <v-list-group
        v-for="(phase, i) in group.Phases"
        :value="true"
        :key="i"
        :color="$vuetify.theme.themes.dark.info"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ phase.Name }}</v-list-item-title>
        </template>

        <v-list-group
          v-for="(category, j) in phase.Category"
          :key="j"
          :value="true"
          sub-group
          no-action
          :color="$vuetify.theme.themes.dark.info"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ category.Name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(task, k) in category.Tasks" :key="k">
            <v-list-item-content>
              <v-list-item-title v-text="task.Name"></v-list-item-title>
              <v-list-item-subtitle
                v-text="task.DueDate"
              ></v-list-item-subtitle>

              {{ task.Priority }}
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
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
    group: null,
  }),
  mounted() {
    // this.getSubject();
    this.getGroupDetail();
  },
  methods: {
    getGroupDetail() {
      console.log(this.currCourse.subject.ClassTransactionId);
      console.log(this.currCourse.group.Group.GroupNumber);
      window.Database.ref(
        `Subjects/${this.currCourse.subject.ClassTransactionId}/Groups/${this.currCourse.group.Group.GroupNumber}`
      ).on("value", (s) => {
        this.group = [];
        this.group = s.val();
        console.log(this.group);
      });
    },
    setPhase() {},
  },
};
</script>
<style lang=""></style>
