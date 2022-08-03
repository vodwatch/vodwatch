<template>
    <div id="app">
        <RoomConnect @open="openSocketConnection(socket)"></RoomConnect>
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';

import { useVideoStore} from './stores/videoStore';
import { onMounted, ref } from 'vue';

const socket = ref(null);

const store = useVideoStore();

onMounted(()=>{
  store.videoHandler.addVideoEventListeners();
})

function openSocketConnection(newSocketValue: any) {
  console.log(newSocketValue);
  socket.value = newSocketValue;
  store.videoHandler.addSocketToVideoHandler(socket.value);
}
</script>

<style>
  #app {
    position:absolute;
    background-color: grey;
  }
</style>
