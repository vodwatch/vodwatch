import { io, Socket } from "socket.io-client";
import { EventInfo } from "./video"

const SocketEventType = {
    MESSAGE: "message",
    SEND_VIDEO_EVENT: "send_video_event"
};

export class ClientSocketHandler {

    private serverUrl: string;
    private socket!: Socket;

    constructor() {
        this.serverUrl = "http://localhost:5000";
    }

    openConnection = () => {
        this.socket = io(this.serverUrl);
        this.socket.on("connect", () => {
            console.log("Socket is connected");
        });
        this.socket.on("disconnect", () => {
            console.log("Socket is disconnected");
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