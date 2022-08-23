<template>
  <div class="room-connect">
    <input type="text" v-model="roomId" placeholder="Enter room id ...">
    <button @click="joinRoom"> Join Room </button>
    <button @click="createRoom"> Create Room </button>
    <span v-if="createRoomFailed" class="failed"> Failed to create a room. Try Again!</span>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useVideoStore } from "../stores/videoStore";
import { useSocketStore } from '../stores/socketStore';

const emit = defineEmits(['mockSocket']);
const videoStore = useVideoStore();
const socketStore = useSocketStore();
let roomId: Ref<string> = ref('');

const joinRoom = () => {
  socketStore.socket.openConnection(async () => {
    const video = videoStore.videoHandler.getVideo();
    socketStore.socket.setVideo(video);
    videoStore.videoHandler.setSocketHandler(socketStore.socket);
    try {
      await socketStore.socket.joinRoom(roomId.value);
      createRoomFailed.value = false;
      emit('mockSocket', true);
    }
    catch {
      createRoomFailed.value = true;
      emit('mockSocket', false);
    }
  });
  
}
let createRoomFailed: Ref<boolean> = ref(false);

const createRoom = () => {
  socketStore.socket.openConnection(async () => {
    const video = videoStore.videoHandler.getVideo();
    socketStore.socket.setVideo(video);
    videoStore.videoHandler.setSocketHandler(socketStore.socket);
    roomId.value = uuid();
    try {
      await socketStore.socket.createRoom(roomId.value);
      createRoomFailed.value = true;
      emit('mockSocket', true);
      createRoomFailed.value = false;
      console.log(roomId.value);
    }
    catch {
      createRoomFailed.value = true;
      emit('mockSocket', false);
    }
  });
  
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
