<template>
  <v-container fluid>
    <chat-window
      :height="screenHeight"
      :theme="$vuetify.theme.dark == false ? 'light' : 'dark'"
      :current-user-id="user.User.UserName"
      :rooms="rooms"
      :messages="messages"
      :single-room="true"
      :show-audio="false"
      :messages-loaded="messagesLoaded"
      :message-actions="messageActions"
      @open-file="openFile"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      :styles="styles"
    />
  </v-container>
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { get } from "vuex-pathify";
import { v4 as uuidv4 } from 'uuid';

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
        header: {
          background: '#2b3ff0',
          colorRoomName: '#fff',
          colorRoomInfo: '#fff'
        },
      },
    };
  },
  computed: {
    user: function() {
      return JSON.parse(this.$session.get("user"));
    },
    ...get("user", ["dark", "currCourse"]),
    screenHeight() {
      return this.isDevice ? window.innerHeight + "px" : "calc(100vh - 100px)";
    }
  },
  mounted() {
    if (this.currCourse) {
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      window.Database.ref(
        `Rooms/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`
      ).once("value", s => {
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
          window.Database.ref(
            `Rooms/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`
          ).set(room);
        }
      });

      window.Database.ref(
        `Messages/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/`
      ).on("value", s => {
        if (s.exists()) {
          let messages = s.val();
          this.messages = messages;
          // console.log(this.messages);
        } else {
          this.messages = [];
        }
      });
    },
    async fetchMessages() {
      this.messagesLoaded = false;
      setTimeout(() => {
        this.messagesLoaded = true;
      }, 200);
    },
    async sendMessage({ content, roomId, file, replyMessage }) {
      let [date, timestamp] = this.getDate();
      let messageId = this.messages.length;
      const message = {
        _id: messageId,
        senderId: this.user.User.UserName,
        content,
        date,
        timestamp,
        username: this.user.User.Name,
        disableReactions: true,
        disableActions: false
      };


      if (file) {
        file.name = uuidv4()
        // console.log(file.name)

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

      window.Database.ref(
        `Messages/${this.currCourse.subject.ClassTransactionId}/${this.currCourse.group.Group.GroupNumber}/${messageId}/`
      ).set(message);

      if (file) this.uploadFile({ file, messageId, roomId });

    },
		openFile({ message }) {
			window.open(message.file.url, '_blank')
		},
    async uploadFile({ file, messageId, roomId }) {
      let type = file.extension || file.type;
      if (type === "svg" || type === "pdf") {
        type = file.type;
      }
      let fileName = file.name + "." + type;

      const uploadFileRef = window.StorageRef.child(
        this.user.User.UserName + "/" + roomId + "/" +messageId + "/" + fileName
      );

      const metaData = { contentType: type };

      await uploadFileRef
        .put(file.blob, metaData)
        .then(() => {
        })
        .catch(err => {
          console.log(err);
        });

      const url = await uploadFileRef.getDownloadURL();

      window.Database.ref(`Messages/${roomId}/${messageId}/file/`).set({
        name: file.name,
        size: file.size,
        type: file.extension,
        url
      });
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
      let hour = newDate.getHours();
      let minute = newDate.getMinutes();
      return [
        `${month} ${dateNumber}`,
        `${this.zeroPad(hour, 2)}:${this.zeroPad(minute, 2)}`
      ];
    },
    zeroPad(num, pad) {
      return String(num).padStart(pad, "0");
    }
  }
};
</script>
