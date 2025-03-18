const apiKey = "82005d27a116c2880c8f0fcb866998a0"; // Replace with your API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const forecastContainer = document.getElementById("forecast");
const weatherIcon = document.getElementById("weatherIcon");
const loader = document.getElementById("loader");
const weatherInfo = document.querySelector(".weather-info");

// Show loader function
function showLoader() {
  loader.style.display = "block";
}

// Hide loader function
function hideLoader() {
  loader.style.display = "none";
}

// Show content with animation
function showContent() {
  weatherInfo.classList.add("show");
  forecastContainer.classList.add("show");
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  } else {
    displayError("Please enter a city name.");
  }
});

// Fetch current weather by city name
async function fetchWeather(city) {
  try {
    showLoader();
    weatherInfo.classList.remove("show");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    hideLoader();

    if (data.cod === 200) {
      displayWeather(data);
      showContent();
    } else {
      displayError("City not found. Please try again.");
    }
  } catch (error) {
    hideLoader();
    displayError("Network error. Please check your connection.");
  }
}

// Fetch 5-day forecast by city name
async function fetchForecast(city) {
  try {
    showLoader();
    forecastContainer.classList.remove("show");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    hideLoader();

    if (data.cod === "200") {
      displayForecast(data);
      showContent();
    } else {
      displayError("Forecast data not available.");
    }
  } catch (error) {
    hideLoader();
    displayError("Network error. Please check your connection.");
  }
}

// Function to set background based on weather condition
function setBackground(weatherCondition) {
  const body = document.body;
  body.className = ""; // Reset any existing classes

  if (weatherCondition.includes("clear")) {
    body.classList.add("clear");
  } else if (weatherCondition.includes("cloud")) {
    body.classList.add("cloudy");
  } else if (weatherCondition.includes("rain")) {
    body.classList.add("rainy");
  } else if (weatherCondition.includes("snow")) {
    body.classList.add("snowy");
  } else {
    body.classList.add("sunny"); // Default background
  }
}

// Display current weather and icon
function displayWeather(data) {
  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  description.textContent = `Weather: ${data.weather[0].description}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  // Set weather icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
  weatherIcon.style.display = "block";

  // Set background based on weather condition
  setBackground(data.weather[0].main.toLowerCase());
}

// Display 5-day forecast horizontally
function displayForecast(data) {
  forecastContainer.innerHTML = "<h3>5-Day Forecast</h3>";
  forecastContainer.style.display = "flex";

  const dailyForecasts = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = item;
    }
  });

  Object.keys(dailyForecasts).slice(0, 5).forEach((date) => {
    const forecast = dailyForecasts[date];
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");
    forecastElement.innerHTML = `
      <p><strong>${date}</strong></p>
      <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
      <p>Temp: ${forecast.main.temp}°C</p>
      <p>${forecast.weather[0].description}</p>
    `;
    forecastContainer.appendChild(forecastElement);
  });
}

// Display error messages
function displayError(message) {
  forecastContainer.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
  weatherInfo.classList.remove("show");
}