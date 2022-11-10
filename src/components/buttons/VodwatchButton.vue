<template>
    <button class="vodwatch-button" :disabled="props.disabled"> {{ props.title }} </button>
</template>

<script setup>
    const props = defineProps({
        title: { type: String, required: true },
        disabled: { type: Boolean, required: false, default: false }
    });
</script>

<style scoped>
    .vodwatch-button {
        all: unset;
        cursor: pointer;
        background-color: mediumpurple;
        color: black;
        font-weight: 500;
        border-radius: 10px;
        padding: 4px 6px 4px 6px;
    }

    .vodwatch-button:hover {
        background-color: #523FAD;
        color: white;
    }

    .vodwatch-button:disabled {
        background-color: darkgray;
        color: black;
        cursor: not-allowed;
    }

    .vodwatch-button, .vodwatch-button:hover {
        transition: background-color 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
    }
</style>
