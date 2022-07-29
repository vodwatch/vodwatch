import { JSDOM } from "jsdom";
const dom = new JSDOM();
global.document = dom.window.document;
import { waitForElementToLoad } from "../src/modules/services/VideoElementService";
test("Check waitForElementToLoad function ", async () => {
  jest.restoreAllMocks();
  jest
    .spyOn(document, "querySelector")
    .mockImplementation((selector: string) => {
      return document.createElement(selector);
    });
  const video = document.createElement("video");
  const result = await waitForElementToLoad("video");
  expect(document.querySelector).toBeCalledTimes(1);
  expect(result).toStrictEqual(video);
});
