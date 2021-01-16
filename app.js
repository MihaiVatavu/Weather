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

  // Get the following 8 hours and update the UI with the correct time

  let two = new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour: 'numeric', hour24: true })
  document.getElementById("two-time").innerText = `${two.slice(0, 2)}`
  let four = new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour: 'numeric', hour24: true })
  document.getElementById("four-time").innerText = `${four.slice(0, 2)}`
  let six = new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour: 'numeric', hour24: true })
  document.getElementById("six-time").innerText = `${six.slice(0, 2)}`
  let eight = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour: 'numeric', hour24: true })
  document.getElementById("eight-time").innerText = `${eight.slice(0, 2)}`


  const search = document.querySelector('#search')
  search.addEventListener('keypress', setCity)

  function setCity(e) {
    if (e.keyCode == 13) {
      let city = search.value.trim()
      getDataToday(city)

    }
  }

  // const forecast = document.querySelector(".forecast")
  // console.log(forecast)

  // const formatHours = time.toLocaleString('en-US', { hour: 'numeric', hour12: true })


  // Get all the am/pm class elements

  // })

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
  // console.log(weather)
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

  updateCityColor(weather)
  updateTempUi()
  // currentTempUiNow()
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

  updateTempUi()

}

function updateTempUi() {

  let allDeg = document.querySelectorAll(".deg")
  let arrayAllDeg = Array.from(allDeg);
  arrayAllDeg.forEach(item => {
    console.log(item)
    if (item.innerText >= 20) {
      item.className = "deg"
      item.classList.add("hot")
    } else if (item.innerText >= 0 && item.innerText < 20) {
      item.className = "deg"
      item.classList.add("warm")
    } else if (item.innerText < 0 && item.innerText >= -10) {
      item.className = "deg"
      item.classList.add("cold")
    } else if (item.innerText < -10) {
      item.className = "deg"
      item.classList.add("freezing")
    }
  })
  console.log(arrayAllDeg)
}


function updateCityColor(data) {
  const moods = ["melting", "warm", "cold", "freezing"];
  let moodUi = document.getElementById("word")
  const city = document.getElementById("city")
  if (Math.round(data.main.temp) > 20) {
    city.className = "hot"
    moodUi.innerText = moods[0]
  } else if (Math.round(data.main.temp) >= 0 && Math.round(data.main.temp) <= 20) {
    city.className = "warm"
    moodUi.innerText = moods[1]
  } else if (Math.round(data.main.temp) < 0 && Math.round(data.main.temp) >= -10) {
    city.className = "cold"
    moodUi.innerText = moods[2]
  } else {
    city.className = "freezing"
    moodUi.innerText = moods[3]
  }

}

function currentTempUiNow() {
  let currentDiv = document.querySelector(".now")
  console.log(currentDiv)
  let elements = currentDiv.querySelectorAll(".deg")
  console.log(elements)
}