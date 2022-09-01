import { io, Socket } from "socket.io-client";
import { netflixPlay, netflixPause, netflixSeek} from "./services/NetflixService";
import { youTubePlay, youTubePause, youTubeSeek} from "./services/YouTubeService";
import { EventInfo } from "./video";
import {streamingPlatform} from '../streamingPlatform';
import { setActivePinia } from "pinia";

const SocketEventType = {
    MESSAGE: "message",
    SEND_VIDEO_EVENT: "send_video_event",
    RECEIVE_VIDEO_EVENT: "receive_video_event",
    CREATE_ROOM: "create_room",
    JOIN_ROOM: "join_room",
    FIND_ROOM_BY_CLIENT: "find_room_by_client",
    PERMISSIONS: "permissions",
};

interface MessageFromServer {
    permissions: Permissions,
    roomId: string,
}
 
interface Permissions {
    pause: boolean;
    play: boolean;
    seeked: boolean;
    chat: boolean;
    kick: boolean;
}
export class ClientSocketHandler {
    private readonly serverUrl: string = "http://localhost:5000";
    private roomId!: string;
    private socket!: Socket;
    private video!: HTMLVideoElement;
    private permissions!: Permissions;
    private eventSemaphore: boolean = false; 
    public streamingPlatform?: string;
    supposedCurrentTime: number = 0;

    openConnection = (afterConnectionCallback : () => void) => {
        this.socket = io(this.serverUrl);
        this.socket.on("connect", () => {
            console.log("Socket is connected");
            afterConnectionCallback();
        });
        this.socket.on("disconnect", () => {
            console.log("Socket is disconnected");
        });
        this.socket.on(
            SocketEventType.RECEIVE_VIDEO_EVENT,
            (message: EventInfo) => {
                this.eventSemaphore = true;
                switch (message.event) {
                    case "play":
                        if (Math.abs(this.video.currentTime - message.currentTime) > 0.5 ) {
                            switch(this.streamingPlatform) {
                                case streamingPlatform.netflix:
                                    netflixSeek(message.currentTime);
                                    break;
                                case streamingPlatform.hboMax:
                                    console.log("HBO Max video is seeked!");
                                    break;
                                case streamingPlatform.youTube:
                                    youTubeSeek(message.currentTime);
                                    break;
                                case streamingPlatform.disneyPlus:
                                    console.log("Disney+ video is seeked!");
                                    break;
                                case streamingPlatform.amazonPrimeVideo:
                                    console.log("Amazon Prime Video video is seeked!");
                                    break;
                                default:
                                    console.warn("Streaming platform is undefined.");
                                    break;
                            }
                        }
                        switch(this.streamingPlatform) {
                            case streamingPlatform.netflix:
                                netflixPlay();
                                break;
                            case streamingPlatform.hboMax:
                                console.log("HBO Max video is played!");
                                break;
                            case streamingPlatform.youTube:
                                youTubePlay();
                                break;
                            case streamingPlatform.disneyPlus:
                                console.log("Disney+ video is played!");
                                break;
                            case streamingPlatform.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is played!");
                                break;
                            default:
                                console.warn("Streaming platform is undefined.");
                                break;
                        }
                        break;
                    case "pause":
                        switch(this.streamingPlatform) {
                            case streamingPlatform.netflix:
                                netflixPause();
                                break;
                            case streamingPlatform.hboMax:
                                console.log("HBO Max video is paused!");
                                break;
                            case streamingPlatform.youTube:
                                youTubePause();
                                break;
                            case streamingPlatform.disneyPlus:
                                console.log("Disney+ video is paused!");
                                break;
                            case streamingPlatform.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is paused!");
                                break;
                            default:
                                console.warn("Streaming platform is undefined.");
                                break;
                        }
                        break;
                    case "seeked":
                        switch(this.streamingPlatform) {
                            case streamingPlatform.netflix:
                                netflixSeek(message.currentTime);
                                break;
                            case streamingPlatform.hboMax:
                                console.log("HBO Max video is seeked!");
                                break;
                            case streamingPlatform.youTube:
                                youTubeSeek(message.currentTime)
                                break;
                            case streamingPlatform.disneyPlus:
                                console.log("Disney+ video is seeked!");
                                break;
                            case streamingPlatform.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is seeked!");
                                break;
                            default:
                                console.warn("Streaming platform is undefined.");
                                break;    
                        }
                        break;
                }
                setTimeout(() => {
                    this.eventSemaphore = false;
                }, 1000);   
            }
        );
        this.socket.on(SocketEventType.PERMISSIONS, (message: MessageFromServer) => {
            if (message.permissions && message.roomId) {
                this.permissions = message?.permissions;
                this.roomId = message?.roomId;
            } else {
                throw new Error(`Haven't received payload from server.`)
            }
        });
        
    };

