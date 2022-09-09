<template>
    <div class="permissions-container">
        <div v-for="(userPermission, index) of permissions" :key="index" class="user-permissions">
            {{ userPermission.username }}
          <input type="checkbox" id="vod-control" v-model="userPermission.permissions.vodControl">
          <label for="vod-control">VOD control:</label>

          <input type="checkbox" id="chat" v-model="userPermission.permissions.chat">
          <label for="chat">Chat:</label>

          <input type="checkbox" id="kick" v-model="userPermission.permissions.kick">
          <label for="kick">Kick:</label>
        </div>
        <div>
          {{permissions}}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';

import type { UsersPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';

const socketStore = useSocketStore();

const permissions: Ref<UsersPermissions[]> = ref([]);
watch(permissions, (permissionsChange) => {
  //send to backend
}, { deep: true });
onMounted(async () => {
  // fetch all users in a room and their permissions
  permissions.value = await socketStore.socket.fetchAllUsersInRoom();
})
</script>

<style scoped>
  .permissions-container {
    height: 50vh;
    border-radius: 5px;
    width: 15vw;
  }
  .user-permissions {
    display:flex;
    gap:1em
  }
</style>
