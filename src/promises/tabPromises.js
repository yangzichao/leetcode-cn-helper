export const getProblemDataFromContentPromise = (tabId) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      {
        method: "getContent",
      },
      (response) => {
        if (response) {
          resolve(response.data);
        } else {
          reject(reject("please go to the problems all"));
        }
      }
    );
  });
};

export const getMarkdownFromContentPromise = (tabId) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      {
        method: "generateMarkdown",
      },
      (response) => {
        if (response) {
          resolve(response.data);
        } else {
          reject(reject("please go to the problems all"));
        }
      }
    );
  });
};
