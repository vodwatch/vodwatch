import { waitForElementToLoad } from './utils/utils';

const handleVideoEvent = (event: Event) => {
  const video = event.target as HTMLVideoElement
  console.log(video.currentTime);
  console.log(event.type);
}

const waitForVideoToLoad = async () => {
  const video = await waitForElementToLoad('video');
  if (video) {
    video.addEventListener("play", handleVideoEvent);
    video.addEventListener("pause", handleVideoEvent);
    video.addEventListener("seeked", handleVideoEvent);
  }
}

console.log("Hi, I'm content script!");
let substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
  waitForVideoToLoad();
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let video = document.getElementsByTagName("video");
  console.log(video, "from background!");
  sendResponse({});
  return true;
});
