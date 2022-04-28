console.log("Hi I'm background script!");
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  let substring = "https://www.netflix.com/watch";
  if (changeInfo.url?.includes(substring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video" }, (message) => {
      return;
    });
  }
});
