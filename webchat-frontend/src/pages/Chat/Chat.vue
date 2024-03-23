<template>
  <Wrapper>
    <div class="chat">
      <header class="header">
        <Logo class="logo"></Logo>
        <router-link to="/login">
          <button class="settings" @click="handleLogout">
            <font-awesome-icon
              icon="fa-solid fa-right-from-bracket"
              class="logout"
            />
          </button>
        </router-link>
      </header>
      <div class="content" id="content" ref="block">
        <div class="log">{{ log }}</div>
        <Message
          v-for="(message, idx) in messages"
          :key="idx"
          :message="message"
          @editMessage="fetchMessages"
          @deleteMessage="fetchMessages"
        />
      </div>
      <div class="typing-area">
        <Input
          v-model="message"
          class="typing-area-input"
          type="text"
          placeholder="Start typing"
        />
        <button class="send-button">
          <font-awesome-icon
            icon="fa-solid fa-paper-plane"
            size="2xl"
            @click.stop="addNewMessage"
          />
        </button>
      </div>
    </div>
    <Transition name="fade">
      <p v-if="error" class="error-window">{{ error }}</p>
    </Transition>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from "@/components/Wrapper/Wrapper.vue";
import Logo from "@/components/Logo/Logo.vue";
import Input from "@/components/Input/Input.vue";
import Message from "@/components/Message/Message.vue";
import { removeSessionFromStorage } from "@/helpers/tokens";
import { getUserFromStorage, removeUserFromStorage } from "@/helpers/user";
import router from "@/router";
import { addMessage } from "@/api/message";

export interface IMessage {
  id: string;
  user_id: string;
  content: string;
  user_name: string;
  created_at: string;
}

import { ref, onMounted } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const roomId = "ChatRoom";
const message = ref("");
const messages = ref([]);
const log = ref("");
const block = ref(null);
const error = ref("");

onMounted(() => {
  socket.on("connect", () => {
    console.log("Connected to socket.io");
    socket.emit("connection", {
      id: roomId,
      channel: "MessagesChannel",
    });
  });

  socket.on("onmessage", (data) => {
    console.log("RECV");
    console.log(data);
    if (data.message.type === "create") {
      messages.value.push(data.message.data);
    }
    if (
      data.message.type === "connection" ||
      data.message.type === "destroy" ||
      data.message.type === "update"
    ) {
      fetchMessages(data.message.data);
    }
    console.log("end");
  });
});

function handleLogout() {
  removeSessionFromStorage();
  removeUserFromStorage();
  socket.close();
  router.push("/login");
}

function scrollDown() {
  setTimeout(() => {
    let div = block.value;
    if (div) {
      div.scrollTop = div.scrollHeight - div.clientHeight;
    }
  }, 300);
}

async function addNewMessage() {
  const user = JSON.parse(getUserFromStorage());
  try {
    console.log(message.value);
    await addMessage(user.id, user.name, message.value);
    message.value = "";
    scrollDown();
    console.log("scroll");
  } catch (e) {
    error.value = "Something went wrong. Please try again";
    setTimeout(() => (error.value = ""), 3000);
  }
}

function fetchMessages(data) {
  console.log('fetch');
  messages.value = data;
  console.log(messages.value);
  scrollDown();
}
</script>

<style lang="scss" scoped>
.chat {
  max-width: 1000px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin: 0 auto;
  border-radius: 15px;

  .header {
    max-width: 100%;
    height: 50px;
    padding: 10px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .users {
      font-weight: bold;
    }

    .settings {
      height: fit-content;
      background-color: #ffffff;
      outline: none;
      border: none;
      cursor: pointer;
      font-size: 30px;
      font-weight: bold;
      &:hover {
        color: #0650d0;
      }
    }
  }

  .content {
    max-width: 100%;
    height: 100%;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    overflow: auto;

    .log {
      width: fit-content;
      height: 50px;
      margin: 0 auto;
      margin-top: 10px;
    }
  }

  .content::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .typing-area {
    max-width: 100%;
    height: 78.6px;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 0 15px;

    .input {
      width: 100%;
      height: 40px;
    }

    .send-button {
      background-color: #ffffff;
      width: fit-content;
      height: fit-content;
      border: none;
      cursor: pointer;

      .fa-paper-plane {
        &:hover {
          color: #0650d0;
        }
      }
    }
  }
}
</style>