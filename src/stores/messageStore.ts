import { defineStore } from "pinia";
import { Message } from './../modules/interfaces/interfaces';

export const useMessageStore = defineStore("messages", {
    state: () => {
        return {
            messages: new Array<Message>(),
        };
    },
});
