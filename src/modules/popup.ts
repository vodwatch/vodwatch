window.addEventListener("DOMContentLoaded", (event) => {
  const joinRoomButton = document.getElementById("joinRoomButton");
  const createRoomButton = document.getElementById("createRoomButton");
  if (!joinRoomButton) 
    throw new Error("Join room button not loaded");
  if (!createRoomButton) 
    throw new Error("Create room button not loaded");

  joinRoomButton.addEventListener("click", () => {
    console.log("Join room button is loaded");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "join" });
    });
  });
  createRoomButton.addEventListener("click", () => {
    console.log("Create room button is loaded");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: "create" });
    });
  });
});
