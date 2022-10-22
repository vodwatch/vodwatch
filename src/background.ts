import {STREAMING_PLATFORM, STREAMING_PLATFORM_SUBSTRING} from './streamingPlatform';

let socket: any;
let streamingPlatform: string;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  switch (true) {
    case includesSubstring(STREAMING_PLATFORM_SUBSTRING.netflixSubstring, changeInfo.url):
      streamingPlatform = STREAMING_PLATFORM.netflix;
      break;
    case includesSubstring(STREAMING_PLATFORM_SUBSTRING.youTubeSubstring, changeInfo.url):
      streamingPlatform = STREAMING_PLATFORM.youTube;
      break;
    case includesSubstring(STREAMING_PLATFORM_SUBSTRING.hboMaxSubstring, changeInfo.url):
      streamingPlatform = STREAMING_PLATFORM.hboMax;
      break;
    }

    chrome.tabs.sendMessage(tabId, { text: "on video", streamingPlatform: streamingPlatform }, (message) => {
      return;
    });
  });

function includesSubstring(substring: string, url?: string) {
  return url?.includes(substring);
}
