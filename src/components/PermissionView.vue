<template>
  <div class="permissions-container" >
    <div v-for="(permission, username, index) in permissions" class="user-permissions" v-if="renderComponent">
      {{username}}
      <input type="checkbox" id="vod-control" v-model="permission.permissions.vodControl">
      <label for="vod-control">VOD control:</label>

      <input type="checkbox" id="chat" v-model="permission.permissions.chat">
      <label for="chat">Chat:</label>

      <input type="checkbox" id="kick" v-model="permission.permissions.kick">
      <label for="kick">Kick:</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const socketStore = useSocketStore();
const userPermissionsStore = useUsersPermissionsStore();

const permissions: Ref<UserPermissions[]> = ref(userPermissionsStore.usersPermissions);
const renderComponent = ref(true);

watch(permissions, async (changedPermissions) => {
  //send to backend
  userPermissionsStore.usersPermissions = changedPermissions;
  await socketStore.socket.setUsersPermissions(changedPermissions);
  forceRerender();
}, { deep: true });

watch(useUsersPermissionsStore(), (changedPermissions) => {
  forceRerender();
}, { deep: true });

const forceRerender = async () => {
  renderComponent.value = false;
	await nextTick();
  renderComponent.value = true;
};

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
