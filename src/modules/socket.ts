import { io, Socket } from "socket.io-client";
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
interface MessageEvent {
  play: boolean;
  pause: boolean;
  seek: boolean;
}

export class ClientSocketHandler {
  private serverUrl: string;
  private socket!: Socket;
  private video: HTMLVideoElement;
  private permissions!: Permissions;
  private messageEvent!: MessageEvent;

  constructor(video: HTMLVideoElement) {
    this.serverUrl = "http://localhost:5000";
    this.video = video;
    this.messageEvent = { play: false, pause: false, seek: false };
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
        console.log("Received video event from the server: ", message);
        switch (message.event) {
          case "play":
            this.video.play();
            console.log("Video is played!");
            this.messageEvent.play = true;
            break;
          case "pause":
            this.video.pause();
            console.log("Video is paused!");
            this.messageEvent.pause = true;
            break;
          case "seeked":
            var time = message.currentTime * 1000;
            var seekCode = `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
                            const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
                            player.seek(${time});`;
            document.documentElement.setAttribute('onreset', seekCode);
            document.documentElement.dispatchEvent(new CustomEvent('reset'));
            document.documentElement.removeAttribute('onreset');
            console.log("Video is seeked!", message.currentTime);
            this.messageEvent.seek = true;
            break;
        }
      }
    );
    this.socket.on(SocketEventType.PERMISSIONS, (message: any) => {
      console.log("Received video event from the server: ", message);
      this.permissions = message.permissions;
    });
  };

  sendMessage = (message: string) => {
    this.checkForErrors();
    this.socket.emit(SocketEventType.MESSAGE, message, (response: string) => {
      console.log("Response: " + response);
    });
  };

  sendVideoEvent = (eventInfo: EventInfo) => {
    this.checkForErrors();
    this.findMyRoom().then(
      (myRoomId) => {
        if (myRoomId == null) throw new Error("You are not in a room!");
        var data = {
          eventInfo,
          myRoomId,
        };
        console.log(data);
        this.socket.emit(
          SocketEventType.SEND_VIDEO_EVENT,
          data,
          (response: string) => {
            console.log("Response: " + response);
          }
        );
      });
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
      this.socket.emit(SocketEventType.CREATE_ROOM, roomId, (response: any) => {
        console.log("Response: " + response);
        if (response === "ROOM_ALREADY_EXISTS") {
          reject(response);
        }
        resolve(response);
      });
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

  getMessageEvent = (): MessageEvent => this.messageEvent;

  private checkForErrors = () => {
    if (!this.socket) throw new Error("Socket is not initialized");
    if (!this.socket.connected) throw new Error("Socket is not connected");
  };
}
