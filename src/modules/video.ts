import { waitForElementToLoad } from "./utils";
import axios from "axios";

interface EventInfo {
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
  try {
    // axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";  <--- if CORS ERROR, but probably it will be servers fault!!!
    let response = await axios({
      method: "post",
      url: url,
      data: eventInfo,
      headers: { "Content-Type": "application/json" },
    });
    console.log(response, "Response from server!!!");
  } catch (error) {
    console.error(error, "Error with POST request!!!");
  }
  console.log(video.currentTime);
  console.log(event.type);
};

export const addVideoEventListeners = async () => {
  const video = await waitForElementToLoad("video");
  if (video) {
    video.addEventListener("play", handleVideoEvent);
    video.addEventListener("pause", handleVideoEvent);
    video.addEventListener("seeked", handleVideoEvent);
  }
};
