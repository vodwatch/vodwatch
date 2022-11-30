<template>
    <div>
        <button
            @click="hideWidget"
            class="hide-widget-button">
            <MinusIcon class="minus-icon"/>
        </button>
    </div>
</template>

<script setup>
    import MinusIcon from "../icons/MinusIcon.vue";
    const emit = defineEmits(['hideWidget']);
    const hideWidget = () => {
        emit('hideWidget');
    }
</script>

<style scoped>
    .hide-widget-button {
        all: unset;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25px;
        width: 25px;
    }

    .minus-icon, .minus-icon:hover {
        transition: fill 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }

    .minus-icon {
        fill:white !important;
    }

    .minus-icon:hover {
        fill: mediumpurple !important;
    }
</style>
