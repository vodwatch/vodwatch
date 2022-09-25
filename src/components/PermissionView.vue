<template>
  <div class="permissions-container" >
    <div v-for="(permission, username, index) in permissions" :key="username" class="user-permissions">
      {{username}}
      <input type="checkbox" id="vod-control" v-model="permission.permissions.vodControl">
      <label for="vod-control">VOD control:</label>

      <input type="checkbox" id="chat" v-model="permission.permissions.chat">
      <label for="chat">Chat:</label>

      <input type="checkbox" id="kick" v-model="permission.permissions.kick">
      <label for="kick">Kick:</label>
        <button @click="kickUser(String(username))"> Kick </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const props = defineProps({
    isDev: {type: Boolean, required: false},
});

const socketStore = useSocketStore();
const userPermissionsStore = useUsersPermissionsStore();
const permissions: Ref<UserPermissions[]> = ref(userPermissionsStore.usersPermissions);

watch(permissions, (changedPermissions) => {
  console.log(permissions);
  userPermissionsStore.usersPermissions = changedPermissions;
  socketStore.socket.setUsersPermissions(changedPermissions);
}, { deep: true });

const kickUser = async (username: string) => {
    console.log(username);
    await socketStore.socket.kickUser(username);
}

onMounted(() => {
    if (props.isDev) permissions.value = [
        {
            username: 'a',
            permissions: {
                vodControl: true,
                chat: true,
                kick: true,
            }
        },
        {
            username: 'b',
            permissions: {
                vodControl: true,
                chat: true,
                kick: true,
            }
        },
        {
            username: 'me',
            permissions: {
                vodControl: true,
                chat: true,
                kick: true,
            }
        }
    ];
})
</script>

<style scoped>
.permissions-container {
  height: 50vh;
  border-radius: 5px;
  width: 15vw;
}

.user-permissions {
  display: flex;
  gap: 1em
}
</style>
