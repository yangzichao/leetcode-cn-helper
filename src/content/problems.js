chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "getContent") {
    let res = {};

    // Basic Info
    let titleStr = document.querySelector(".css-v3d350").textContent;
    // Title
    let title = titleStr
      .substring(titleStr.indexOf(".") + 1)
      .trim()
      .split(" ")
      .join("-");
    res["title"] = title;

    // Problem Number
    let rawNumber = parseInt(titleStr.substring(0, titleStr.indexOf(".")));
    let number;
    if (rawNumber < 10) {
      number = "00" + rawNumber;
    } else if (rawNumber < 100) {
      number = "0" + rawNumber;
    } else {
      number = rawNumber.toString();
    }
    res["number"] = number;

    // Difficulty
    let hard = document.querySelector(".css-t42afm");
    let medium = document.querySelector(".css-dcmtd5");
    let easy = document.querySelector(".css-14oi08n");
    hard = hard !== null ? hard.innerText : "";
    medium = medium !== null ? medium.innerText : "";
    easy = easy !== null ? easy.innerText : "";
    res["difficulty"] = hard + medium + easy;

    getInfosFromStoragePromise(number)
      .then((infos) => {
        res["acRate"] = infos.acRate ?? "no data";
        res["frequency"] = infos.frequency ?? "no data";
      })
      .then(() => {
        sendResponse({ data: res });
      });
  }

  if (request.method === "generateMarkdown") {
    // Problem Description
    new Promise((resolve) => {
      let res = {};
      let descriptionHTML = document
        .querySelector(".question-content__JfgR")
        .innerHTML.replace(/^\s*[\r\n]/gm, "");
      style =
        "<style>\n\
        section pre{\n\
          background-color: #eee;\n\
          border: 1px solid #ddd;\n\
          padding:10px;\n\
          border-radius: 5px;\n\
        }\n\
      </style>\n";
      descriptionHTML = style + "<section>\n" + descriptionHTML + "</section>";
      res["description"] = descriptionHTML;

      // Code
      let codeLines = document.querySelectorAll(".CodeMirror-line");
      let code = "";
      Object.keys(codeLines).map((key) => {
        code += codeLines[key].innerText + "\n";
      });

      let codeType = document.querySelector(
        ".ant-select-selection-selected-value"
      ).title;

      switch (codeType) {
        case "c++":
          codeType = "cpp";
          break;
        case "python3":
          codeType = "python";
          break;
        case "c#":
          codeType = "csharp";
          break;
      }

      code = "``` " + codeType + "\n" + code + "```";
      res["code"] = code;
      resolve(res);
    }).then((res) => {
      sendResponse({ data: res });
    });
  }
  // You must return true here!
  // https://developer.chrome.com/extensions/runtime#event-onMessage
  // If not return true, I will have this:
  // Unchecked runtime.lastError: The message port closed before a response was received.
  return true;
});

const getInfosFromStoragePromise = (problemNumber) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([problemNumber], (problemInfos) => {
      if (JSON.stringify(problemInfos) !== "{}") {
        resolve(problemInfos[problemNumber]);
      } else {
        resolve({});
      }
    });
  });
};
