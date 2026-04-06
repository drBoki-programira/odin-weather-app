function makeChildOf(parent, tag, properties) {
  const child = document.createElement(tag);

  for (const [property, value] of Object.entries(properties)) {
    child[property] = value;
  }

  parent.appendChild(child);
  return child;
}

function makeTempRange(parent, max, min) {
  const tempRange = makeChildOf(parent, "div", {"className": "temp-range"})
  makeChildOf(tempRange, "div", {"textContent": max})
  makeChildOf(tempRange, "div", {"textContent": min})

  return tempRange
}

function makeBottomRow(parent, uv, wd, ws, rp) {
  const bottom = makeChildOf(parent, "div", {"className": "bottom"})
  makeChildOf(bottom, "div", {"textContent": `UV ${uv}`})
  makeChildOf(bottom, "div", {"textContent": wd})
  makeChildOf(bottom, "div", {"textContent": ws})
  makeChildOf(bottom, "div", {"textContent": rp})

  return bottom
}

export function updateDisplay(data) {
  const main = document.getElementById("content")
  main.innerHTML = ""

  const todayInfo = makeChildOf(main, "div", {"className": "info"})
  makeChildOf(todayInfo, "div", {"textContent": data.city})

  const middle = makeChildOf(todayInfo, "div", {"className": "middle"})
  makeChildOf(middle, "div", {"textContent": data.currentIcon})
  makeChildOf(middle, "div", {"className": "temp", "textContent": data.currentTemp})
  makeTempRange(middle, data.todayMax, data.todayMin)

  makeBottomRow(todayInfo, data.uvIndex, data.windDirection, data.windSpeed, data.rainProb)
  makeChildOf(todayInfo, "hr", {})

  const forecast = makeChildOf(todayInfo, "div", {"className": "bottom"})

  for (let i = 1; i < 4; i++) {
    const box = makeChildOf(forecast, "div", {"className": "box"})
    makeChildOf(box, "div", {"textContent": "DAY"})
    const middle = makeChildOf(box, "div", {"className": "middle"})
    makeChildOf(middle, "div", {"textContent": data[`day${i}icon`]})
    makeTempRange(middle, data[`day${i}Max`], data[`day${i}Min`])
    makeBottomRow(box, data[`day${i}uv`], data[`day${i}wd`], data[`day${i}ws`], data[`day${i}rp`])
  }
}