<template>
    <div>
        <button
            @click="goToPermissions"
            class="go-to-permissions-button">
            <SettingsIcon class="settings-icon"/>
        </button>
    </div>
</template>

<script setup>
import SettingsIcon from "./SettingsIcon.vue";
const emit = defineEmits(['goToPermissions']);
const goToPermissions = () => {
    emit('goToPermissions');
}
</script>

<style scoped>
    .go-to-permissions-button {
        all: unset;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25px;
        width: 25px;
    }

    .settings-icon, .settings-icon:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }

    .settings-icon {
        fill:white !important;
    }

    .settings-icon:hover {
        fill: mediumpurple !important;
    }
</style>
