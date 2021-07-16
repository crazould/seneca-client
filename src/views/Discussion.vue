<template>
  <v-container>
    <chat-window
      :theme="$vuetify.theme.dark == false ? 'light' : 'dark'"
      :current-user-id="user.User.UserName"
      :rooms="rooms"
      :messages="messages"
      :single-room="true"
      :messages-loaded="messagesLoaded"
      :styles="styles"
      :message-actions="messageActions"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      accepted-files="image/png, image/jpeg, application/pdf"
    />
  </v-container>
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { get } from "vuex-pathify";
export default {
  components: {
    ChatWindow
  },
  data() {
    return {
      messagesLoaded: false,
      rooms: [],
      messages: [],
      messageActions: [
        {
          name: "replyMessage",
          title: "Reply"
        }
      ],
      styles: {
        general: {
          color: "#0a0a0a",
          colorSpinner: "#2b3ff0",
          borderStyle: "1px solid #e1e4e8"
        },
        footer: {
          background: "#f8f9fa",
          backgroundReply: "rgba(0, 0, 0, 0.08)"
        },
        icons: {
          search: "#9ca6af"
        }
      },
      lastId: 2
    };
  },
  computed: {
    user: function() {
      return JSON.parse(this.$session.get("user"));
    },
    ...get("user", ["dark", "currCourse"])
  },
  mounted() {
    if(this.currCourse){
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      window.Database.ref(`Rooms/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`).on("value", s => {
        if (s.exists()) {
          let room = s.val();
          this.rooms = [...this.rooms, room];
        } else {
          let users = this.currCourse.group.Group.Students.map(s => {
            return {
              _id: s.StudentNumber,
              username: s.Name
            };
          });
          let room = {
            roomId: `${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}`,
            roomName: `${this.currCourse.subject.Subject} - Group ${this.currCourse.group.Group.GroupNumber}`,
            users
          };
          this.rooms = [...this.rooms, room];
          window.Database.ref(`Rooms/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`).set(room);
        }
      });

      window.Database.ref(`Messages/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`).on("value", s => {
        if(s.exists()){
          console.log("masuk")
          let messages = s.val()
          this.messages = messages
        } else {
          this.messages = []
        }
      })
    },
    async  fetchMessages() {
      this.messagesLoaded = false;
      setTimeout(() => {
        this.messagesLoaded = true;
      }, 200);
    },
    async sendMessage({ content, file, replyMessage }) {

      let [date, timestamp] = this.getDate();
      console.log(date)
      console.log(timestamp)
      const message = {
        _id: this.messages.length,
        senderId: this.user.User.UserName,
        content,
        date,
        timestamp,
        username: this.user.User.Name,
        disableReactions: true
      };

      if (file) {
        message.file = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.localUrl
        };
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId
        };
        if (replyMessage.file) {
          message.replyMessage.file = replyMessage.file;
        }
      }

      window.Database.ref(`Messages/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/${this.messages.length}`).set(message)
      this.messages = [...this.messages, message];

      // room id dari parameter
      // if (file) this.uploadFile({ file, messageId: id, roomId })
    },
    getDate() {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let newDate = new Date();
      let dateNumber = newDate.getDate();
      let month = months[newDate.getMonth()];
      let hour = newDate.getHours()
      let minute = newDate.getMinutes()
      return [`${month} ${dateNumber}`, `${this.zeroPad(hour, 2)}:${this.zeroPad(minute, 2)}`]
    },
    zeroPad(num, pad){
      return String(num).padStart(pad, '0')
    }
  }
};
</script>
