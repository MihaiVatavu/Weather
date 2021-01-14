const api = {
  key: "2300200fe12257b49d70e27b967e9aeb",
  base: "https://api.openweathermap.org"
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

window.addEventListener('load', () => {

  init()
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      // Get the data for current weather
      fetch(`${api.base}/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${api.key}`)
        .then(weather => {
          return weather.json();
        }).then(results);

      // Get the date for forecast weather
      fetch(`${api.base}/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,daily,alerts&units=metric&appid=${api.key}`)
        .then(forecast => {
          return forecast.json();
        }).then(forecast)
    })
  } else {
    alert("Either your browser does not support geolocation or you have not activate it")
  }
})


function init() {

  // Get the current date
  let date = new Date();
  let today = date.getDate() + ' ' + monthNames[(date.getMonth())] + ' ' + date.getFullYear();
  // Write in the UI the date
  document.querySelector('#date').innerHTML = today;

  let dates = [];

  // Get the following 4 days date
  let first = new Date(date.getTime() + (24 * 60 * 60 * 1000));
  let second = new Date(first.getTime() + (24 * 60 * 60 * 1000));
  let third = new Date(second.getTime() + (24 * 60 * 60 * 1000));
  let forth = new Date(third.getTime() + (24 * 60 * 60 * 1000));
  dates.push(first, second, third, forth)

  // get all the forecast divs
  const forecastUiDates = document.querySelectorAll('.day')
  // console.log(forecastUiDates)

  forecastUiDates.forEach((div, index) => {
    let writeForecastDate = dates[index].getDate() + ' ' + monthNames[(dates[index].getMonth())] + ' ' + dates[index].getFullYear()
    div.firstElementChild.innerHTML = writeForecastDate;
  })

}

const search = document.querySelector('#search')
search.addEventListener('keypress', setCity)

function setCity(e) {
  if (e.keyCode == 13) {
    let city = search.value.trim()
    getDataToday(city)
  }
}

function getDataToday(input) {
  fetch(`${api.base}/data/2.5/weather?q=${input}&units=metric&appid=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(results);
}

function results(weather) {

  console.log(weather)
  const uiCity = document.getElementById('city')
  uiCity.innerText = `${weather.name} `;
  const uiCurrent = document.getElementById('now-weather');
  uiCurrent.innerText = `${Math.round(weather.main.temp)}`;
  const uiRealFeel = document.getElementById("real-feel");
  uiRealFeel.innerText = `${Math.round(weather.main.feels_like)}`
  const uiMin = document.getElementById('min');
  uiMin.innerText = `${Math.round(weather.main.temp_min)}`;
  const uiMax = document.getElementById('max');
  uiMax.innerText = `${Math.round(weather.main.temp_max)}`
  // Change wether condition text
  const uiWind = document.getElementById('wind');
  uiWind.innerText = `${weather.wind.speed} km/h`;
  const uiVisibility = document.getElementById('vis');
  uiVisibility.innerText = `${weather.visibility / 1000} km`;



  updateUi(weather)

}

function forecast(data) {
  console.log(data)
}

function updateUi(data) {

  // console.log(data)

}