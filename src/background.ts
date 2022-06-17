let socket: any;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let substring = "https://www.netflix.com/watch";
  if (changeInfo.url?.includes(substring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video" }, (message) => {
      return;
    });
  }
});
