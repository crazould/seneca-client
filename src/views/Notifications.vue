<template>
  <v-container>
    <material-card color="secondary" >
      <template #heading >
        <div class="pa-4 white--text text-body-1 font-weight-light">
          <v-icon class="mr-5">
            mdi-bell
          </v-icon>
          Notification
        </div>
      </template>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="notif"
          class="elevation-1 ml-3 mb-10 mr-10 mt-5"
          hide-default-header
        ></v-data-table>
      </v-card-text>
    </material-card>
  </v-container>
</template>

<script>
import { sync } from "vuex-pathify";
export default {
  name: "NotificationsView",

  data: () => ({
    headers: [
      {
        text: "Notification",
        value: "text",
        sortable: false
      }
    ],
    notif: []
  }),
  watch: {
    notifications(val) {
      this.notif = val;
    }
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
          }

          if (notif === this.notifications) return;
          this.notifications.push(...notif);
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
