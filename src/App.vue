<template>
    <div id="app">
      HelloWorld
      <br/>
      {{counter}}
      <button @click="counter += 1"> Click me </button>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type { Ref } from 'vue';

let counter: Ref<number> = ref(0);

onMounted(()=>{
  console.log('HELLOOOOO');
})
</script>

<style scoped>
</style>
