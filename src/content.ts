import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import {streamingPlatform, streamingPlatformSubstring} from './streamingPlatform';

if (document.location.href.includes(streamingPlatformSubstring.netflixSubstring)) {
    createVueApp(streamingPlatform.netflix);
}
else if (document.location.href.includes(streamingPlatformSubstring.hboMaxSubstring)) {
    createVueApp(streamingPlatform.hboMax);
}
else if (document.location.href.includes(streamingPlatformSubstring.youTubeSubstring)) {
    createVueApp(streamingPlatform.youTube);
}
else if (document.location.href.includes(streamingPlatformSubstring.disneyPlusSubstring)) {
    createVueApp(streamingPlatform.disneyPlus);
}
else if (document.location.href.includes(streamingPlatformSubstring.amazonPrimeVideoSubstring)) {
    createVueApp(streamingPlatform.amazonPrimeVideo);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === "on video") {
        createVueApp(request.streamingPlatform);
    }

    sendResponse({});
    return true;
});

function createVueApp(streamingPlatform: string) {
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
