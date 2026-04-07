function makeChildOf(parent, tag, properties) {
  const child = document.createElement(tag);

  for (const [property, value] of Object.entries(properties)) {
    child[property] = value;
  }

  parent.appendChild(child);
  return child;
}

function makeTempRange(parent, max, min, unit) {
  const tempRange = makeChildOf(parent, "div", {"className": "temp-range"})
  makeChildOf(tempRange, "div", {"className": `${unit} max`, "textContent": max})
  makeChildOf(tempRange, "div", {"className": `${unit} min`, "textContent": min})

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

async function makeSvgImg(parent, name, size) {
  const iconModule = await import(`./assets/svgs/${name}.svg`)
  const imgContainer = makeChildOf(parent, "div", {"className": "img-container"})
  makeChildOf(imgContainer, "img", {"src": iconModule.default, "className": size})
}

export function updateDisplay(data) {
  const main = document.getElementById("content")
  main.innerHTML = ""

  const todayInfo = makeChildOf(main, "div", {"className": "info"})
  makeChildOf(todayInfo, "div", {"className": "city-name", "textContent": data.city})

  const middle = makeChildOf(todayInfo, "div", {"className": "middle"})
  makeTempRange(middle, data.todayMax, data.todayMin, data.unit)
  makeChildOf(middle, "div", {"className": `${data.unit} big`, "textContent": data.currentTemp})
  makeSvgImg(middle, data.currentIcon, "big-svg")

  makeBottomRow(todayInfo, data.uvIndex, data.windDirection, data.windSpeed, data.rainProb)
  makeChildOf(todayInfo, "hr", {})

  const forecast = makeChildOf(todayInfo, "div", {"className": "bottom"})

  for (let i = 1; i < 4; i++) {
    const box = makeChildOf(forecast, "div", {"className": "box"})
    makeChildOf(box, "div", {"textContent": "DAY"})
    
    const middle = makeChildOf(box, "div", {"className": "middle"})
    makeTempRange(middle, data[`day${i}Max`], data[`day${i}Min`], data.unit)
    makeSvgImg(middle, data[`day${i}icon`], "small-svg")

    makeBottomRow(box, data[`day${i}uv`], data[`day${i}wd`], data[`day${i}ws`], data[`day${i}rp`])
  }
}