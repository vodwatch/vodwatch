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
        <RoomConnect v-if="showWidget"></RoomConnect>
    </div>
</template>

<script setup lang="ts">
import RoomConnect from './components/RoomConnect.vue';

import { useVideoStore} from './stores/videoStore';
import {onMounted, Ref, ref} from 'vue';

const store = useVideoStore();

onMounted(()=>{
  store.videoHandler.addVideoEventListeners();
})

let showWidget: Ref<boolean> = ref(true);

const hideOrShowWidget = () => {
  showWidget.value = ! showWidget.value;
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
