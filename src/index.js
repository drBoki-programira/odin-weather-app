import "./styles.css";
import { updateDisplay, displayError, loadingScreen } from "./display";

async function getData(location, isChecked) {
  const unit = isChecked ? "us" : "metric";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=WDYABNRBGXHMMTQQH89WYKZ9D`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`There was an error: ${response.status}`);
  }

  const data = await response.json();
  data.unit = unit;

  return data;
}

function processData(data) {
  console.log(data);
  return {
    unit: data.unit,
    city: data.resolvedAddress,
    currentIcon: data.currentConditions.icon,
    currentTemp: data.currentConditions.temp,
    todayMax: data.days["0"].tempmax,
    todayMin: data.days["0"].tempmin,
    rainProb: data.currentConditions.precipprob,
    uvIndex: data.currentConditions.uvindex,
    windDirection: data.currentConditions.winddir,
    windSpeed: data.currentConditions.windspeed,
    day1Max: data.days["1"].tempmax,
    day1Min: data.days["1"].tempmin,
    day1icon: data.days["1"].icon,
    day1rp: data.days["1"].precipprob,
    day1uv: data.days["1"].uvindex,
    day1wd: data.days["1"].winddir,
    day1ws: data.days["1"].windspeed,
    day2Max: data.days["2"].tempmax,
    day2Min: data.days["2"].tempmin,
    day2icon: data.days["2"].icon,
    day2rp: data.days["2"].precipprob,
    day2uv: data.days["2"].uvindex,
    day2wd: data.days["2"].winddir,
    day2ws: data.days["2"].windspeed,
    day3Max: data.days["3"].tempmax,
    day3Min: data.days["3"].tempmin,
    day3icon: data.days["3"].icon,
    day3rp: data.days["3"].precipprob,
    day3uv: data.days["3"].uvindex,
    day3wd: data.days["3"].winddir,
    day3ws: data.days["3"].windspeed,
  };
}

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.getElementById("city-input");
  const location = nameInput.value.trim();
  nameInput.value = "";
  const unit = document.getElementById("unit-input").checked;

  loadingScreen();

  getData(location, unit)
    .then(processData)
    .then(updateDisplay)
    .catch((e) => {
      console.error(e);
      displayError(location);
    });
});
