import { defineStore } from "pinia";

import { ClientSocketHandler } from "../modules/socket";

export const useSocketStore = defineStore("socket", {
    state: () => {
        return {
            socket: new ClientSocketHandler() as ClientSocketHandler,
        };
    },
});
