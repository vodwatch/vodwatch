import { videoHandler } from "./modules/video";
const videoHandlerInstance: videoHandler = new videoHandler();
const substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
    videoHandlerInstance.addVideoEventListeners();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text === "on video") {
    videoHandlerInstance.addVideoEventListeners();
  }
  sendResponse({});
  return true;
});
