import "./styles.css"
import { updateDisplay } from "./display";

async function getData(location, isChecked) {
  // try {
    const unit = isChecked ? "us" : "metric"
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=WDYABNRBGXHMMTQQH89WYKZ9D`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`There was an error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  // } catch (error) {
  //   console.error("An error occurred:", error.message);
  // }
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

const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const loc = form.querySelector("input[type='text']").value.trim();
  const unit = form.querySelector("input[type='checkbox']").checked

  getData(loc, unit)
    .then(processData)
    .then(updateDisplay)
    .catch((e) => console.error(e));
});
