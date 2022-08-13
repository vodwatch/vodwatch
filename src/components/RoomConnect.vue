<template>
  <div class="room-connect">
    <input type="text" v-model="roomId" placeholder="Enter room id ...">
    <button @click="joinRoom"> Join Room </button>
    <button @click="createRoom"> Create Room </button>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { ref, defineEmits } from 'vue';
import type { Ref } from 'vue';
import { useVideoStore } from "../stores/videoStore";
import { ClientSocketHandler } from "../modules/socket";
import { useSocketStore } from '../stores/socketStore';
import { videoHandler } from '../modules/video';
import { Socket } from 'socket.io-client';

const videoStore = useVideoStore();
const socketStore = useSocketStore();
const emit = defineEmits(['open']);
let roomId: Ref<string> = ref('');

const joinRoom = () => {
  console.log('Join Room');
  socketStore.socket.openConnection(() => {
    const video = videoStore.videoHandler.getVideo();
    socketStore.socket.setVideo(video);
    videoStore.videoHandler.setSocketHandler(socketStore.socket);
    socketStore.socket.joinRoom(roomId.value);
  });
}

const createRoom = () => {
  console.log("create room clicked");
  console.log(videoStore);
  console.log(socketStore)
  socketStore.socket.openConnection(() => {
    const video = videoStore.videoHandler.getVideo();
    socketStore.socket.setVideo(video);
    videoStore.videoHandler.setSocketHandler(socketStore.socket);
    roomId.value = uuid();
    socketStore.socket.createRoom(roomId.value);
  });

  // emit('open', socket.value);
}
</script>

<style>
.room-connect {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 50vh;
  width: 30vh;
  color: red;
}
</style>
