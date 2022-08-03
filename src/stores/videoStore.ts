import { defineStore } from 'pinia';

import { videoHandler } from "../modules/video";

export const useVideoStore = defineStore('video', {
    state: () => ({
        videoHandler: new videoHandler() as videoHandler,
    })
})
