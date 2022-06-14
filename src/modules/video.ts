import { waitForElementToLoad } from "./utils";
import { ClientSocketHandler } from "./socket";

export interface EventInfo {
  event: string;
  currentTime: number;
}

export class videoHandler {

  socketHandler!: ClientSocketHandler

  handleVideoEvent = async (event: Event) => {
    const video = event.target as HTMLVideoElement;
    const eventInfo: EventInfo = {
      event: event.type,
      currentTime: video.currentTime,
    };
    
    if (this.socketHandler.isConnected()) {
      this.socketHandler.sendVideoEvent(eventInfo);
    }
    console.log(video.currentTime);
    console.log(event.type);
  };

  addVideoEventListeners = async () => {
    const video = await waitForElementToLoad("video");
    if (video) {
      video.addEventListener("play", this.handleVideoEvent);
      video.addEventListener("pause", this.handleVideoEvent);
      video.addEventListener("seeked", this.handleVideoEvent);
      this.socketHandler = new ClientSocketHandler();
      this.socketHandler.openConnection();
    }
  };
}
