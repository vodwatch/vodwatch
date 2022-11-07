<template>
    <div class="permissions-container" >
        <header class="permissions-header">
            <BackToChatButton class="go-back-to-chat-button" @goBackToChat="goBackToChat"/>
            <HideButton
                class="header-hide-button"
                @hideWidget="hideWidget"/>
        </header>
        <div class="permissions-content">
            <div v-for="(permission, username) in permissions" :key="username">
                <div class="username">{{username}} <KickButton @click="kickUser(String(username))" /></div>
                User Permissions:
                <div class="user-permissions">
                    <label for="vod-control">VOD control:</label>
                    <input type="checkbox" id="vod-control" v-model="permission.permissions.vodControl">
                    <label for="chat">Chat:</label>
                    <input type="checkbox" id="chat" v-model="permission.permissions.chat">
                    <label for="kick">Kick:</label>
                    <input type="checkbox" id="kick" v-model="permission.permissions.kick">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HideButton from './buttons/HideButton.vue';
import BackToChatButton from './buttons/BackToChatButton.vue';
import KickButton from './buttons/KickButton.vue';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const emit = defineEmits(['hideWidget', 'goBackToChat']);

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

const goBackToChat = () => {
    emit('goBackToChat');
}
</script>

<style scoped>
    .permissions-container {
        height: 60vh;
        border-radius: 5px;
        width: 20vw;
        background-color: black;
        color: white;
    }

    .permissions-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 5vh;
    }

    .permissions-content {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 20vw;
        height: 55vh;
    }

    .user-permissions {
        display: flex;
        gap: 0.25em
    }

    .header-hide-button {
        padding-left: 5em;
    }

    .go-back-to-chat-button {
        padding-right: 4em;
    }

    .username {
        display: flex;
        align-items: center;
        gap: 3px;
    }
</style>
