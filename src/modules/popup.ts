import { v4 as uuid } from 'uuid';

export const updateStatusPanel = (text: string) => {
  document.getElementById("statusPanel")!.innerHTML = text;
}

window.addEventListener("DOMContentLoaded", (event) => {
  const joinRoomButton = document.getElementById("joinRoomButton");
  const createRoomButton = document.getElementById("createRoomButton");
  if (!joinRoomButton)
    throw new Error("Join room button not loaded");
  if (!createRoomButton)
    throw new Error("Create room button not loaded");

  joinRoomButton.addEventListener("click", () => {
    console.log("Join room button is loaded");
    const roomId = (<HTMLInputElement>document.getElementById("joinRoomInput")).value;
    const data = {
      message: "join",
      roomId: roomId,
    }
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, data);
    });
  });

  createRoomButton.addEventListener("click", () => {
    console.log("Create room button is loaded");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const randomRoomId = uuid();
      const data = {
        message: "create",
        roomId: randomRoomId,
      }
      chrome.tabs.sendMessage(tabs[0].id!, data);
      document.getElementById("roomCode")!.innerHTML = "Your room id: " + randomRoomId;
    });
  });

  // add listener for text messages that are displayed in popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "popup_message") {
      document.getElementById("statusPanel")!.innerHTML = request.text;
    }
  });
});
