console.log("Hi, I'm content script!");
let substring = "https://www.netflix.com/watch";
if (document.location.href.includes(substring)) {
  let video = document.getElementsByTagName("video");
  console.log(video, "from content!");
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let video = document.getElementsByTagName("video");
  console.log(video, "from background!");
  sendResponse({});
  return true;
});
