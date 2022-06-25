import { io, Socket } from "socket.io-client";
import { EventInfo } from "./video"

const SocketEventType = {
    MESSAGE: "message",
    SEND_VIDEO_EVENT: "send_video_event",
    RECEIVE_VIDEO_EVENT: "receive_video_event",
};

export class ClientSocketHandler {

    private serverUrl: string;
    private socket!: Socket;
    private video: HTMLVideoElement;

    constructor(video : HTMLVideoElement) {
        this.serverUrl = "http://localhost:5000";
        this.video = video;
    }

    openConnection = () => {
        this.socket = io(this.serverUrl);
        this.socket.on("connect", () => {
            console.log("Socket is connected");
        });
        this.socket.on("disconnect", () => {
            console.log("Socket is disconnected");
        });
        this.socket.on(SocketEventType.RECEIVE_VIDEO_EVENT, (message: EventInfo) => {
            console.log("Received video event from the server: ", message);
            switch(message.event) {
                case "play":
                    this.video.play();
                    console.log("Video is played!");
                    break;
                case "pause":
                    this.video.pause();
                    console.log("Video is paused!");
                    break;
                case "seeked":
                    //this.video.currentTime = message.currentTime;
                    console.log("Video is seeked!", message.currentTime);
                    break;
            }
        });
    }

    sendMessage = (message: string) => {
        this.checkForErrors();
        this.socket.emit(SocketEventType.MESSAGE, message, (response: string) => {
            console.log("Response: " + response);
        })
    }

    sendVideoEvent = (eventInfo: EventInfo) => {
        this.checkForErrors();
        this.socket.emit(SocketEventType.SEND_VIDEO_EVENT, eventInfo, (response: string) => {
            console.log("Response: " + response);
        })
    }

    closeConnection = () => {
        this.checkForErrors();
        this.socket.close();
    }

    private checkForErrors = () => {
        if (!this.socket)
            throw new Error("Socket is not initialized");
        if (!this.socket.connected)
            throw new Error("Socket is not connected");
    }
}