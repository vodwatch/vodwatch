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
      <Popper v-if="myPermissions.chat">
        <EmoteIcon/>
        <template #content>
          <EmojiPicker @select="onSelectEmoji" />
        </template>
      </Popper>
    </div>
    <div class="chat-bottom">
        <button
            @click="sendMessage"
            :disabled="!myPermissions.chat"
            >
            Send
        </button>
        <FontIcon @click="changeFontSize"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import HideButton from './HideButton.vue';
import GoToPermissionsButton from './GoToPermissionsButton.vue';
import ClipboardIcon from './ClipboardIcon.vue';
import { ref, computed, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import { useSocketStore } from '../stores/socketStore';
import {Message, UserPermissions, Permissions} from '../modules/interfaces/interfaces';
import { useMessageStore } from '../stores/messageStore';
import EmojiPicker from 'vue3-emoji-picker';
import '../../node_modules/vue3-emoji-picker/dist/style.css';
import Popper from 'vue3-popper';
import EmoteIcon from './EmoteIcon.vue';
import FontIcon from './FontIcon.vue';
import {useUsersPermissionsStore} from '../stores/usersPermissionsStore';
import { DEFAULT_FONT_SIZE, INCREASED_FONT_SIZE } from '../utils/const_variables';
import { useClipboard } from '@vueuse/core';

const props = defineProps({
    isDev: {type: Boolean, required: false},
});

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

const sendMessage = () => {

  if (messageText.value !== '' && myPermissions.value.chat) {
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
})
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
        height: 10vh;
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
