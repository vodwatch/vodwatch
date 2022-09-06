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
        <p class="message-content">
          {{ message.content }}
        </p>
      </div>
    </div>
    <div class="message-input-container">
      <textarea
          class="message-input"
          type="text"
          v-model="messageText"
          @keyup.enter="sendMessage">
      </textarea>
      <Popper>
        <EmoteIcon/>
        <template #content>
          <EmojiPicker @select="onSelectEmoji" />
        </template>
      </Popper>
    </div>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useSocketStore } from '../stores/socketStore';
import { Message } from '../modules/interfaces/interfaces';
import { useMessageStore } from '../stores/messageStore';
const socketStore = useSocketStore();
const messageStore = useMessageStore();

import EmojiPicker from 'vue3-emoji-picker';
import '../../node_modules/vue3-emoji-picker/dist/style.css';
import Popper from 'vue3-popper';
import EmoteIcon from './EmoteIcon.vue';

const messages: Ref<Message[]> = ref(messageStore.messages);
const reversedMessages = computed(() => {
  let output: Message[] = [];
  for (let i = messages.value.length - 1; i > -1; i--){
    output.push(messages.value[i]);
  }
  return output;
})

const messageText: Ref<string> = ref('');

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

const onSelectEmoji = (emote) => {
  messageText.value += emote.i;
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
.message-input-container {
  display:flex;
  justify-content: center;
  align-items: center;
}
.message-content {
  display:inline-block;
  overflow-wrap: break-word;
  max-width: 5vw;
}
.message-input {
  resize:none;
}
</style>
