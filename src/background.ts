import {STREAMING_PLATFORM, STREAMING_PLATFORM_SUBSTRING} from './streamingPlatform';

let socket: any;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url?.includes(STREAMING_PLATFORM_SUBSTRING.netflixSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: STREAMING_PLATFORM.netflix }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(STREAMING_PLATFORM_SUBSTRING.hboMaxSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: STREAMING_PLATFORM.hboMax }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(STREAMING_PLATFORM_SUBSTRING.youTubeSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: STREAMING_PLATFORM.youTube }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(STREAMING_PLATFORM_SUBSTRING.disneyPlusSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: STREAMING_PLATFORM.disneyPlus }, (message) => {
      return;
    });
  }
  else if (changeInfo.url?.includes(STREAMING_PLATFORM_SUBSTRING.amazonPrimeVideoSubstring)) {
    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: STREAMING_PLATFORM.amazonPrimeVideo }, (message) => {
      return;
    });
  }
});
