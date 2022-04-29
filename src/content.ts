import { addVideoEventListeners } from './modules/video';

console.log("Hi, I'm content script!");
let substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
  addVideoEventListeners();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  addVideoEventListeners();
  let video = document.getElementsByTagName("video");
  console.log(video, "from background!");
  sendResponse({});
  return true;
});
