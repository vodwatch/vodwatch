<template>
  <div class="chat-container">
    <header class="chat-header">
        <div
            class="room-id"
            v-if="isRoomId && !copied">
            ROOM ID: {{ socketStore.socket.roomId }}
            <span v-if="copied" style="color: limegreen"> Copied! </span>
            <button v-if="isSupported" class="copy-button" @click="copy(socketStore.socket.roomId as string)">
                <ClipboardIcon class="clipboard-icon"/>
            </button>
        </div>
        <div v-if="copied" class="copied-message">
            Copied!
        </div>
        <div class="navigation-buttons">
            <GoToPermissionsButton @goToPermissions="goToPermissions"/>
            <HideButton class="header-hide-button" @hideWidget="hideWidget"/>
        </div>
    </header>
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
          :disabled="!myPermissions.chat"
          @keyup.enter="sendMessage">
      </textarea>
      <Popper v-if="myPermissions.chat" class="emote-icon">
        <EmoteIcon/>
        <template #content>
          <EmojiPicker @select="onSelectEmoji" />
        </template>
      </Popper>
    </div>
    <div class="chat-bottom">
        <FontIcon @click="changeFontSize"/>
        <button
            class="send-message-button"
            @click="sendMessage"
            :disabled="!myPermissions.chat">
            Send
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import HideButton from './buttons/HideButton.vue';
import GoToPermissionsButton from './buttons/GoToPermissionsButton.vue';
import ClipboardIcon from './icons/ClipboardIcon.vue';
import { ref, computed, inject } from 'vue';
import type { Ref } from 'vue';
import { useSocketStore } from '../stores/socketStore';
import { Message, UserPermissions, Permissions } from '../modules/interfaces/interfaces';
import { useMessageStore } from '../stores/messageStore';
import EmojiPicker from 'vue3-emoji-picker';
import '../../node_modules/vue3-emoji-picker/dist/style.css';
import Popper from 'vue3-popper';
import EmoteIcon from './icons/EmoteIcon.vue';
import FontIcon from './icons/FontIcon.vue';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';
import { DEFAULT_FONT_SIZE, INCREASED_FONT_SIZE } from '../utils/const_variables';
import { useClipboard } from '@vueuse/core';

const emit = defineEmits(['hideWidget', 'goToPermissions']);

const socketStore = useSocketStore();
const messageStore = useMessageStore();

const { isSupported, copy, copied } = useClipboard();

const messages: Ref<Message[]> = ref(messageStore.messages);

const reversedMessages = computed(() => {
  let output: Message[] = [];
  for (let i = messages.value.length - 1; i > -1; i--){
    output.push(messages.value[i]);
  }
  return output;
})

const isRoomId = computed(() => socketStore.socket.roomId !== "");

const messageText: Ref<string> = ref('');

const isMessageTextValidWhenEnter = computed(() => messageText.value.length !== 1 && messageText.value.charCodeAt(0) !== 10);

const sendMessage = () => {
  if (messageText.value !== '' && myPermissions.value.chat && isMessageTextValidWhenEnter.value) {
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

const fontSize = inject('fontSize') as Ref<string>;

const minimizeButtonPadding = computed<string>(() => copied.value ? '7em' : '3em');

const changeFontSize = () => {
  if (fontSize.value === DEFAULT_FONT_SIZE) {
    fontSize.value = INCREASED_FONT_SIZE;
  }
  else {
    fontSize.value = DEFAULT_FONT_SIZE;
  }
}

const hideWidget = () => {
    emit('hideWidget');
}

const goToPermissions = () => {
    emit('goToPermissions');
}

const userPermissionsStore = useUsersPermissionsStore();
const permissions: Ref<UserPermissions[]> = ref(userPermissionsStore.usersPermissions);
const myPermissions = computed<Permissions>(() => permissions.value[socketStore.socket.getMyId()].permissions);
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    .chat-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 5vh;
    }

    .chat-container {
        font-weight: bold;
        color: black;
        font-size: 2em;
        background-color: black;
        max-height: 70vh;
        width: 20vw;
        border-radius: 5px;
        box-shadow:  2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048),
        0 6.5px 5px rgba(0, 0, 0, 0.06),
        0 11.3px 10.9px rgba(0, 0, 0, 0.072),
        0 20.8px 15.4px rgba(0, 0, 0, 0.086),
        0 25px 20px rgba(0, 0, 0, 0.12);
    }

    .chat-content {
        display: flex;
        flex-direction: column-reverse;
        gap: 1em;
        background-color: white;
        height: 50vh;
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
        font-size: 0.65em;
        font-weight: normal;
    }

    .message-input-container {
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
    }

    .from-me > p {
        text-align: right;
    }

    .from-outside > p {
        text-align: left;
    }

    .message-content {
        display:inline-block;
        overflow-wrap: break-word;
        font-size: 1.4em;
        width: 15vw;
        padding: 0 5px 0 5px
    }

    .message-input {
        flex-grow: 1;
        resize:none;
        margin: 0 15px 0 15px;
        border-radius: 5px;
        padding: 4px;
    }

    .message-input:focus {
        outline: none !important;
        border: 2px solid mediumpurple;
        border-radius: 5px;
        box-shadow: 0 0 10px antiquewhite;
    }

    .emote-icon {
        margin: -12px -2px -12px -20px !important;
    }

    .chat-bottom {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 7px;
        height: 6vh;
        margin-right: 7px;
    }

    .send-message-button {
        all: unset;
        cursor: pointer;
        background-color: mediumpurple;
        color: black;
        font-weight: 500;
        border-radius: 5px;
        padding: 4px 6px 4px 6px;
    }

    .send-message-button:hover {
        box-shadow: 0 0 10px lightgray;
    }

    .room-id {
        display: flex;
        gap: 2px;
        color: white;
    }

    .navigation-buttons {
        display: flex;
        gap: 3px;
        padding-left: v-bind(minimizeButtonPadding);
    }

    .copied-message {
        color: limegreen;
    }

    .copy-button {
        all: unset;
        cursor: pointer;
    }

    .clipboard-icon {
        width: 1.2em;
        height: 1.2em;
        fill: white !important;
    }

    .clipboard-icon:hover {
        fill: mediumpurple !important;
    }

    .clipboard-icon, .clipboard-icon:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }
</style>
