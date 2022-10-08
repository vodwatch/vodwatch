<template>
    <div id="app">
        <label>Dev</label>
        <input type="checkbox" v-model="isDev">
        <button
            @click="hideOrShowWidget()"
            class="show-widget"
            v-if="showWidget">
          Hide widget.
        </button>
        <button
            @click="hideOrShowWidget()"
            class="show-widget"
            v-else>
          Show widget.
        </button>
        <div v-if="showWidget">
          <RoomConnect v-if="!isConnected" :is-dev="isDev" @joinRoomSuccess="joinRoomSuccess" />
          <Chat v-if="isConnected && !showPermissionView" :is-dev="isDev"/>
          <button
            v-if="isConnected && !showPermissionView" @click="changePermissionView">
            Manage Permissions
          </button>
          <PermissionView v-if="isConnected && showPermissionView" :is-dev="isDev" />
          <button
            v-if="isConnected && showPermissionView" @click="changePermissionView">
            Go back to chat
          </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref, ref, watch, provide } from 'vue';
import RoomConnect from './components/RoomConnect.vue';
import Chat from './components/Chat.vue';
import PermissionView from './components/PermissionView.vue';
import { useVideoStore } from './stores/videoStore';
import { useSocketStore } from './stores/socketStore';
import { DEFAULT_FONT_SIZE } from './utils/const_variables';

const videoStore = useVideoStore();

onMounted(() => {
  videoStore.videoHandler.addVideoEventListeners();
})

const socketStore = useSocketStore();  
const showWidget: Ref<boolean> = ref(true);
const isConnected: Ref<boolean> = ref(useSocketStore().socket.isConnected());
const isDev: Ref<boolean> = ref(false);
const showPermissionView: Ref<boolean> = ref(false);

const hideOrShowWidget = () => {
  showWidget.value = !showWidget.value;
}

const joinRoomSuccess = (socketIsConnected : boolean) => {
  isConnected.value = socketIsConnected;
}

watch(useSocketStore().socket, (changedIsConnected) => {
  isConnected.value = changedIsConnected.isConnected();
}, {deep: true})

socketStore.socket.streamingPlatform = inject('streamingPlatform');

const changePermissionView = () => {
  showPermissionView.value = !showPermissionView.value;
}
const fontSize = ref(DEFAULT_FONT_SIZE);

provide('fontSize', fontSize);
</script>

<style>
  * {
    font-size: v-bind(fontSize);
  }
  #app {
    position:absolute;
    top: 1vh;
    right: 2vw;
    width: 15vw;
    z-index: 1000000;
  }
  .show-widget {
    text-align: right;
    width: 15vw;
  }
  a:link, a:visited {
    color: white;
    cursor: pointer;
  }

  a:link:active, a:visited:active {
    color: mediumpurple;
  }
</style>
