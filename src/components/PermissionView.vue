<template>
    <div class="permissions-container" >
        <header class="permissions-header">
            <BackToChatButton class="go-back-to-chat-button" @goBackToChat="goBackToChat" />
            <HideButton
                class="header-hide-button"
                @hideWidget="hideWidget"/>
        </header>
        <div class="permissions-content">
            <div v-for="(permission, username) in permissions" :key="username">
                <div class="username">
                    {{username}}
                    <KickButton @click="kickUser(String(username))" :disabled="!isAdmin"/>
                </div>
                User Permissions:
                <div class="user-permissions">
                    <label for="vod-control">Video control:</label>
                    <input type="checkbox" id="vod-control" v-model="permission.permissions.vodControl" :disabled="!isAdmin">
                    <label for="chat">Chat:</label>
                    <input type="checkbox" id="chat" v-model="permission.permissions.chat" :disabled="!isAdmin">
                    <label for="kick">Kick:</label>
                    <input type="checkbox" id="kick" v-model="permission.permissions.kick" :disabled="!isAdmin">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HideButton from './buttons/HideButton.vue';
import BackToChatButton from './buttons/BackToChatButton.vue';
import KickButton from './buttons/KickButton.vue';
import {inject, ref, watch} from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const emit = defineEmits(['hideWidget', 'goBackToChat']);

const socketStore = useSocketStore();
const userPermissionsStore = useUsersPermissionsStore();
const permissions: Ref<UserPermissions[]> = ref(userPermissionsStore.usersPermissions);
const isAdmin = inject<Ref<boolean>>('isAdmin');

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
        background-color: #15202B;
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
        gap: 2em;
    }

    .user-permissions {
        display: flex;
        gap: 0.25em
    }

    .user-permissions > input:disabled {
        cursor: not-allowed;
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
