<template>
    <div id="app">
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
        <RoomConnect v-if="showWidget && !isConnected" @mockSocket="mockSocket"></RoomConnect>
        <Chat v-if="showWidget && isConnected && !permissionViewToggle"></Chat>
        <a href="#"
          v-if="showWidget && isConnected && !permissionViewToggle" @click="changePermissionView">
          Manage Permissions
        </a>
        <PermissionView v-if="showWidget && permissionViewToggle"/>
        <a href="#"
           v-if="showWidget && isConnected && permissionViewToggle" @click="changePermissionView">
          Go back to chat
        </a>
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';
import Chat from './components/Chat.vue';
import PermissionView from './components/PermissionView.vue';
import { useVideoStore } from './stores/videoStore';
import { onMounted, Ref, ref } from 'vue';

const videoStore = useVideoStore();

onMounted(() => {
  videoStore.videoHandler.addVideoEventListeners();
})

 // const socketStore = useSocketStore();  //not used for testing, need to add v-if with isConnected method to Chat
// and RoomConnect component

const showWidget: Ref<boolean> = ref(true);

const hideOrShowWidget = () => {
  showWidget.value = ! showWidget.value;
}

const isConnected: Ref<boolean> = ref(false);

const mockSocket = (socketIsConnected : boolean) => {
    isConnected.value = socketIsConnected;
}


const permissionViewToggle: Ref<boolean> = ref(false);
const changePermissionView = () => {
  permissionViewToggle.value = !permissionViewToggle.value;
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