    sendMessage = (message: string) => {
        this.checkForErrors();
        this.socket.emit(
            SocketEventType.MESSAGE,
            message,
            (response: string) => {
            }
        );
    };
    
    sendVideoEvent = async (eventInfo: EventInfo) => {
        this.checkForErrors()
        if (this.roomId == null) throw new Error("You are not in a room!");
        const data = {
            eventInfo,
            roomId: this.roomId,
        };
        
        const event = eventInfo.event as keyof typeof this.permissions;
        if (this.eventSemaphore) {
            return;
        }

        if(!this.permissions[event]) {
            this.eventSemaphore = true;
            switch(eventInfo.event){
                case "pause":
                    switch(this.streamingPlatform) {
                        case streamingPlatform.netflix:
                            netflixPlay();
                            break;
                        case streamingPlatform.hboMax:
                            console.log("HBO Max video is played!");
                            break;
                        case streamingPlatform.youTube:
                            youTubePlay();
                            break;
                        case streamingPlatform.disneyPlus:
                            console.log("Disney+ video is played!");
                            break;
                        case streamingPlatform.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is played!");
                            break;
                        default:
                            console.warn("Streaming platform is undefined.");
                            break;
                    }
                    break;
                case "play":
                    switch(this.streamingPlatform) {
                        case streamingPlatform.netflix:
                            netflixPause();
                            break;
                        case streamingPlatform.hboMax:
                            console.log("HBO Max video is paused!");
                            break;
                        case streamingPlatform.youTube:
                            youTubePause();
                            break;
                        case streamingPlatform.disneyPlus:
                            console.log("Disney+ video is paused!");
                            break;
                        case streamingPlatform.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is paused!");
                            break;
                        default:
                            console.warn("Streaming platform is undefined.");
                            break;
                    }
                    break;
                case "seeked":
                    switch(this.streamingPlatform) {
                        case streamingPlatform.netflix:
                            netflixSeek(this.supposedCurrentTime);
                            break;
                        case streamingPlatform.hboMax:
                            console.log("HBO Max video is seeked!");
                            break;
                        case streamingPlatform.youTube:
                            youTubeSeek(this.supposedCurrentTime);
                            break;
                        case streamingPlatform.disneyPlus:
                            console.log("Disney+ video is seeked!");
                            break;
                        case streamingPlatform.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is seeked!");
                            break;
                        default:
                            console.warn("Streaming platform is undefined.");
                            break;
                    }
                    break;
            }
            setTimeout(() => {
                this.eventSemaphore = false;
            }, 1000);   

            return;   
        }

        this.socket.emit(
            SocketEventType.SEND_VIDEO_EVENT,
            data,
            (response: string) => {
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
                    if (response === "ROOM_ALREADY_EXISTS") {
                        reject(response);
                    }
                    resolve(response);
                }
            );
        });
    };

    closeConnection = () => {
        this.checkForErrors();
        this.socket.close();
    };

    getPermissions = (): Permissions => this.permissions;

    setVideo = (video : HTMLVideoElement) => {
        this.video = video;
    }

    isConnected = () => {
        return this.socket.connected;
    }

    private checkForErrors = () => {
        if (!this.socket) throw new Error("Socket is not initialized");
        if (!this.socket.connected) throw new Error("Socket is not connected");
    };
}
