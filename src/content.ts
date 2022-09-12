import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { STREAMING_PLATFORM, STREAMING_PLATFORM_SUBSTRING } from './streamingPlatform';

var streamingPlatform: string;

if (document.location.href.includes(STREAMING_PLATFORM_SUBSTRING.netflixSubstring)) {
    streamingPlatform = STREAMING_PLATFORM.netflix;
    createVueApp();
}
else if (document.location.href.includes(STREAMING_PLATFORM_SUBSTRING.hboMaxSubstring)) {
    streamingPlatform = STREAMING_PLATFORM.hboMax;
    createVueApp();
}
else if (document.location.href.includes(STREAMING_PLATFORM_SUBSTRING.youTubeSubstring)) {
    streamingPlatform = STREAMING_PLATFORM.youTube;
    createVueApp();
}
else if (document.location.href.includes(STREAMING_PLATFORM_SUBSTRING.disneyPlusSubstring)) {
    streamingPlatform = STREAMING_PLATFORM.disneyPlus;
    createVueApp();
}
else if (document.location.href.includes(STREAMING_PLATFORM_SUBSTRING.amazonPrimeVideoSubstring)) {
    streamingPlatform = STREAMING_PLATFORM.amazonPrimeVideo;
    createVueApp();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === "on video") {
        streamingPlatform = request.streamingPlatform;
        createVueApp();
    }

    sendResponse({});
    return true;
});

function createVueApp() {
    const body = document.querySelector('body');
    const mountElement = document.createElement('div');
    mountElement.className = 'mount-element'
    mountElement.style.position = 'relative';
    body!.appendChild(mountElement);
    const pinia = createPinia();
    const app = createApp(App);
    app.use(pinia);
    app.provide('streamingPlatform', streamingPlatform);
    app.mount('.mount-element');
}
