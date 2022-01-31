window.onload = () => {
  let problems = document.getElementsByClassName("reactable-data");
  setTimeout(() => {
    collectProblemsInfos(problems[0]);
  }, 5000);

  getAll();
};

const collectProblemsInfos = (problems) => {
  Object.entries(problems.childNodes).map((problem) => {
    let infos = problem[1].cells;
    let rawNumber = parseInt(infos[1].innerText);
    let number;
    if (rawNumber < 10) {
      number = "00" + rawNumber;
    } else if (rawNumber < 100) {
      number = "0" + rawNumber;
    } else {
      number = rawNumber.toString();
    }
    let title = infos[2].innerText.trim().split(" ").join("-");
    let acRate = infos[4].innerText;
    let difficulty = infos[5].innerText;
    let frequency =
      parseFloat(
        infos[6].getElementsByClassName("progress-bar")[0].style.width
      ).toString() + "%";
    updateProblemsInfos(number, title, acRate, difficulty, frequency);
  });
};

const updateProblemsInfos = (number, title, acRate, difficulty, frequency) => {
  chrome.storage.local.get([number], (attributes) => {
    chrome.storage.local.set({
      [number]: {
        ...attributes[number],
        title: title,
        acRate: acRate,
        difficulty: difficulty,
        frequency: frequency,
      },
    });
  });
};

const getAll = () => {
  chrome.storage.local.get(null, (problems) => {
    Object.entries(problems).map((problem) => console.log(problem));
  });
};
