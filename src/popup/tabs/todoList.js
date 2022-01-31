import { getTodoListPromise } from "../../promises/storagePromises.js";

import { isObjectEmpty } from "../helpers.js";

export const generateTodoList = () => {
  const tabTodoList = document.getElementById("todo-list");
  tabTodoList.innerHTML = "";
  const leetcodeProblems = "https://leetcode.com/problems/";

  getTodoListPromise().then((todoList) => {
    if (isObjectEmpty(todoList)) {
      return;
    }
    let todoListUl = document.createElement("ul");
    todoListUl.classList.add("collection");
    Object.keys(todoList).map((problemNumber) => {
      let todoProblemTitle = todoList[problemNumber];
      let todoListItem = document.createElement("li");
      todoListItem.classList.add("collection-item");

      let itemInnerDiv = document.createElement("div");
      itemInnerDiv.textContent = `${problemNumber}: ${todoProblemTitle}`;

      let goToProblem = document.createElement("a");
      goToProblem.classList.add("secondary-content");
      goToProblem.href = `${leetcodeProblems + todoProblemTitle}`;
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
        removeFromTodoList(problemNumber);
      });

      itemInnerDiv.appendChild(goToProblem);
      itemInnerDiv.appendChild(deleteItem);
      todoListItem.appendChild(itemInnerDiv);

      todoListUl.appendChild(todoListItem);
    });
    tabTodoList.appendChild(todoListUl);
  });
};

const removeFromTodoList = (problemNumber) => {
  getTodoListPromise()
    .then((todoList) => {
      let updatedTodoList = { ...todoList };
      delete updatedTodoList[problemNumber];
      chrome.storage.sync.set({ todoList: updatedTodoList });
      M.toast({ html: "Removed!" });
    })
    .then(() => {
      generateTodoList();
    });
};
