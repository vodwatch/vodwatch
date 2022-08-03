import { videoHandler } from "./modules/video";

import { createApp } from 'vue';
import App from './App.vue';

const videoHandlerInstance: videoHandler = new videoHandler();
const substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
    videoHandlerInstance.addVideoEventListeners();
    createVueApp();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === "on video") {
        videoHandlerInstance.addVideoEventListeners();
        createVueApp();
    }
    sendResponse({});
    return true;
});

function createVueApp() {
    createApp(App).mount('body');
}
