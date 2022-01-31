export const isInsideArray = (array, item) => {
  return array.filter((element) => {
    return element === item;
  }).length === 0
    ? false
    : true;
};

export const isObjectEmpty = (obj) => {
  return JSON.stringify(obj) === "{}" || obj === undefined;
};

export const getDifficultyColor = (difficulty) => {
  if (difficulty === "Easy") {
    return "green-text";
  } else if (difficulty === "Medium") {
    return "yellow-text";
  } else {
    return "red-text";
  }
};

export const getFrequencyColor = (frequency) => {
  let numfrequency = parseFloat(frequency.substring(0, frequency.length - 1));

  if (numfrequency > 60) {
    return "green-text";
  } else if (numfrequency > 30) {
    return "yellow-text";
  } else {
    return "blue-text";
  }
};

export const getReviewDates = () => {
  return new Promise((resolve) => {
    const msPerDay = 86400000;
    let curDate = new Date().getTime();
    let reviewIntervals = [1, 2, 5, 6, 10];
    let dates = [];
    reviewIntervals.forEach((interval) => {
      dates.push(getFormatedDate(new Date(curDate + interval * msPerDay)));
    });
    resolve(dates);
  });
};

const getFormatedDate = (now) => {
  let year = now.getFullYear().toString();
  let month = now.getMonth() + 1;
  month = month < 10 ? "0" + month.toString() : month.toString();
  let date = now.getDate();
  date = date < 10 ? "0" + date.toString() : date.toString();
  return year + "-" + month + "-" + date;
};
