const main = document.getElementById("content")

export function updateDisplay(data) {
  const todayInfo = document.createElement("div")
  todayInfo.className = "info"
  const cityName = document.createElement("div")
  cityName.className = "city-name"
  const todayTemp = document.createElement("div")
  todayTemp.className = "temp main"

  cityName.textContent = data.city
  todayTemp.textContent = data.currentTemp

  todayInfo.appendChild(cityName)
  todayInfo.appendChild(todayTemp)

  main.innerHTML = ""
  main.appendChild(todayInfo)
}