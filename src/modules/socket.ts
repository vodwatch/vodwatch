import { io, Socket } from "socket.io-client";
import { EventInfo } from "./video"

const SocketEventType = {
    MESSAGE: "message",
    VIDEO_EVENT: "video_event"
};

export class ClientSocketHandler {

    serverUrl: string;
    socket!: Socket;

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
        if (!this.socket)
            throw new Error("Socket is not initialized");
        if (!this.socket.connected)
            throw new Error("Socket is not connected");
        this.socket.emit(SocketEventType.MESSAGE, message, (response: string) => {
            console.log("Response: " + response);
        })
    }

    sendVideoEvent = (eventInfo: EventInfo) => {
        if (!this.socket) 
            throw new Error("Socket is not initialized");
        if (!this.socket.connected) 
            throw new Error("Socket is not connected");
        this.socket.emit(SocketEventType.VIDEO_EVENT, eventInfo, (response: string) => {
            console.log("Response: " + response);
        })
    }

    closeConnection = () => {
        if (!this.socket)
            throw new Error("Socket is not initialized");
        this.socket.close();
    }

    isConnected = (): boolean => {
        if (!this.socket)
            throw new Error("Socket is not initialized");
        return this.socket.connected;
    }
}