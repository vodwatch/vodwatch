import { videoHandler } from "./modules/video";
const videoHandlerInstance = new videoHandler();
let substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
  videoHandlerInstance.addVideoEventListeners();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  videoHandlerInstance.addVideoEventListeners();
  sendResponse({});
  return true;
});
