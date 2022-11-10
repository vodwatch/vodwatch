<template>
    <div
        id="app"
        :class="showWidget ? 'app-position-when-opened' : 'app-position-when-closed'">
        <div v-if="showWidget">
            <RoomConnect v-if="!isConnected" @joinRoomSuccess="joinRoomSuccess" @hideWidget="hideOrShowWidget"/>
            <Chat v-if="isConnected && !showPermissionView" @hideWidget="hideOrShowWidget" @goToPermissions="changePermissionView" />
            <PermissionView v-if="isConnected && showPermissionView" @hideWidget="hideOrShowWidget" @goBackToChat="changePermissionView"/>
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
const showWidget: Ref<boolean> = ref(false);
const isConnected: Ref<boolean> = ref(false);
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
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

    * {
        font-size: v-bind(fontSize);
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    #app {
        position: fixed;
        z-index: 1000000;
    }

    .app-position-when-opened {
        top: 6vh;
        width: 15vw;
        left: 79vw;
    }

    .app-position-when-closed {
        top: 90vh;
        right: 4vw;
    }

    .minimized-widget {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Fredoka One',serif;
        border-radius: 50%;
        background-color: antiquewhite;
        font-size: 20px;
        height: 40px;
        width: 40px;
        cursor: pointer;
        box-shadow:  1.8px 1.2px rgba(0, 0, 0, 0.034),
        0 3.7px 2.3px rgba(0, 0, 0, 0.048),
        0 3.5px 2px rgba(0, 0, 0, 0.06),
        0 5.3px 5.9px rgba(0, 0, 0, 0.072),
        0 10.8px 7.4px rgba(0, 0, 0, 0.086),
        0 12.5px 10px rgba(0, 0, 0, 0.12);
    }

    .minimized-widget:hover {
        height: 80px;
        width: 80px;
        font-size: 35px;
        margin-right: -20px !important;
        margin-top: -20px !important;
        box-shadow:  2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048),
        0 6.5px 5px rgba(0, 0, 0, 0.06),
        0 11.3px 10.9px rgba(0, 0, 0, 0.072),
        0 20.8px 15.4px rgba(0, 0, 0, 0.086),
        0 25px 20px rgba(0, 0, 0, 0.12);
        animation: hoverOnMinimizedWidget 1s;
    }

    @keyframes hoverOnMinimizedWidget {
        0% {
          transform: scale(0.5);
        }
        50% {
          transform: scale(1.5);
        }
        100% {
          transform: scale(1);
        }
    }


    a:link, a:visited {
        color: white;
        cursor: pointer;
    }

    a:link:active, a:visited:active {
        color: mediumpurple;
    }
</style>
