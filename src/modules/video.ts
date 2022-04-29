import { waitForElementToLoad } from './utils'

const handleVideoEvent = (event: Event) => {
    const video = event.target as HTMLVideoElement
    console.log(video.currentTime);
    console.log(event.type);
}

export const addVideoEventListeners = async () => {
    const video = await waitForElementToLoad('video');
    if (video) {
        video.addEventListener("play", handleVideoEvent);
        video.addEventListener("pause", handleVideoEvent);
        video.addEventListener("seeked", handleVideoEvent);
    }
}