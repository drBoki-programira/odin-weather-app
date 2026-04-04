async function getData(location) {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=WDYABNRBGXHMMTQQH89WYKZ9D`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`There was an error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

function processData(data) {
  console.log(data);
  return {
    city: data.resolvedAddress,
    currentConditions: data.currentConditions.conditions,
    currentTemp: data.currentConditions.temp,
    todayMax: data.days["0"].tempmax,
    todayMin: data.days["0"].tempmin,
  };
}

function displayData(data) {
  console.log("Location", data.city);
  console.log("Current temperatue", data.currentTemp);
  console.log("MIN ", data.todayMin, " MAX ", data.todayMax);
  console.log("Current conditions ", data.currentConditions);
}

const input = document.querySelector("input");
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const loc = input.value.trim();
  getData(loc)
    .then(processData)
    .then(displayData)
    .catch((e) => console.error(e));
});
