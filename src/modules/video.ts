import { waitForElementToLoad } from "./utils";
import { ClientSocketHandler } from "./socket";
import { updateStatusPanel } from "./popup";

export interface EventInfo {
  event: string;
  currentTime: number;
}

export class videoHandler {
  socketHandler!: ClientSocketHandler;
  seek: boolean = false;
  lastEventTime!: number;

  handleVideoEvent = async (event: Event) => {
    const video = event.target as HTMLVideoElement;
    const eventInfo: EventInfo = {
      event: event.type,
      currentTime: video.currentTime,
    };
    
    if(event.type === "seeked") {
      // const playCode = `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
      // const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
      // player.play();`;
      // document.documentElement.setAttribute(
      //     "onreset",
      //     playCode
      // );
      // document.documentElement.dispatchEvent(
      //     new CustomEvent("reset")
      // );
    }

    console.log("EVENTINFO: ", eventInfo);
    this.socketHandler.sendVideoEvent(eventInfo);
    
    console.log(video.currentTime);
    console.log(event.type);
    this.lastEventTime = video.currentTime;
  };

  addVideoEventListeners = async () => {
    const video = (await waitForElementToLoad("video")) as HTMLVideoElement;
    if (video) {
      this.addEventListeners(video);
      this.socketHandler = new ClientSocketHandler(video);
      this.socketHandler.openConnection();
      this.addPopupButtonHandlers();
    }
  };

  addEventListeners = (video: Element) => {
    video.addEventListener("play", this.handleVideoEvent);
    video.addEventListener("pause", this.handleVideoEvent);
    video.addEventListener("seeked", this.handleVideoEvent);
  };

  addMessageToPopup(text: string) {
    chrome.runtime.sendMessage({
      message: "popup_message",
      text: text,
    });
  }

  addPopupButtonHandlers = () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const a = async () => {
        if (request.message === "join") {
          try {
            await this.socketHandler.joinRoom(request.roomId);
            this.addMessageToPopup("You joined the room!");
          } catch (err) {
            this.addMessageToPopup("Room with specified id is not found!");
          }
        } else if (request.message === "create") {
          try {
            await this.socketHandler.createRoom(request.roomId);
            this.addMessageToPopup("The room is created!");
          } catch (err) {
            this.addMessageToPopup("Room with specified id already exists!");
          }
        }
      };
      a();
    });
  };
}
