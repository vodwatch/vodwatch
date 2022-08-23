<template>
  <div class="chat-container">
    <div class="chat-content">
        <div v-for="message of reversedMessages" :class="[
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
    <input
        type="text"
        v-model="messageText"
        @keyup.enter="sendMessage">
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useSocketStore } from '../stores/socketStore';
import { Message } from '../modules/interfaces/interfaces';
const socketStore = useSocketStore();

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
const reversedMessages = computed(() => {
  let output: Message[] = [];
  for (let i = messages.value.length - 1; i > -1; i--){
    output.push(messages.value[i]);
  }
  return output;
})

const messageText: Ref<string> = ref('');

onMounted(() => {
  socketStore.socket.setChatMessages(messages.value);
})

const sendMessage = () => {
  if (messageText.value !== '') {
    messages.value.push({
      from: 'me',
      content: messageText.value,
    });
    socketStore.socket.sendMessage(messageText.value);
    messageText.value = '';
  }
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
    max-height: 50vh;
    border-radius: 5px;
  }
  .chat-content {
    display: flex;
    flex-direction: column-reverse;
    gap: 1em;
    background-color: white;
    height: 40vh;
    overflow: scroll;
    border-radius: 5px;
  }
  .chat-message {
    display: flex;
    flex-direction: column;
    background-color: aliceblue;
    border-radius: 5px;
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
