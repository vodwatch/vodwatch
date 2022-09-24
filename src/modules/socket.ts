import { io, Socket } from "socket.io-client";
import { netflixPlay, netflixPause, netflixSeek} from "./services/NetflixService";
import { youTubePlay, youTubePause, youTubeSeek} from "./services/YouTubeService";
import { Message } from "./interfaces/interfaces";
import { EventInfo } from "./video";
import { STREAMING_PLATFORM } from '../streamingPlatform';

const SocketEventType = {
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
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
    private chatMessages!: Message[];
    supposedCurrentTime: number = 0;

    openConnection = (afterConnectionCallback: () => void) => {
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
                                case STREAMING_PLATFORM.netflix:
                                    netflixSeek(message.currentTime);
                                    break;
                                case STREAMING_PLATFORM.hboMax:
                                    this.video.currentTime = message.currentTime;
                                    console.log("HBO Max video is seeked!");
                                    break;
                                case STREAMING_PLATFORM.youTube:
                                    youTubeSeek(message.currentTime);
                                    break;
                                case STREAMING_PLATFORM.disneyPlus:
                                    console.log("Disney+ video is seeked!");
                                    break;
                                case STREAMING_PLATFORM.amazonPrimeVideo:
                                    console.log("Amazon Prime Video video is seeked!");
                                    break;
                                default:
                                    this.video.currentTime = message.currentTime;
                                    break;
                            }
                        }

                        switch(this.streamingPlatform) {
                            case STREAMING_PLATFORM.netflix:
                                netflixPlay();
                                break;
                            case STREAMING_PLATFORM.hboMax:
                                this.video.play();
                                console.log("HBO Max video is played!");
                                break;
                            case STREAMING_PLATFORM.youTube:
                                youTubePlay();
                                break;
                            case STREAMING_PLATFORM.disneyPlus:
                                console.log("Disney+ video is played!");
                                break;
                            case STREAMING_PLATFORM.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is played!");
                                break;
                            default:
                                this.video.play();
                                break;
                        }
                        break;
                    case "pause":
                        switch(this.streamingPlatform) {
                            case STREAMING_PLATFORM.netflix:
                                netflixPause();
                                break;
                            case STREAMING_PLATFORM.hboMax:
                                this.video.pause();
                                console.log("HBO Max video is paused!");
                                break;
                            case STREAMING_PLATFORM.youTube:
                                youTubePause();
                                break;
                            case STREAMING_PLATFORM.disneyPlus:
                                console.log("Disney+ video is paused!");
                                break;
                            case STREAMING_PLATFORM.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is paused!");
                                break;
                            default:
                                this.video.pause();
                                break;
                        }
                        break;
                    case "seeked":
                        switch(this.streamingPlatform) {
                            case STREAMING_PLATFORM.netflix:
                                netflixSeek(message.currentTime);
                                break;
                            case STREAMING_PLATFORM.hboMax:
                                this.video.currentTime = message.currentTime;
                                console.log("HBO Max video is seeked!");
                                break;
                            case STREAMING_PLATFORM.youTube:
                                youTubeSeek(message.currentTime)
                                break;
                            case STREAMING_PLATFORM.disneyPlus:
                                console.log("Disney+ video is seeked!");
                                break;
                            case STREAMING_PLATFORM.amazonPrimeVideo:
                                console.log("Amazon Prime Video video is seeked!");
                                break;
                            default:
                                this.video.currentTime = message.currentTime;
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
        this.socket.on(SocketEventType.RECEIVE_MESSAGE, (message: Message) => {
            console.log("Incoming message:", message);
            if(!this.chatMessages)
                throw new Error("Chat messages reference is not set!")

            this.chatMessages.push(message);
        });
    };

    sendMessage = (message: string) => {
        this.checkForErrors();
        if (this.roomId == null)
            throw new Error("You are not in a room!");

        return new Promise((resolve, reject) => {
            this.socket.emit(
                SocketEventType.SEND_MESSAGE,
                {
                    message: message,
                    roomId: this.roomId,
                },
                (response: string) => {
                    console.log("Message sent successfuly!");
                    if (response === "ROOM_NOT_FOUND") {
                        reject(response);
                    }

                    resolve(response);
                }
            );
        });
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

        if (!this.permissions[event]) {
            this.eventSemaphore = true;
            switch (eventInfo.event) {
                case "pause":
                    switch(this.streamingPlatform) {
                        case STREAMING_PLATFORM.netflix:
                            netflixPlay();
                            break;
                        case STREAMING_PLATFORM.hboMax:
                            this.video.play();
                            console.log("HBO Max video is played!");
                            break;
                        case STREAMING_PLATFORM.youTube:
                            youTubePlay();
                            break;
                        case STREAMING_PLATFORM.disneyPlus:
                            console.log("Disney+ video is played!");
                            break;
                        case STREAMING_PLATFORM.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is played!");
                            break;
                        default:
                            this.video.play();
                            break;
                    }
                    break;
                case "play":
                    switch(this.streamingPlatform) {
                        case STREAMING_PLATFORM.netflix:
                            netflixPause();
                            break;
                        case STREAMING_PLATFORM.hboMax:
                            this.video.pause();
                            console.log("HBO Max video is paused!");
                            break;
                        case STREAMING_PLATFORM.youTube:
                            youTubePause();
                            break;
                        case STREAMING_PLATFORM.disneyPlus:
                            console.log("Disney+ video is paused!");
                            break;
                        case STREAMING_PLATFORM.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is paused!");
                            break;
                        default:
                            this.video.pause();
                            break;
                    }
                    break;
                case "seeked":
                    switch(this.streamingPlatform) {
                        case STREAMING_PLATFORM.netflix:
                            netflixSeek(this.supposedCurrentTime);
                            break;
                        case STREAMING_PLATFORM.hboMax:
                            this.video.currentTime = this.supposedCurrentTime;
                            console.log("HBO Max video is seeked!");
                            break;
                        case STREAMING_PLATFORM.youTube:
                            youTubeSeek(this.supposedCurrentTime);
                            break;
                        case STREAMING_PLATFORM.disneyPlus:
                            console.log("Disney+ video is seeked!");
                            break;
                        case STREAMING_PLATFORM.amazonPrimeVideo:
                            console.log("Amazon Prime Video video is seeked!");
                            break;
                        default:
                            this.video.currentTime = this.supposedCurrentTime;
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

    setVideo = (video: HTMLVideoElement) => {
        this.video = video;
    }

    isConnected = () => {
        return this.socket.connected;
    }

    setChatMessages = (chatMessages : Message[]) => {
        this.chatMessages = chatMessages;
    }

    private checkForErrors = () => {
        if (!this.socket) throw new Error("Socket is not initialized");
        if (!this.socket.connected) throw new Error("Socket is not connected");
    };
}
