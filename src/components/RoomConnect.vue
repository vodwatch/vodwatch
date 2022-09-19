<template>
  <div class="room-connect">
    <input type="text" v-model="roomId" placeholder="Enter room id ...">
    <button @click="joinRoom"> Join Room </button>
    <button @click="createRoom"> Create Room </button>
    <span v-if="createRoomFailed" class="failed"> Failed to create a room. Try Again!</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useVideoStore } from "../stores/videoStore";
import { useSocketStore } from '../stores/socketStore';
import { useMessageStore } from '../stores/messageStore';

const emit = defineEmits(['mockSocket']);
const videoStore = useVideoStore();
const socketStore = useSocketStore();
const messageStore = useMessageStore();
let roomId: Ref<string> = ref('');
let createRoomFailed: Ref<boolean> = ref(false);

const initSocket = () => {
    const video = videoStore.videoHandler.getVideo();
    socketStore.socket.setVideo(video);
    socketStore.socket.setChatMessages(messageStore.messages);
    videoStore.videoHandler.setSocketHandler(socketStore.socket);
};

const joinRoom = () => {
  socketStore.socket.openConnection(async () => {
    initSocket();
    try {
      await socketStore.socket.joinRoom(roomId.value);
      createRoomFailed.value = false;
      emit('mockSocket', true);
      console.log("joined the room!");
      
    }
    catch {
      createRoomFailed.value = true;
      emit('mockSocket', false);
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
      emit('mockSocket', true);
      console.log(roomId.value);
    }
    catch {
      createRoomFailed.value = true;
      emit('mockSocket', false);
      console.log("create room failed!");
    }
  });

  if (socketStore.socket.isConnected()){
    createRoomFailed.value = false;
    return;
  }

  createRoomFailed.value = true;
  emit('mockSocket', true);
}
</script>

<style scoped>
.room-connect {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: purple;
  background-color: black;
  height: 50vh;
  border-radius: 5px;
}

.failed {
  color: red;
}
</style>
