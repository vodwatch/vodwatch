<template>
    <div>
        <button
            class="kick-user-button">
            <KickIcon class="kick-icon"/>
        </button>
    </div>
</template>

<script setup>
import KickIcon from '../icons/KickIcon';
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

    .kick-user-button:hover {
        transition: 0.5s;
        animation: kick 1s infinite;
    }

    .kick-icon {
        fill:white !important;
    }

    .kick-icon:hover {
        fill: mediumpurple !important;
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
    .kick-icon, .kick-icon:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }
</style>
