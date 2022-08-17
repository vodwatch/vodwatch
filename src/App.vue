<template>
    <div id="app">
        <RoomConnect />
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';

import { useVideoStore} from './stores/videoStore';
import { onMounted, ref } from 'vue';

const store = useVideoStore();

onMounted(()=>{
  store.videoHandler.addVideoEventListeners();
})

</script>

<style>
  #app {
    position:absolute;
    background-color: grey;
  }
</style>
