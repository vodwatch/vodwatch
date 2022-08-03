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
import {ClientSocketHandler} from "../modules/socket";

const store = useVideoStore();
const emit = defineEmits(['open']);
let roomId: Ref<string> = ref('');
const socket = ref(new ClientSocketHandler(store.videoHandler.video));


function joinRoom() {
  console.log('Join Room');
}

function createRoom() {
  roomId.value = uuid();
  socket.value.openConnection();
  socket.value.createRoom(roomId.value);
  emit('open', socket.value);
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
