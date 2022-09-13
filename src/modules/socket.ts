import { io, Socket } from "socket.io-client";
import { Message, UsersPermissions } from './interfaces/interfaces';
import { netflixPlay, netflixPause, netflixSeek } from "./services/NetflixService";
import { EventInfo } from "./video";
import { Permissions } from './interfaces/interfaces';

const SocketEventType = {
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
    SEND_VIDEO_EVENT: "send_video_event",
    RECEIVE_VIDEO_EVENT: "receive_video_event",
    CREATE_ROOM: "create_room",
    JOIN_ROOM: "join_room",
    FIND_ROOM_BY_CLIENT: "find_room_by_client",
    PERMISSIONS: "permissions",
    FIND_ALL_USERS_IN_ROOM: "find_all_users_in_room",
    SET_USERS_PERMISSIONS: "set_users_permissions",
};

interface MessageFromServer {
    my_id: string,
    permissions: UsersPermissions[],
    roomId: string,
}

export class ClientSocketHandler {
    private readonly serverUrl: string = "http://localhost:5000";
    private roomId!: string;
    private myId!: string;
    private socket!: Socket;
    private video!: HTMLVideoElement;
    permissions!: UsersPermissions[];
    private chatMessages!: Message[];
    private eventSemaphore: boolean = false;
    supposedCurrentTime: number = 0;
    private piniaStore;

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
                        if (Math.abs(this.video.currentTime - message.currentTime) > 0.5) {
                            netflixSeek(message.currentTime);
                        }
                        netflixPlay();
                        break;
                    case "pause":
                        netflixPause();
                        break;
                    case "seeked":
                        netflixSeek(this.supposedCurrentTime);
                        break;

                }
                setTimeout(() => {
                    this.eventSemaphore = false;
                }, 500);
            }
        );
        this.socket.on(SocketEventType.PERMISSIONS, (message: MessageFromServer) => {
            if (message.permissions && message.roomId) {
                this.piniaStore.setUserPermissions(message.permissions);
                console.log(message);
                if(message?.my_id !== '') {
                    this.myId = message?.my_id;
                }
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

        if (this.eventSemaphore) {
            return;
        }
        if(!this.permissions[this.myId]['vodControl']) {

            this.eventSemaphore = true;
            switch (eventInfo.event) {
                case "pause":
                    netflixPlay();
                    break;
                case "play":
                    netflixPause();
                    break;
                case "seeked":
                    netflixSeek(this.supposedCurrentTime);
                    break;
            }
            setTimeout(() => {
                this.eventSemaphore = false;
            }, 50);

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

    fetchAllUsersInRoom = () : Promise<UsersPermissions[]> => {
        this.checkForErrors();
        return new Promise((resolve, reject) => {
            this.socket.emit(
                SocketEventType.FIND_ALL_USERS_IN_ROOM,
                this.roomId,
                (response: any) => {
                    if (response === "ROOM_NOT_FOUND") {
                        reject(response);
                    }
                    resolve(response);
                }
            );
        });
    }

    setUsersPermissions = (usersPermissions : UsersPermissions[]) => {
        this.checkForErrors();
        return new Promise((resolve, reject) => {
            this.socket.emit(
                SocketEventType.SET_USERS_PERMISSIONS,
                this.roomId,
                usersPermissions,
                (response: any) => {
                    if (response === "ROOM_NOT_FOUND") {
                        reject(response);
                    }
                    resolve(response);
                }
            );
        });
    }

    closeConnection = () => {
        this.checkForErrors();
        this.socket.close();
    };

    getPermissions = (): UsersPermissions[] => this.permissions;

    setVideo = (video: HTMLVideoElement) => {
        this.video = video;
    }

    isConnected = () => {
        return this.socket.connected;
    }

    setChatMessages = (chatMessages : Message[]) => {
        this.chatMessages = chatMessages;
    }

    setPiniaStore = (piniaStore) => {
        this.piniaStore = piniaStore;
    }

    private checkForErrors = () => {
        if (!this.socket) throw new Error("Socket is not initialized");
        if (!this.socket.connected) throw new Error("Socket is not connected");
    };

}
