import { postData, EventInfo, addEventListeners } from "../src/modules/video";
import axios from "axios";
import { JSDOM } from "jsdom";
const dom = new JSDOM();
global.document = dom.window.document;

let url = "";
let body = {};

jest.mock("axios", () => ({
  post: jest.fn((_url, _body) => {
    return new Promise((resolve) => {
      url = _url;
      body = _body;
      resolve(true);
    });
  }),
}));

describe("Check post requests: ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Success: should return response 200", async () => {
    const response = {
      status: 200,
    };
    let url = "http://localhost:8000/eventInfo/";
    let eventInfo: EventInfo = {
      event: "pause",
      currentTime: 0,
    };
    let headers = { headers: { "Content-Type": "application/json" } };
    (axios.post as jest.Mock).mockResolvedValue(response); //OR axios.post.mockImplementationOnce(() => Promise.resolve(response));
    let result = await postData(url, eventInfo);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8000/eventInfo/",
      eventInfo,
      headers
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toBe(200);
  });

  test("Error: return response 0", async () => {
    const response = {
      status: 0,
    };
    let url = "http://localhost:8000/eventInfo/";
    let eventInfo: EventInfo = {
      event: "pause",
      currentTime: 0,
    };
    let headers = { headers: { "Content-Type": "application/json" } };
    (axios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(response)
    );
    let result = await postData(url, eventInfo);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8000/eventInfo/",
      eventInfo,
      headers
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toBe(0);
  });
});
test("Check adding event listeners function: ", async () => {
  jest.restoreAllMocks();
  const video = document.createElement("video");
  jest.spyOn(video, "addEventListener");
  addEventListeners(video);
  expect(video.addEventListener).toBeCalledTimes(3);
});
