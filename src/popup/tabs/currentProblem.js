import {
  isInsideArray,
  getDifficultyColor,
  getFrequencyColor,
  getReviewDates,
  isObjectEmpty,
} from "../helpers.js";

import {
  getRecordFromStoragePromise,
  getTodoListPromise,
  getReviewQueuePromise,
} from "../../promises/storagePromises.js";

import {
  getProblemDataFromContentPromise,
  getMarkdownFromContentPromise,
} from "../../promises/tabPromises.js";

export const generateCurrentProblem = (tab) => {
  let url = tab.url;
  let urlTitle = url.replace("https://leetcode.com/problems/", "");

  let contentData = {};
  let storageData = {};
  let number, title, difficulty, acRate, frequency;
  let successfulAttempts, failedAttempts, tags;
  getProblemDataFromContentPromise(tab.id)
    .then((data) => {
      contentData = { ...data };
      number = contentData.number;
      title = contentData.title;
      difficulty = contentData.difficulty;
      acRate = contentData.acRate;
      frequency = contentData.frequency;
      return number;
    })
    .then((problemNumber) => {
      getRecordFromStoragePromise(problemNumber)
        .then((data) => {
          storageData = { ...data };
          successfulAttempts = storageData.successfulAttempts ?? 0;
          failedAttempts = storageData.failedAttempts ?? 0;
          // TODO: add tags
          tags = storageData.tags ?? [];
        })
        .then(() => {
          showProblemInfo(
            number,
            title,
            difficulty,
            frequency,
            acRate,
            successfulAttempts,
            failedAttempts
          );
          addAttempButtonListeners(number, successfulAttempts, failedAttempts);
          addTodoListButtonListeners(number, urlTitle);
          addReviewQueueButtonListeners(number, urlTitle);
          addGenerateMarkdownListeners(tab, number, title, difficulty);
        });
    });
};

const showProblemInfo = (
  number,
  title,
  difficulty,
  frequency,
  acRate,
  successfulAttempts,
  failedAttempts
) => {
  let totalAttempts = successfulAttempts + failedAttempts;
  let difficultyColor = getDifficultyColor(difficulty);
  let frequencyColor = getFrequencyColor(frequency);

  let problemInfos = document.getElementById("problem-infos");
  problemInfos.innerHTML = ``;
  let problemTitle = document.createElement("div");
  problemTitle.innerHTML = `<h4>&emsp;${number}: ${title}</h4>`;
  problemInfos.appendChild(problemTitle);

  let problemData = document.createElement("ul");
  problemData.classList.add("collection");
  problemData.innerHTML = `
  <li class="collection-item"> 
  <h6>Difficulty: 
  <span class="${difficultyColor} text-darken-3">${difficulty}</span>, 
  Frequency: 
  <span class="${frequencyColor} text-darken-1">${frequency}</span>, 
  AC rate: 
  <span class=" deep-purple-text text-darken-1">${acRate}</span>.</h6> </li>
  <li class="collection-item"><h6>
  Total Attempts: <span class=" yellow-text text-darken-1">
  ${totalAttempts}</span>, 
  Success: <span class=" green-text text-darken-1">
  ${successfulAttempts}</span>, 
  Fail: <span class=" red-text text-darken-1">
  ${failedAttempts}</span>.
  </h6></li>
  `;

  problemInfos.appendChild(problemData);
};

const addAttempButtonListeners = (
  problemNumber,
  successfulAttempts,
  failedAttempts
) => {
  let Attempt = document.getElementById("this-attempt");
  Attempt.innerHTML = "";

  let AddTitle = document.createElement("span");
  AddTitle.style = "font-size: 24px;";
  AddTitle.innerText = "Attempt:";

  let Successful = document.createElement("a");
  Successful.className = "waves-effect waves-light btn-small green lighten-2";
  Successful.innerText = "Successful";

  let Failed = document.createElement("a");
  Failed.className = "waves-effect waves-light btn-small red lighten-2";
  Failed.innerText = "Failed";

  Attempt.appendChild(AddTitle);
  Attempt.appendChild(Successful);
  Attempt.appendChild(Failed);

  Successful.addEventListener("click", () => {
    chrome.storage.sync.get([problemNumber], (attributes) => {
      chrome.storage.sync.set({
        [problemNumber]: {
          ...attributes[problemNumber],
          successfulAttempts: successfulAttempts + 1,
        },
      });
    });
    M.toast({ html: "Success!" });
    Successful.classList.add("disabled");
    Failed.classList.add("disabled");
    return true;
  });
  Failed.addEventListener("click", () => {
    chrome.storage.sync.get([problemNumber], (attributes) => {
      chrome.storage.sync.set({
        [problemNumber]: {
          ...attributes[problemNumber],
          failedAttempts: failedAttempts + 1,
        },
      });
    });
    M.toast({ html: "Success!" });
    Successful.classList.add("disabled");
    Failed.classList.add("disabled");
    return true;
  });
};

