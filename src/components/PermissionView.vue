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
import BackToChatButton from './BackToChatButton.vue';
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';

import type { UserPermissions } from "../modules/interfaces/interfaces";
import { useSocketStore } from '../stores/socketStore';
import { useUsersPermissionsStore } from '../stores/usersPermissionsStore';

const props = defineProps({
    isDev: {type: Boolean, required: false},
});

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
</style>
