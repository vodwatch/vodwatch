<template>
    <div
        id="app"
        :class="showWidget ? 'app-position-when-opened' : 'app-position-when-closed'">
        <label>Dev</label>
        <input type="checkbox" v-model="isDev">
        <div v-if="showWidget">
          <RoomConnect v-if="!isConnected" :is-dev="isDev" @joinRoomSuccess="joinRoomSuccess" @hideWidget="hideOrShowWidget"/>
          <Chat v-if="isConnected && !showPermissionView" :is-dev="isDev" @hideWidget="hideOrShowWidget" @goToPermissions="changePermissionView" />
          <PermissionView v-if="isConnected && showPermissionView" :is-dev="isDev" @hideWidget="hideOrShowWidget" @goBackToChat="changePermissionView"/>
        </div>
        <div v-else class="minimized-widget" @click="hideOrShowWidget">
            V
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
const isConnected: Ref<boolean> = ref(false);
const isDev: Ref<boolean> = ref(false);
const showPermissionView: Ref<boolean> = ref(false);

const hideOrShowWidget = () => {
  showWidget.value = !showWidget.value;
}

const joinRoomSuccess = (socketIsConnected : boolean) => {
  isConnected.value = socketIsConnected;
}

watch(useSocketStore().socket, (changedIsConnected) => {
  if(!changedIsConnected.isConnected()) {
    isConnected.value = false;
  }

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
    position: fixed;
    z-index: 1000000;
  }

  .app-position-when-opened {
    top: 1vh;
    width: 15vw;
    left: 75vw;
  }

  .app-position-when-closed {
    top: 85vh;
    right: 2vw;
  }

  .minimized-widget {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: antiquewhite;
      font-size: 35px;
      height: 80px;
      width: 80px;
      cursor: pointer;
      box-shadow:  2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 6.5px 5px rgba(0, 0, 0, 0.06),
      0 11.3px 10.9px rgba(0, 0, 0, 0.072),
      0 20.8px 15.4px rgba(0, 0, 0, 0.086),
      0 25px 20px rgba(0, 0, 0, 0.12);
  }

  .minimized-widget:hover {
      background-color: #E8D9C6FF;
  }
  .minimized-widget, .minimized-widget:hover {
      transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
  }

  a:link, a:visited {
    color: white;
    cursor: pointer;
  }

  a:link:active, a:visited:active {
    color: mediumpurple;
  }
</style>