const addTodoListButtonListeners = (problemNumber, problemTitle) => {
  let Add = document.getElementById("add-to-todo-list");
  Add.innerHTML = "";
  let AddTitle = document.createElement("span");
  AddTitle.style = "font-size: 24px;";
  AddTitle.innerText = "TodoList:";

  let AddButton = document.createElement("a");
  AddButton.className = "waves-effect waves-light btn-small orange lighten-2";
  AddButton.innerText = "Add";
  Add.appendChild(AddTitle);
  Add.appendChild(AddButton);

  AddButton.addEventListener("click", () => {
    getTodoListPromise()
      .then((todoList) => {
        let updatedTodoList = {};
        if (!isObjectEmpty(todoList)) {
          let problems = Object.keys(todoList);
          if (!isInsideArray(problems, problemNumber)) {
            updatedTodoList = { ...todoList };
            updatedTodoList[problemNumber] = problemTitle;
          } else {
            M.toast({ html: "Already in todo list!" });
            return todoList;
          }
        } else {
          updatedTodoList[problemNumber] = problemTitle;
        }
        M.toast({ html: "Added!" });
        return updatedTodoList;
      })
      .then((updatedTodoList) => {
        chrome.storage.sync.set({
          ["todoList"]: updatedTodoList,
        });
      });
    return true;
  });
};

const addReviewQueueButtonListeners = (problemNumber, problemTitle) => {
  let Add = document.getElementById("add-to-review-queue");

  Add.innerHTML = "";
  let AddTitle = document.createElement("span");
  AddTitle.style = "font-size: 24px;";
  AddTitle.innerText = "ReviewQueue:";

  let AddButton = document.createElement("a");
  AddButton.className = "waves-effect waves-light btn-small orange lighten-2";
  AddButton.innerText = "Add";
  Add.appendChild(AddTitle);
  Add.appendChild(AddButton);

  AddButton.addEventListener("click", () => {
    getReviewDates().then((reviewDates) => {
      addToReviewQueue(problemNumber, problemTitle, reviewDates);
    });
    return true;
  });
};

const addToReviewQueue = (problemNumber, problemTitle, reviewDates) => {
  getReviewQueuePromise()
    .then((reviewQueue) => {
      let newData = {};
      if (!isObjectEmpty(reviewQueue)) {
        newData = { ...reviewQueue };
        reviewDates.map((reviewDate) => {
          if (!isObjectEmpty(newData[reviewDate])) {
            let problems = Object.keys(newData[reviewDate]);
            if (!isInsideArray(problems, problemNumber)) {
              newData[reviewDate][problemNumber] = problemTitle;
            } else {
              M.toast({ html: `${reviewDate}Already in review queue!` });
              return;
            }
          } else {
            newData[reviewDate] = {};
            newData[reviewDate][problemNumber] = problemTitle;
          }
        });
        return newData;
      } else {
        reviewDates.map((reviewDate) => {
          newData[reviewDate] = {};
          newData[reviewDate][problemNumber] = problemTitle;
        });
        return newData;
      }
    })
    .then((newData) => {
      chrome.storage.sync.set({
        reviewQueue: newData,
      });
      M.toast({ html: "Review queue updated!" });
    });
};

const addGenerateMarkdownListeners = (tab, number, title, difficulty) => {
  let tabUrl = tab.url;
  let Markdown = document.getElementById("generate-markdown");
  Markdown.innerHTML = "";

  let AddTitle = document.createElement("span");
  AddTitle.style = "font-size: 24px;";
  AddTitle.innerText = "Generate Markdown:";

  let DownloadButton = document.createElement("a");
  DownloadButton.className =
    "waves-effect waves-light btn-small orange lighten-2";
  DownloadButton.innerText = "Download";
  Markdown.appendChild(AddTitle);
  Markdown.appendChild(DownloadButton);

  DownloadButton.addEventListener("click", () => {
    let fileName = "leetCode-" + number + "-" + title + ".md";
    let blob;
    getMarkdownFromContentPromise(tab.id)
      .then((data) => {
        let content = `# ${number} ${title} \n \n`;
        content += `difficulty: ${difficulty} \n \n`;
        content += data.description;
        content += "\n \n ## Method One \n \n";
        content += data.code;
        blob = new Blob([content], {
          type: "text/plain;charset=utf-8",
        });
      })
      .then(() => {
        saveAs(blob, fileName);
      });
    return true;
  });

  let CopyMarkDownLinkButton = document.createElement("a");
  CopyMarkDownLinkButton.className =
    "waves-effect waves-light btn-small orange lighten-2";
  CopyMarkDownLinkButton.innerText = "CopyMD Link";
  Markdown.appendChild(CopyMarkDownLinkButton);
  CopyMarkDownLinkButton.addEventListener("click", () => {
    const el = document.createElement("textarea");
    el.value = `[${number}: ${title}](${tabUrl})`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    CopyMarkDownLinkButton.classList.add("disabled");
  });

  let CopyGitBookTitleButton = document.createElement("a");
  CopyGitBookTitleButton.className =
    "waves-effect waves-light btn-small orange lighten-2";
  CopyGitBookTitleButton.innerText = "Copy Gitbook Title";
  Markdown.appendChild(CopyGitBookTitleButton);
  CopyGitBookTitleButton.addEventListener("click", () => {
    const el = document.createElement("textarea");
    el.value = `[${number}. ${title}](leetCode-${number}-${title}.md)`;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    CopyGitBookTitleButton.classList.add("disabled");
  });
};
