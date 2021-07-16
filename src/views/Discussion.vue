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
      rooms: [
        {
          roomId: 1,
          roomName: "room name",
          users: [
            {
              _id: "2201829035",
              username: "John Doe",
              avatar: "../assets/slc-logo.png",
              status: {
                state: "online"
              }
            },
            {
              _id: 1818,
              username: "Gerry lukman",
              avatar: "../assets/slc-logo.png",
              status: {
                state: "online"
              }
            },
            {
              _id: 1234,
              username: "Yohannes",
              avatar: "../assets/slc-logo.png",
              status: {
                state: "offline"
              }
            }
          ]
        }
      ],
      messages: [
        {
          _id: 7890,
          content:
            "Hey, Can you create a topic for our current group project ?",
          senderId: 1234,
          username: "Yohannes",
          disableActions: false,
          disableReactions: true
        },
        {
          _id: 7891,
          content: "Idk, I am busy with my homework right now",
          senderId: "2201829035",
          username: "Aiq the hamster slayer",
          disableActions: false,
          disableReactions: true
        },
        {
          _id: 7892,
          content: "Ada wibu lari",
          senderId: 1818,
          username: "Gerry",
          disableActions: false,
          disableReactions: true
        }
      ],
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
      lastId: 7892
    };
  },
  computed: {
    user: function() {
      return JSON.parse(this.$session.get("user"));
    },
    ...get("user", ["dark", "currCourse"])
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.rooms[0].roomId = this.currCourse.subject.ClassTransactionId;
      this.rooms[0].roomName = `${this.currCourse.subject.Subject} - Group ${this.currCourse.group.Group.GroupNumber}`;
    },
    fetchMessages() {
      this.messagesLoaded = false;
      setTimeout(() => {
        this.messagesLoaded = true;
      });
    },
    async sendMessage({ content, file, replyMessage }) {
      this.lastId++;
      console.log(this.lastId++);

      const message = {
        _id: this.lastId,
        senderId: this.user.User.UserName,
        content,
        username: "Aiq the hamster slayer",
        disableActions: false,
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

      this.messages = [...this.messages, message];
      console.log(this.messages);
      // room id dari parameter
      // if (file) this.uploadFile({ file, messageId: id, roomId })
    }
  }
};
</script>
