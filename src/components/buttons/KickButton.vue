<template>
    <div>
        <button
            class="kick-user-button" :disabled="props.disabled">
            <KickIcon :class="props.disabled ? 'kick-icon-disabled' : 'kick-icon-enabled'"/>
        </button>
    </div>
</template>

<script setup>
import KickIcon from '../icons/KickIcon';

const props = defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<style scoped>
    .kick-user-button {
        all: unset;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
        width: 35px;
    }

    .kick-user-button:disabled {
        cursor: not-allowed;
    }

    .kick-icon-enabled {
        fill:white !important;
    }

    .kick-icon-enabled:hover {
        fill: mediumpurple !important;
        transition: 0.5s;
        animation: kick 1s infinite;
    }

    @keyframes kick {
        0% {
            transform: rotateZ(20deg);
        }
        50% {
            transform: rotateZ(45deg);
        }
        100% {
            transform: rotateZ(20deg);
        }
    }

    .kick-icon-disabled {
        fill: darkgray;
    }

    .kick-icon-enabled, .kick-icon-enabled:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }
</style>
