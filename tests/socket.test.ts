import { ClientSocketHandler } from "../src/modules/socket";
import { EventInfo } from "../src/modules/video";

test("Check createRoom", () => {
    const socket = new ClientSocketHandler();
    socket.openConnection(async () => {
        let response = await socket.createRoom("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
    
        expect(socket.getRoomId()).toBe("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
        expect(response).toBe("OK");
    });
}); 

test("Check joinRoom", () => {
    const socket = new ClientSocketHandler();
    socket.openConnection(async () => {
        let response = await socket.joinRoom("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
    
        expect(socket.getRoomId()).toBe("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
        expect(response).toBe("OK");
    });
}); 

test("Check sendMessage", () => {
    const socket = new ClientSocketHandler();
    socket.openConnection(async () => {
        await socket.createRoom("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
        let response = socket.sendMessage("message");

        expect(socket.getMessages()).toContain("message");
        expect(response).toBe("OK");
    });
});

test("Check sendVideoEvent", () => {
    const socket = new ClientSocketHandler();
    socket.openConnection(async () => {
        await socket.createRoom("a3136d88-7e4e-4dff-91be-0e087d4e00e3");
        socket.sendVideoEvent({"event": "play", "currentTime": 10} as EventInfo);
    
        expect(socket.getVideo().currentTime).toBe(10);
        expect(socket.getVideo().paused).toBe(false);
    });
});
