import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
    createVueApp();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === "on video") {
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
    app.mount('.mount-element');
}
