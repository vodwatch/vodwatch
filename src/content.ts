import { addVideoEventListeners } from "./modules/video";

let substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
  addVideoEventListeners();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  addVideoEventListeners();
  sendResponse({});
  return true;
});
