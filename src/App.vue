<template>
    <div id="app">
        <label>Dev</label>
        <input type="checkbox" v-model="isDev">
        <a
            href="#"
            @click="hideOrShowWidget()"
            class="show-widget"
            v-if="showWidget">
          Hide widget.
        </a>
        <a
            href="#"
            @click="hideOrShowWidget()"
            class="show-widget"
            v-else>
          Show widget.
        </a>
        <div v-if="showWidget">
          <RoomConnect v-if="!isConnected" :is-dev="isDev" @joinRoomSuccess="joinRoomSuccess" />
          <Chat v-if="isConnected && !showPermissionView" :is-dev="isDev"/>
          <a href="#"
            v-if="isConnected && !showPermissionView" @click="changePermissionView">
            Manage Permissions
          </a>
          <PermissionView v-if="isConnected && showPermissionView" :is-dev="isDev" />
          <a href="#"
            v-if="isConnected && showPermissionView" @click="changePermissionView">
            Go back to chat
          </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';
import Chat from './components/Chat.vue';
import PermissionView from './components/PermissionView.vue';
import { useVideoStore } from './stores/videoStore';
import { useSocketStore } from "./stores/socketStore";
import { inject, onMounted, Ref, ref } from 'vue';

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

socketStore.socket.streamingPlatform = inject('streamingPlatform');

const changePermissionView = () => {
  showPermissionView.value = !showPermissionView.value;
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
  }
  a:link, a:visited {
    color: white;
    cursor: pointer;
  }

  a:link:active, a:visited:active {
    color: mediumpurple;
  }
</style>
