import { waitForElementToLoad } from "./utils";
import { io, Socket } from "socket.io-client";

interface EventInfo {
  event: string;
  currentTime: number;
}
export class videoHandler {
  socket!: Socket;
  handleVideoEvent = async (event: Event) => {
    const video = event.target as HTMLVideoElement;
    let eventInfo: EventInfo = {
      event: event.type,
      currentTime: video.currentTime,
    };
    if (this.socket.connected) {
      this.socket.emit("event", eventInfo.event, (response: string) => {
        console.log(response); // "got it"
      });
    }
    console.log(video.currentTime);
    console.log(event.type);
  };
  addVideoEventListeners = async () => {
    const video = await waitForElementToLoad("video");
    const url = "http://localhost:5000";
    if (video) {
      video.addEventListener("play", this.handleVideoEvent);
      video.addEventListener("pause", this.handleVideoEvent);
      video.addEventListener("seeked", this.handleVideoEvent);
    }
    this.socket = io(url);
    this.socket.on("connect", () => {
      console.log(this.socket.connected); // true
    });
    this.socket.on("disconnect", () => {
      console.log(this.socket.connected); // true
    });
  };
}
