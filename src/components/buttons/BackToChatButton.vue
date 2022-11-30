<template>
    <div>
        <button
            @click="goBackToChat"
            class="go-back-button">
            <LeftArrowIcon class="left-arrow-icon"/>
        </button>
    </div>
</template>

<script setup>
import LeftArrowIcon from "../icons/LeftArrowIcon.vue";

const emit = defineEmits(['goBackToChat'])
const goBackToChat = () => {
    emit('goBackToChat');
}
</script>

<style scoped>
    .go-back-button {
        all: unset;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25px;
        width: 25px;
    }

    .left-arrow-icon {
        fill:white !important;
    }

    .left-arrow-icon:hover {
        fill: mediumpurple !important;
    }

    .left-arrow-icon, .left-arrow-icon:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }
</style>
