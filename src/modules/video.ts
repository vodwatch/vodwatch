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
    console.log(video.currentTime);
    console.log(event.type);
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
  };

  getVideo = () => {
    return this.video;
  }

  setSocketHandler = (newSocketHandler: any) => {
    console.log(newSocketHandler);
    this.socketHandler = newSocketHandler;
    //this.socketHandler.openConnection();
  }
}
