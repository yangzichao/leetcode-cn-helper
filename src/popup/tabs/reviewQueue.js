import { getReviewQueuePromise } from "../../promises/storagePromises.js";

import { isObjectEmpty } from "../helpers.js";

export const generateReviewQueue = () => {
  const tabReviewQueue = document.getElementById("review-queue");
  tabReviewQueue.innerHTML = "";
  const leetcodeProblems = "https://leetcode.com/problems/";

  getReviewQueuePromise().then((reviewQueue) => {
    if (isObjectEmpty(reviewQueue)) {
      return;
    }
    Object.keys(reviewQueue).map((date) => {
      if (isObjectEmpty(date)) {
        return;
      }
      let reviewQueueOfDate = document.createElement("ul");
      reviewQueueOfDate.classList.add("collection");
      reviewQueueOfDate.classList.add("with-header");
      let headerOfDate = document.createElement("li");
      headerOfDate.classList.add("collection-header");
      headerOfDate.innerHTML = `<h4>${date}: </h4>`;
      reviewQueueOfDate.appendChild(headerOfDate);
      Object.keys(reviewQueue[date]).map((problemNumber) => {
        let reviewProblemTitle = reviewQueue[date][problemNumber].toLowerCase();
        let reviewProblemItem = document.createElement("li");
        reviewProblemItem.classList.add("collection-item");

        let itemInnerDiv = document.createElement("div");
        itemInnerDiv.textContent = `${problemNumber}: ${reviewProblemTitle}`;

        let goToProblem = document.createElement("a");
        goToProblem.classList.add("secondary-content");
        goToProblem.href = `${leetcodeProblems + reviewProblemTitle}`;
        goToProblem.target = "_blank";

        let goToIcon = document.createElement("i");
        goToIcon.textContent = "send";
        goToIcon.classList.add("material-icons");
        goToProblem.appendChild(goToIcon);

        let deleteItem = document.createElement("a");
        deleteItem.classList.add("secondary-content");

        let deleteIcon = document.createElement("i");
        deleteIcon.textContent = "delete";
        deleteIcon.classList.add("material-icons");
        deleteItem.appendChild(deleteIcon);
        deleteItem.style.cursor = "pointer";
        deleteItem.addEventListener("click", () => {
          removeFromReviewQueue(date, problemNumber);
        });

        itemInnerDiv.appendChild(goToProblem);
        itemInnerDiv.appendChild(deleteItem);
        reviewProblemItem.appendChild(itemInnerDiv);

        reviewQueueOfDate.appendChild(reviewProblemItem);
      });
      tabReviewQueue.appendChild(reviewQueueOfDate);
    });
  });
};

const removeFromReviewQueue = (date, problemNumber) => {
  getReviewQueuePromise()
    .then((reviewQueue) => {
      let updatedReviewQueue = { ...reviewQueue };
      let updatedList = { ...reviewQueue[date] };
      delete updatedList[problemNumber];
      if (isObjectEmpty(updatedList)) {
        delete updatedReviewQueue[date];
      } else {
        updatedReviewQueue[date] = updatedList;
      }

      chrome.storage.sync.set({ reviewQueue: updatedReviewQueue });
      M.toast({ html: "Removed!" });
    })
    .then(() => {
      generateReviewQueue();
    });
};
