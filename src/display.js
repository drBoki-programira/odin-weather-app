import uvIcon from "./assets/svgs/uv.svg";
import wdIcon from "./assets/svgs/wd.svg";
import wsIcon from "./assets/svgs/ws.svg";
import rpIcon from "./assets/svgs/rp.svg";
import { addDays, format } from "date-fns";

function makeChildOf(parent, tag, properties) {
  const child = document.createElement(tag);

  for (const [property, value] of Object.entries(properties)) {
    child[property] = value;
  }

  parent.appendChild(child);
  return child;
}

function listDays() {
  const list = [];
  const today = new Date();

  for (let i = 0; i < 4; i++) {
    list.push(addDays(today, i));
  }

  return list.map((day) => format(day, "EEE"));
}

function transformDirection(degree) {
  if (degree >= 337.5 || degree < 22.5) {
    return "N";
  } else if (degree >= 22.5 || degree < 67.5) {
    return "NE";
  } else if (degree >= 67.5 || degree < 112.5) {
    return "E";
  } else if (degree >= 112.5 || degree < 157.5) {
    return "SE";
  } else if (degree >= 157.5 || degree < 202.5) {
    return "S";
  } else if (degree >= 202.5 || degree < 247.5) {
    return "SW";
  } else if (degree >= 247.5 || degree < 292.5) {
    return "W";
  } else if (degree >= 292.5 || degree < 337.5) {
    return "NW";
  } else {
    return "N/A";
  }
}

function capitalize(string) {
  if (/\s/.test(string)) {
    const arr = string.split(" ");
    return arr.map((str) => capitalize(str)).join(" ");
  } else {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}

function makeTempRange(parent, max, min, unit) {
  const tempRange = makeChildOf(parent, "div", { className: "temp-range" });
  makeChildOf(tempRange, "div", { className: `${unit} max`, textContent: max });
  makeChildOf(tempRange, "div", { className: `${unit} min`, textContent: min });

  return tempRange;
}

function makeBottomRow(parent, uv, wd, ws, rp, unit) {
  const speedUnit = unit === "us" ? "mph" : "kmh";

  const bottom = makeChildOf(parent, "div", { className: "bottom" });
  const uvDiv = makeChildOf(bottom, "div", { className: "mini-info" });
  makeChildOf(uvDiv, "img", { src: uvIcon });
  makeChildOf(uvDiv, "div", { textContent: uv });

  const rpDiv = makeChildOf(bottom, "div", { className: "mini-info" });
  const rpIconContainer = makeChildOf(rpDiv, "div", {
    className: "img-container",
  });
  makeChildOf(rpIconContainer, "img", { src: rpIcon });
  makeChildOf(rpDiv, "div", { textContent: `${rp} %` });

  const wdDiv = makeChildOf(bottom, "div", { className: "mini-info" });
  makeChildOf(wdDiv, "img", { src: wdIcon });
  makeChildOf(wdDiv, "div", { textContent: transformDirection(wd) });

  const wsDiv = makeChildOf(bottom, "div", { className: "mini-info" });
  const wsIconContainer = makeChildOf(wsDiv, "div", {
    className: "img-container",
  });
  makeChildOf(wsIconContainer, "img", { src: wsIcon });
  makeChildOf(wsDiv, "div", { textContent: `${ws} ${speedUnit}` });

  return bottom;
}

async function makeSvgImg(parent, name, size) {
  const iconModule = await import(`./assets/svgs/${name}.svg`);
  const imgContainer = makeChildOf(parent, "div", {
    className: "img-container",
  });
  makeChildOf(imgContainer, "img", {
    src: iconModule.default,
    className: size,
  });
}

export function updateDisplay(data) {
  const main = document.getElementById("content");
  main.innerHTML = "";

  const todayInfo = makeChildOf(main, "div", { className: "info" });
  makeChildOf(todayInfo, "div", {
    className: "city-name",
    textContent: capitalize(data.city),
  });

  const middle = makeChildOf(todayInfo, "div", { className: "middle" });
  makeTempRange(middle, data.todayMax, data.todayMin, data.unit);
  makeChildOf(middle, "div", {
    className: `${data.unit} big`,
    textContent: data.currentTemp,
  });
  makeSvgImg(middle, data.currentIcon, "big-svg");

  makeBottomRow(
    todayInfo,
    data.uvIndex,
    data.windDirection,
    data.windSpeed,
    data.rainProb,
    data.unit,
  );
  makeChildOf(todayInfo, "hr", {});

  const forecast = makeChildOf(todayInfo, "div", { className: "bottom" });
  const days = listDays();

  for (let i = 1; i < 4; i++) {
    const box = makeChildOf(forecast, "div", { className: "box" });
    makeChildOf(box, "div", { textContent: days[i] });

    const middle = makeChildOf(box, "div", { className: "middle" });
    makeTempRange(middle, data[`day${i}Max`], data[`day${i}Min`], data.unit);
    makeSvgImg(middle, data[`day${i}icon`], "small-svg");

    makeBottomRow(
      box,
      data[`day${i}uv`],
      data[`day${i}wd`],
      data[`day${i}ws`],
      data[`day${i}rp`],
      data.unit,
    );
  }
}

export function displayError(input) {
  const main = document.getElementById("content");
  main.innerHTML = "";

  makeChildOf(main, "div", {
    className: "error",
    textContent: `Oops, could't find ${input}. Please try again`,
  });
}

export function loadingScreen() {
  const main = document.getElementById("content");
  main.innerHTML = "";

  makeChildOf(main, "div", {
    className: "loading",
    textContent: `Loading ...`,
  });
}
