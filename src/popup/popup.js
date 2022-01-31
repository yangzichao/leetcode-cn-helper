import { generateCurrentProblem } from "./tabs/currentProblem.js";
import { generateTodoList } from "./tabs/todoList.js";
import { generateReviewQueue } from "./tabs/reviewQueue.js";

const headerOnMismatch = document.getElementById("header-on-mismatch");
const headerOnProblemSet = document.getElementById("header-on-problem-set");
const headerOnMatch = document.getElementById("header-on-match");
const navTabs = document.getElementById("nav-tabs");
const currentProblem = document.getElementById("current-problem");

document.addEventListener("DOMContentLoaded", () => {
  let tabElems = document.querySelectorAll(".tabs");
  let tabs = M.Tabs.init(tabElems);
});

chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  (tabs) => {
    initiate(tabs);
  }
);

const initiate = (tabs) => {
  let currTab = tabs[0];
  let currURL = currTab.url;
  if (currURL.match("https://leetcode.com/problems/[^/]*/$")) {
    headerOnMismatch.style.display = "none";
    headerOnProblemSet.style.display = "none";
    generateCurrentProblem(currTab);
    initiateTabs(currTab);
  } else if (currURL.match("https://leetcode.com/problemset/all/")) {
    headerOnMatch.style.display = "none";
    headerOnMismatch.style.display = "none";
    navTabs.style.display = "none";
    currentProblem.style.display = "none";
  } else {
    headerOnProblemSet.style.display = "none";
    headerOnMatch.style.display = "none";
    navTabs.style.display = "none";
    currentProblem.style.display = "none";
  }
};

const initiateTabs = (tab) => {
  let goToCurrentProblem = document.getElementById("go-to-current-problem");
  let goToTodoList = document.getElementById("go-to-todo-list");
  let goToReviewQueue = document.getElementById("go-to-review-queue");

  goToCurrentProblem.addEventListener("click", () => {
    generateCurrentProblem(tab);
  });
  goToTodoList.addEventListener("click", () => {
    generateTodoList();
  });
  goToReviewQueue.addEventListener("click", () => {
    generateReviewQueue();
  });
};
