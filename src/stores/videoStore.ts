import { defineStore } from "pinia";

import { videoHandler } from "../modules/video";

export const useVideoStore = defineStore("video", {
    state: () => {
        return {
            videoHandler: new videoHandler() as videoHandler,
        };
    },
});
