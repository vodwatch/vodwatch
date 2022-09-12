<template>
    <div id="app">
        <div
            @click="hideOrShowWidget()"
            class="show-widget"
            v-if="showWidget">
          Hide widget.
        </div>
        <div
            @click="hideOrShowWidget()"
            class="show-widget"
            v-else>
          Show widget.
        </div>
        <RoomConnect v-if="showWidget && !isConnected" @mockSocket="mockSocket"></RoomConnect>
        <Chat v-if="showWidget && isConnected"></Chat>
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';
import Chat from './components/Chat.vue';
import { useVideoStore } from './stores/videoStore';
import { useSocketStore } from "./stores/socketStore";
import { onMounted, Ref, ref } from 'vue';

const videoStore = useVideoStore();

onMounted(() => {
  videoStore.videoHandler.addVideoEventListeners();
})

const socketStore = useSocketStore(); // not used for testing, need to add v-if with isConnected method to Chat
// and RoomConnect component

const showWidget: Ref<boolean> = ref(true);

const hideOrShowWidget = () => {
  showWidget.value = ! showWidget.value;
}

const isConnected: Ref<boolean> = ref(false);

const mockSocket = (socketIsConnected : boolean) => {
    isConnected.value = socketIsConnected;
}


</script>

<style>
  #app {
    position:absolute;
    top: 1vh;
    right: 2vw;
    width: 15vw;
  }
  .show-widget {
    text-align: right;
    width: 15vw;
    color: mediumpurple;
    cursor: pointer;
  }
</style>
