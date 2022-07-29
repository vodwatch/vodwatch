import { io, Socket } from "socket.io-client";
import { netflixPlay, netflixPause, netflixSeek} from "./services/NetflixService";
import { EventInfo } from "./video";

const SocketEventType = {
    MESSAGE: "message",
    SEND_VIDEO_EVENT: "send_video_event",
    RECEIVE_VIDEO_EVENT: "receive_video_event",
    CREATE_ROOM: "create_room",
    JOIN_ROOM: "join_room",
    FIND_ROOM_BY_CLIENT: "find_room_by_client",
    PERMISSIONS: "permissions",
};
interface Permissions {
    pause: boolean;
    play: boolean;
    seek: boolean;
    chat: boolean;
    kick: boolean;
}
export class ClientSocketHandler {
    private serverUrl: string;
    private socket!: Socket;
    private video: HTMLVideoElement;
    private permissions!: Permissions;
    private eventSemaphore: boolean = false;

    constructor(video: HTMLVideoElement) {
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
        this.socket.on(
            SocketEventType.RECEIVE_VIDEO_EVENT,
            (message: EventInfo) => {
                this.eventSemaphore = true;
                console.log("Received video event from the server: ", message);
                switch (message.event) {
                    case "play":
                        if (Math.abs(this.video.currentTime - message.currentTime) > 0.5 ) {
                            netflixSeek(message.currentTime);
                        }
                        console.log(this.video);
                        netflixPlay();
                        
                        break;
                    case "pause":
                        console.log(this.video);
                        netflixPause();
                        
                        break;
                    case "seeked":
                        netflixSeek(message.currentTime);
                        break;
                    
                }
                setTimeout(() => {
                    this.eventSemaphore = false;
                }, 500);   
            }
        );
        this.socket.on(SocketEventType.PERMISSIONS, (message: any) => {
            console.log("Received video event from the server: ", message);
            this.permissions = message.permissions;
        });
    };

    sendMessage = (message: string) => {
        this.checkForErrors();
        this.socket.emit(
            SocketEventType.MESSAGE,
            message,
            (response: string) => {
                console.log("Response: " + response);
            }
        );
    };

    sendVideoEvent = async (eventInfo: EventInfo) => {
        this.checkForErrors();
        const myRoomId = await this.findMyRoom();
        if (myRoomId == null) throw new Error("You are not in a room!");
        var data = {
            eventInfo,
            myRoomId,
        };
        console.log(data);
        if (this.eventSemaphore) {
            return;
        }

        this.socket.emit(
            SocketEventType.SEND_VIDEO_EVENT,
            data,
            (response: string) => {
                console.log("Response: " + response);
            }
        );
    };

    joinRoom = (roomId: string) => {
        this.checkForErrors();
        return new Promise((resolve, reject) => {
            this.socket.emit(
                SocketEventType.JOIN_ROOM,
                roomId,
                (response: string) => {
                    console.log("Response: " + response);
                    if (response === "ROOM_NOT_FOUND") {
                        reject(response);
                    }
                    resolve(response);
                }
            );
        });
    };

    createRoom = (roomId: string) => {
        this.checkForErrors();
        return new Promise((resolve, reject) => {
            this.socket.emit(
                SocketEventType.CREATE_ROOM,
                roomId,
                (response: any) => {
                    console.log("Response: " + response);
                    if (response === "ROOM_ALREADY_EXISTS") {
                        reject(response);
                    }
                    resolve(response);
                }
            );
        });
    };

    findMyRoom = async () => {
        this.checkForErrors();
        return await new Promise<string>((resolve, reject) => {
            this.socket.emit(
                SocketEventType.FIND_ROOM_BY_CLIENT,
                (myRoomId: string) => {
                    console.log("Response: " + myRoomId);
                    if (myRoomId === "ROOM_NOT_FOUND") {
                        reject(myRoomId);
                    }
                    resolve(myRoomId);
                }
            );
        });
    };

    closeConnection = () => {
        this.checkForErrors();
        this.socket.close();
    };

    getPermissions = (): Permissions => this.permissions;

    private checkForErrors = () => {
        if (!this.socket) throw new Error("Socket is not initialized");
        if (!this.socket.connected) throw new Error("Socket is not connected");
    };
}
