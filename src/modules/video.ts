import { waitForElementToLoad } from "./utils";
import axios from "axios";

export interface EventInfo {
  event: string;
  currentTime: number;
}

const handleVideoEvent = async (event: Event) => {
  const video = event.target as HTMLVideoElement;
  let eventInfo: EventInfo = {
    event: event.type,
    currentTime: video.currentTime,
  };
  let url = "http://localhost:8000/eventInfo/"; // swap this url later for our servers one!!!
  postData(url, eventInfo);
  console.log(video.currentTime);
  console.log(event.type);
};
export const postData = async (url: string, eventInfo: EventInfo) => {
  try {
    // axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";  <--- if CORS ERROR, but probably it will be servers fault!!!
    const headers = {
      "Content-Type": "application/json",
    };
    let response = await axios.post(url, eventInfo, {
      headers: headers,
    });
    console.log(response, "Response from server!!!");
    return response.status;
  } catch (error: any) {
    console.error(error, "Error with POST request!!!");
    return error.status;
  }
};
export const addVideoEventListeners = async () => {
  const video = await waitForElementToLoad("video");
  if (video) {
    addEventListeners(video);
  }
};
export const addEventListeners = (video: Element) => {
  video.addEventListener("play", handleVideoEvent);
  video.addEventListener("pause", handleVideoEvent);
  video.addEventListener("seeked", handleVideoEvent);
};
//TO TEST:
//addVideoEventListeners
//handleVideoEvent
