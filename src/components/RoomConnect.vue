<template>
    <div class="room-connect">
        <header class="room-connect-header">
            <HideButton
                class="header-hide-button"
                @hideWidget="hideWidget"/>
        </header>
        <div class="room-connect-content">
            <input type="text" v-model="roomId" class="room-id-input"  placeholder="Enter room id ..." maxlength="5">
            <VodwatchButton @click="joinRoom" :title="'Join Room'"/>
            <VodwatchButton @click="createRoom" :title="'Create Room'"/>
            <span v-if="createRoomFailed" class="failed"> Failed to create a room. Try Again!</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import HideButton from './buttons/HideButton.vue';
import VodwatchButton from './buttons/VodwatchButton.vue';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useVideoStore } from '../stores/videoStore';
import { useSocketStore } from '../stores/socketStore';
import { useMessageStore } from '../stores/messageStore';

const emit = defineEmits(['joinRoomSuccess', 'hideWidget']);
const videoStore = useVideoStore();
const socketStore = useSocketStore();
const messageStore = useMessageStore();
let roomId: Ref<string> = ref('');
let createRoomFailed: Ref<boolean> = ref(false);

watch(roomId, (newRoomId) => {
    roomId.value = newRoomId.toUpperCase();
});

const initSocket = () => {
  const video = videoStore.videoHandler.getVideo();
  socketStore.socket.setVideo(video);
  messageStore.messages = [];
  socketStore.socket.setChatMessages(messageStore.messages);
  videoStore.videoHandler.setSocketHandler(socketStore.socket);
};

const joinRoom = () => {
  socketStore.socket.openConnection(async () => {
    initSocket();
    try {
      await socketStore.socket.joinRoom(roomId.value);
      createRoomFailed.value = false;
      socketStore.socket.roomId = roomId.value;
      emit('joinRoomSuccess', true);
      console.log("joined the room!");

    }
    catch {
      createRoomFailed.value = true;
      emit('joinRoomSuccess', false);
      console.log("join room failed!");
    }
  });
};

const createRoom = () => {
  socketStore.socket.openConnection(async () => {
    initSocket();
    try {
      roomId.value = await socketStore.socket.createRoom();
      createRoomFailed.value = false;
      socketStore.socket.roomId = roomId.value;
      emit('joinRoomSuccess', true);
    }
    catch {
      createRoomFailed.value = true;
      emit('joinRoomSuccess', false);
      console.log("create room failed!");
    }
  });
}

const hideWidget = () => {
    emit('hideWidget');
}

</script>

<style scoped>
    .room-connect {
        color: purple;
        background-color: #15202B;
        height: 60vh;
        width: 20vw;
        border-radius: 5px;
        box-shadow:  2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048),
        0 6.5px 5px rgba(0, 0, 0, 0.06),
        0 11.3px 10.9px rgba(0, 0, 0, 0.072),
        0 20.8px 15.4px rgba(0, 0, 0, 0.086),
        0 25px 20px rgba(0, 0, 0, 0.12);
    }

    .room-connect-header {
        display: flex;
        justify-content: right;
        align-items: center;
        height: 5vh;
    }

    .header-hide-button {
        padding-right: 1em;
    }

    .room-connect-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        height: 55vh;
    }

    .failed {
        color: red;
    }

    .room-id-input {
        padding: 4px 8px 4px 8px;
        font-size: 1.2em;
        border-radius: 0.5em;
        text-align: center;
    }

    .room-id-input:focus {
        outline: none !important;
        border: 2px solid mediumpurple;
        border-radius: 0.5em;
        box-shadow: 0 0 10px antiquewhite;
    }
</style>
