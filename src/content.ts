import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { STREAMING_PLATFORM, STREAMING_PLATFORM_SUBSTRING } from './streamingPlatform';

let streamingPlatform: string;

switch(true) {
    case hrefIncludesSubstring(STREAMING_PLATFORM_SUBSTRING.netflixSubstring):  
        streamingPlatform = STREAMING_PLATFORM.netflix;
        createVueApp();
        break;
    case hrefIncludesSubstring(STREAMING_PLATFORM_SUBSTRING.youTubeSubstring):
        streamingPlatform = STREAMING_PLATFORM.youTube;
        createVueApp();
        break;
    case hrefIncludesSubstring(STREAMING_PLATFORM_SUBSTRING.hboMaxSubstring):
        streamingPlatform = STREAMING_PLATFORM.hboMax;
        createVueApp();
        break;
    case hrefIncludesSubstring(STREAMING_PLATFORM_SUBSTRING.disneyPlusSubstring):
        streamingPlatform = STREAMING_PLATFORM.disneyPlus;
        createVueApp();
        break;
    case hrefIncludesSubstring(STREAMING_PLATFORM_SUBSTRING.amazonPrimeVideoSubstring):
        streamingPlatform = STREAMING_PLATFORM.amazonPrimeVideo;
        createVueApp();
        break;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === "on video" && request.streamingPlatform !== undefined) {
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

function hrefIncludesSubstring(substring: string) {
    return document.location.href.includes(substring);
}
