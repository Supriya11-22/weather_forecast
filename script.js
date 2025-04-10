const apiKey = "8585b6e6daed20d11798a8b547274833";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");

let debounceTimer;

cityInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  const query = cityInput.value.trim();

  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(() => {
    fetchCitySuggestions(query);
  }, 300); // wait 300ms after typing stops
});

async function fetchCitySuggestions(query) {
  try {
    const res = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&sort=-population&limit=10`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": "32106af6d5msh1128f3b83ffe198p1cc547jsnbab792910f21",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com"
        }
      }
    );

    const data = await res.json();
    const cities = data.data;

    if (cities.length === 0) {
      suggestionsBox.innerHTML = "<div>No cities found.</div>";
      return;
    }

    suggestionsBox.innerHTML = cities
      .map(city => `<div onclick="selectCity('${city.city}')">${city.city}, ${city.countryCode}</div>`)
      .join("");
  } catch (err) {
    console.error("Suggestion error:", err);
    suggestionsBox.innerHTML = "<div>Failed to load suggestions.</div>";
  }
}

// Close suggestion box on outside click
document.addEventListener("click", (event) => {
  const isClickInsideInput = cityInput.contains(event.target);
  const isClickInsideSuggestions = suggestionsBox.contains(event.target);

  if (!isClickInsideInput && !isClickInsideSuggestions) {
    suggestionsBox.innerHTML = "";
  }
});

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherInfo = document.getElementById("weatherInfo");

  if (!city) {
    weatherInfo.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) {
      weatherInfo.innerHTML = `<p>City not found. Try again.</p>`;
      return;
    }

    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { description, icon } = data.weather[0];

    weatherInfo.innerHTML = `
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p><strong>${description.toUpperCase()}</strong></p>
      <p>🌡️ Temperature: ${temp}°C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬️ Wind Speed: ${speed} m/s</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = "<p>Error fetching data.</p>";
  }
}

const toggleBtn = document.getElementById("toggleDark");
const body = document.body;

// Load saved theme
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("dark");
        toggleBtn.textContent = "☀️ Light Mode";
    } else {
        toggleBtn.textContent = "🌙 Dark Mode";
    }
});

// Toggle on click
toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙 Dark Mode";
    }
});
