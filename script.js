const api = {
  key: "b5ae2da97d4e02f3d9553652953919d8",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
const loadingIndicator = document.querySelector('.loading-indicator');

searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode === 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  showLoadingIndicator();
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      hideLoadingIndicator();
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(displayResults)
    .catch(error => alert(error.message));
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  setMainSectionBackground(weather.weather[0].main);
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function updateTime() {
  const now = new Date();
  const dateElement = document.querySelector('.location .date');
  dateElement.innerText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

function getCurrentLocationWeather() {
  showLoadingIndicator();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
        .then(response => {
          hideLoadingIndicator();
          if (!response.ok) {
            throw new Error('Location weather data not found');
          }
          return response.json();
        })
        .then(displayResults)
        .catch(error => alert(error.message));
    }, () => {
      hideLoadingIndicator();
      alert('Unable to retrieve your location');
    });
  } else {
    hideLoadingIndicator();
    alert("Geolocation is not supported by this browser.");
  }
}

function setMainSectionBackground(weatherCondition) {
  const mainSection = document.querySelector('main');
  let backgroundImage;

  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      backgroundImage = 'url(https://www.istockphoto.com/photo/blue-sky-with-bright-sun-and-clouds-gm1007768414-271886489?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fclear-weather&utm_medium=affiliate&utm_source=unsplash&utm_term=clear+weather%3A%3A%3A)';
      break;
    case 'clouds':
      backgroundImage = 'url(https://img.freepik.com/premium-photo/fluffy-white-clouds-floating-blue-sky_605022-27283.jpg?w=740)';
      break;
    case 'rain':
      backgroundImage = 'url(https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?cs=srgb&dl=pexels-hikaique-125510.jpg&fm=jpg)';
      break;
    case 'snow':
      backgroundImage = 'url(https://previews.123rf.com/images/linvo/linvo1611/linvo161100084/65752598-photo-of-snow-covered-field-and-trees-snowy-weather-winter-concept.jpg)';
      break;
    case 'thunderstorm':
      backgroundImage = 'url(https://e7.pngegg.com/pngimages/363/126/png-clipart-thunderstorm-catatumbo-lightning-severe-weather-lightning-atmosphere-cloud.png)';
      break;
    case 'drizzle':
      backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4QSK1tVZcV4eRvxStIVUFS45GFGmRp54zTQ&s)';
      break;
    default:
      backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWtIuIxAWUq3U-XKWRyMMxVGFJIiGH-A3Xzw&s)';
      break;
  }

  mainSection.style.backgroundImage = backgroundImage;
}

function showLoadingIndicator() {
  loadingIndicator.style.display = 'block';
}

function hideLoadingIndicator() {
  loadingIndicator.style.display = 'none';
}

// Update time every second
setInterval(updateTime, 1000);

// Fetch weather for the current location on load
window.onload = getCurrentLocationWeather;
