<template>
    <div class="permissions-container" >
        <header class="permissions-header">
            <HideButton
                class="header-hide-button"
                @hideWidget="hideWidget"/>
        </header>
        <div class="permissions-content">
            <div v-for="(permission, username) in permissions" :key="username">
                <div>{{username}}</div>
                <div class="user-permissions">
                    <label for="vod-control">VOD control:</label>
                    <input type="checkbox" id="vod-control" v-model="permission.permissions.vodControl">
                    <label for="chat">Chat:</label>
                    <input type="checkbox" id="chat" v-model="permission.permissions.chat">
                    <label for="kick">Kick:</label>
                    <input type="checkbox" id="kick" v-model="permission.permissions.kick">
                    <button @click="kickUser(String(username))"> X </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HideButton from './HideButton.vue';
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const props = defineProps({
    isDev: {type: Boolean, required: false},
});

const emit = defineEmits(['hideWidget']);

const socketStore = useSocketStore();
const userPermissionsStore = useUsersPermissionsStore();
const permissions: Ref<UserPermissions[]> = ref(userPermissionsStore.usersPermissions);

watch(permissions, (changedPermissions) => {
  userPermissionsStore.usersPermissions = changedPermissions;
  socketStore.socket.setUsersPermissions(changedPermissions);
}, { deep: true });

const kickUser = async (username: string) => {
    await socketStore.socket.kickUser(username);
}

const hideWidget = () => {
    emit('hideWidget');
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
        height: 55vh;
        border-radius: 5px;
        width: 15vw;
        background-color: black;
        color: white;
    }

    .permissions-header {
        display: flex;
        justify-content: right;
        align-items: center;
        height: 5vh;
    }
    .permissions-content {
        width: 15vw;
        height: 50vh;
    }
    .user-permissions {
        display: flex;
        gap: 0.25em
    }
    .header-hide-button {
        padding-right: 1em;
    }
</style>
