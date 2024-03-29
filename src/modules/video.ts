import { waitForElementToLoad } from "./services/VideoElementService";
import { ClientSocketHandler } from "./socket";

export interface EventInfo {
    event: string;
    currentTime: number;
}

export class videoHandler {
    socketHandler!: ClientSocketHandler;
    video!: HTMLVideoElement;

    handleVideoEvent = async (event: Event) => {
        const video = event.target as HTMLVideoElement;
        const eventInfo: EventInfo = {
            event: event.type,
            currentTime: video.currentTime,
        };

        this.socketHandler.sendVideoEvent(eventInfo);
    };

    addVideoEventListeners = async () => {
        this.video = (await waitForElementToLoad("video")) as HTMLVideoElement;
        if (this.video) {
            this.addEventListeners();
        }
    };

    addEventListeners = () => {
        this.video.addEventListener("play", this.handleVideoEvent);
        this.video.addEventListener("pause", this.handleVideoEvent);
        this.video.addEventListener("seeked", this.handleVideoEvent);
        
        this.video.addEventListener("timeupdate", () => {
            if (!this.video.seeking && this.socketHandler) {
                this.socketHandler.supposedCurrentTime = this.video.currentTime;
            }
        });
    };

    getVideo = () => {
        return this.video;
    };

    setSocketHandler = (newSocketHandler: any) => {
        this.socketHandler = newSocketHandler;
    };
}
