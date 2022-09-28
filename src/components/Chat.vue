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
    <div class="chat-bottom">
        <button @click="sendMessage">Send</button>
        <FontIcon @click="changeFontSize"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import { useSocketStore } from '../stores/socketStore';
import { Message } from '../modules/interfaces/interfaces';
import { useMessageStore } from '../stores/messageStore';
import EmojiPicker from 'vue3-emoji-picker';
import '../../node_modules/vue3-emoji-picker/dist/style.css';
import Popper from 'vue3-popper';
import EmoteIcon from './EmoteIcon.vue';
import FontIcon from './FontIcon.vue';

const props = defineProps({
    isDev: {type: Boolean, required: false},
});

const socketStore = useSocketStore();
const messageStore = useMessageStore();

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
    try {
      socketStore.socket.sendMessage(messageText.value);
    }
    catch (e) {
      console.error(e);
    }
    messageText.value = '';
  }
}

const onSelectEmoji = (emote) => {
  messageText.value += emote.i;
}

const fontSize = inject('fontSize') as any;

const changeFontSize = () => {
  if (fontSize.value === '16px') {
    fontSize.value = '20px';
  }
  else {
    fontSize.value = '16px';
  }
}

onMounted( () => {
    if (props.isDev) messages.value = [
        {
            from: 'a',
            content: 'Hello',
        },
        {
            from: 'b',
            content: 'Hi again'
        },
        {
            from: 'me',
            content: "It's me",
        }
    ];
    console.log(messages.value);
})
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
.chat-bottom {
  display: flex;
  align-items: center;
}
</style>
