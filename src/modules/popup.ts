import { ClientSocketHandler } from "./socket";

export class PopupControlsHandler {

    private clientSocketHandler : ClientSocketHandler;

    constructor(clientSocketHandler : ClientSocketHandler) {
        this.clientSocketHandler = clientSocketHandler;

        window.addEventListener("DOMContentLoaded", (event) => {
            const joinRoomButton = document.getElementById("joinRoomButton");
            const createRoomButton = document.getElementById("createRoomButton");
            if (!joinRoomButton)
                throw new Error("Join room button not loaded");
            if (!createRoomButton)
                throw new Error("Create room button not loaded");

            joinRoomButton.addEventListener("click", () => {
                console.log("Join room button is loaded");

            });
            createRoomButton.addEventListener("click", () => {
                console.log("Create room button is loaded");

            });
        });
    }
}



