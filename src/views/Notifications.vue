<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="notif"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";
export default {
  name: "NotificationsView",

  data: () => ({
    headers: [
      {
        text: "Notifications",
        value: "text",
        sortable: false
      }
    ],
    notif: []
  }),
  watch: {
    notifications(val) {
      this.notif = val;
    },
  },
  computed: {
    ...sync("user", ["dark", "notifications", "currCourses"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  mounted() {
    this.notifications = [];
    if (this.currCourses.length != 0) {
      this.currCourses.forEach(course => {
        this.getNotifcations(
          course.group.Group.ClassTransactionId,
          course.group.Group.GroupNumber
        );
      });
    }
  },
  methods: {
    getNotifcations(classId, groupNumber) {
      window.Database.ref(`Notifications/${classId}/${groupNumber}/`).once(
        "value",
        s => {
          let data = s.val();
          if (data == null) return;

          let notif = [];

          for (let key in data) {
            this.readNotifications(classId, groupNumber, key);
            notif.push(data[key]);
            // notif == [...notif, data[key]]
          }

          if (notif === this.notifications) return;
          this.notifications.push(...notif);
          // this.notifications = [...this.notifications, ...notif]
          this.notifications.map(r => {
            if (r.isViewed) {
              r.isViewed[this.user.User.UserName] = true;
              return {
                text: r.text,
                isViewed: r.isViewed
              };
            }
            return {
              text: r.text
            };
          });
          this.notifications = this.notifications.reverse();
        }
      );
    },
    readNotifications(classId, groupNumber, notifId) {
      window.Database.ref(
        `Notifications/${classId}/${groupNumber}/${notifId}/isViewed/${this.user.User.UserName}/`
      ).set(true);
    }
  }
};
</script>
