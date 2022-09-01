import {streamingPlatform, streamingPlatformSubstring} from './streamingPlatform';

let socket: any;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url?.includes(streamingPlatformSubstring.netflixSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform.netflix }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(streamingPlatformSubstring.hboMaxSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform.hboMax }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(streamingPlatformSubstring.youTubeSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform.youTube }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(streamingPlatformSubstring.disneyPlusSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform.disneyPlus }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(streamingPlatformSubstring.amazonPrimeVideoSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform.amazonPrimeVideo }, (message) => {
      return;
    });
  }
});
