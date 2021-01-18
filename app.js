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
  const search = document.querySelector('#search')
  search.addEventListener('keypress', setCity)

  function setCity(e) {
    if (e.keyCode == 13) {
      let city = search.value.trim()
      getDataToday(city)

    }
  }

  setCurrentDate()

  updateTimeForForecast()

}



// Get the data when a city is searched
function getDataToday(input) {
  fetch(`${api.base}/data/2.5/weather?q=${input}&units=metric&appid=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(weather => {
      results(weather)
      let lat = weather.coord.lat
      let long = weather.coord.lon;
      fetch(`${api.base}/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,daily,alerts&units=metric&appid=${api.key}`)
        .then(data => {
          return data.json()
        }).then((data) => {
          forecast(data)
        })
    });
}

function results(weather) {

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

  const uiWind = document.getElementById('wind');
  uiWind.innerText = `${weather.wind.speed} km/h`;

  const uiVisibility = document.getElementById('vis');
  uiVisibility.innerText = `${weather.visibility / 1000} km`;

  updateCityColor(weather)
  updateTempUi()

}

function forecast(data) {

  const uiTwo = document.getElementById("two-deg");
  uiTwo.innerText = `${Math.round(data.hourly[1].temp)}`

  const uiFour = document.getElementById("four-deg")
  uiFour.innerText = `${Math.round(data.hourly[3].temp)}`

  const uiSix = document.getElementById("six-deg")
  uiSix.innerText = `${Math.round(data.hourly[5].temp)}`

  const uiEight = document.getElementById("eight-deg")
  uiEight.innerText = `${Math.round(data.hourly[7].temp)}`

  setForecastTime(data)
  updateTempUi()

}

function updateTempUi() {

  let allDeg = document.querySelectorAll(".deg")
  let arrayAllDeg = Array.from(allDeg);
  arrayAllDeg.forEach(item => {
    if (item.innerText >= 20) {
      item.className = "deg"
      item.classList.add("hot")
    } else if (item.innerText >= 10 && item.innerText < 20) {
      item.className = "deg"
      item.classList.add("warm")
    } else if (item.innerText >= 0 && item.innerText < 10) {
      item.className = "deg"
      item.classList.add("okay")
    }
    else if (item.innerText < 0 && item.innerText >= -10) {
      item.className = "deg"
      item.classList.add("cold")
    } else if (item.innerText < -10) {
      item.className = "deg"
      item.classList.add("freezing")
    }
  })
}


function updateCityColor(data) {

  const moods = ["melting", "warm", "okay", "cold", "freezing"];
  let moodUi = document.getElementById("word")
  const city = document.getElementById("city")
  const img = document.getElementById("img")

  if (Math.round(data.main.temp) > 20) {
    city.className = "hot"
    moodUi.innerText = moods[0]
    img.setAttribute("data", `/assets/${moods[0]}.svg`)
  } else if (Math.round(data.main.temp) >= 10 && Math.round(data.main.temp) <= 20) {
    city.className = "warm"
    moodUi.innerText = moods[1]
    img.setAttribute("data", `/assets/${moods[1]}.svg`)
  } else if (Math.round(data.main.temp) >= 0 && Math.round(data.main.temp) < 10) {
    city.className = "okay"
    moodUi.innerText = moods[2]
    img.setAttribute("data", `/assets/${moods[2]}.svg`)
  } else if (Math.round(data.main.temp) < 0 && Math.round(data.main.temp) >= -10) {
    city.className = "cold"
    moodUi.innerText = moods[3]
    img.setAttribute("data", `/assets/${moods[3]}.svg`)
  } else {
    city.className = "freezing"
    moodUi.innerText = moods[4]
    img.setAttribute("data", `/assets/${moods[4]}.svg`)
  }

}

function setForecastTime(data) {

  const timezone = data.timezone_offset

  const howManyHours = timezone / 3600;

  const plusTwo = howManyHours + 2;
  const plusFour = howManyHours + 4;
  const plusSix = howManyHours + 6;
  const plusEight = howManyHours + 8;

  let two = new Date(new Date().getTime() + plusTwo * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })

  document.getElementById("two-time").innerText = `${two}`
  let four = new Date(new Date().getTime() + plusFour * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })

  document.getElementById("four-time").innerText = `${four}`
  let six = new Date(new Date().getTime() + plusSix * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })

  document.getElementById("six-time").innerText = `${six}`
  let eight = new Date(new Date().getTime() + plusEight * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })

  document.getElementById("eight-time").innerText = `${eight}`
  let clock = document.getElementById("clock")

  clock.innerText = `${new Date(new Date().getTime() + howManyHours * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })}`;

}


function setCurrentDate() {

  let date = new Date();
  let today = date.getDate() + ' ' + monthNames[(date.getMonth())] + ' ' + date.getFullYear();
  let clock = document.getElementById("clock")

  clock.innerText = `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  document.querySelector('#date').innerHTML = today;
}

function updateTimeForForecast() {

  let two = new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })
  document.getElementById("two-time").innerText = `${two}`

  let four = new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })
  document.getElementById("four-time").innerText = `${four}`

  let six = new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })
  document.getElementById("six-time").innerText = `${six}`

  let eight = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { timeStyle: 'short' })
  document.getElementById("eight-time").innerText = `${eight}`

}