import { isObjectEmpty } from "../popup/helpers.js";

export const getReviewQueuePromise = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get("reviewQueue", (reviewQueue) => {
      resolve(reviewQueue["reviewQueue"]);
    });
  });
};

export const getTodoListPromise = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get("todoList", (todoList) => {
      resolve(todoList["todoList"]);
    });
  });
};

export const getRecordFromStoragePromise = (problemNumber) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([problemNumber], (problemInfos) => {
      if (!isObjectEmpty(problemInfos)) {
        resolve(problemInfos[problemNumber]);
      } else {
        resolve({});
      }
    });
  });
};
