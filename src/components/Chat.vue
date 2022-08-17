<template>
  <div class="chat-container">
    <div class="chat-content">
        <div v-for="message of messages" :class="[
            'chat-message',
            {
              'from-outside': message.from !== 'me',
              'from-me': message.from === 'me',
            }
        ]">
          <div class="from">
            {{ message.from }}
          </div>
          <p>
            {{ message.content }}
          </p>
        </div>
    </div>
    <input type="text" v-model = "messageText">
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

interface Message {
  from: String,
  content: String
}

const messages: Ref<Message[]> = ref([
  {
    from: 'xyz',
    content: 'Hey',
  },
  {
    from: 'zyx',
    content: 'Hey back',
  },
  {
    from: 'me',
    content: "It's me",
  },
]);
const messageText: Ref<String> = ref('');

const sendMessage = () => {
  messages.value.push({
    from: 'me',
    content: messageText.value,
  });
  messageText.value = '';
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .chat-container {
    font-weight: bold;
    color: black;
    font-size: 2em;
    background-color: black;
    height: 50vh;
    border-radius: 5px;
  }
  .chat-content {
    display: flex;
    flex-direction: column;
    gap: 1em;
    background-color: white;
  }
  .chat-message {
    display: flex;
    flex-direction: column;
    background-color: aliceblue;
  }
  .from-outside {
    align-self: flex-start;
  }
  .from-me {
    align-self: flex-end;
  }
  .from {
    font-size: 0.25em;
    font-weight: normal;
  }
</style>
