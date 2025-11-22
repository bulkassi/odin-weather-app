import { createWeatherApiHandler } from "./api/weatherApiHandler";
import { weatherCodes } from "./api/weatherCodes";

const createScreenController = (doc) => {
  const weatherApiHandler = createWeatherApiHandler();

  const searchInput = doc.querySelector(".city-pick-input");
  const searchButton = doc.querySelector(".city-pick-resolve");
  const loadingRing = doc.querySelector(".resolve-ring");
  const body = doc.querySelector("body");

  // Current weather elements
  const currentIcon = doc.querySelector(".weather-icon");
  const currentDesc = doc.querySelector(".weather-icon-description");
  const currentTemp = doc.querySelector(".forecast-temp b");
  const currentFeelsLike = doc.querySelector(".forecast-feels-like b");
  const currentHumidity = doc.querySelector(".forecast-humidity b");

  // Daily forecast container
  const dailyContainer = doc.querySelector(".forecast-daily-set");

  const updateScreen = (data) => {
    // Update current weather
    const current = data.currentConditions;

    import(`./assets/svg/${current.iconName}.svg`)
      .then((module) => {
        currentIcon.src = module.default;
      })
      .catch((err) => console.error(err));

    currentIcon.alt = current.iconName;
    currentDesc.textContent = current.conditions.desc[0];
    currentTemp.textContent = `${current.temp}°C`;
    currentFeelsLike.textContent = `${current.feelsLike}°C`;
    currentHumidity.textContent = `${current.humidity}%`;

    // Update background color
    const code = current.conditions.codes[0];
    if (weatherCodes[code]) {
      body.style.backgroundColor = weatherCodes[code].colors[0];
    }

    // Update daily forecast
    dailyContainer.innerHTML = "";
    const nextDays = data.dailyConditions;

    nextDays.forEach((dayData) => {
      const dayItem = doc.createElement("div");
      dayItem.classList.add("forecast-daily-item");

      const dayName = doc.createElement("p");
      dayName.classList.add("forecast-daily-item-day");
      dayName.textContent = dayData.day;

      const dayIcon = doc.createElement("img");
      dayIcon.classList.add("forecast-daily-item-icon");

      import(`./assets/svg/${dayData.iconName}.svg`)
        .then((module) => {
          dayIcon.src = module.default;
        })
        .catch((err) => console.error(err));

      dayIcon.alt = dayData.iconName;

      const dayTemp = doc.createElement("p");
      dayTemp.classList.add("forecast-daily-item-temp");
      const tempB = doc.createElement("b");
      tempB.textContent = `${dayData.temp.max}°C`; // Using max temp
      dayTemp.appendChild(tempB);

      dayItem.appendChild(dayName);
      dayItem.appendChild(dayIcon);
      dayItem.appendChild(dayTemp);

      dailyContainer.appendChild(dayItem);
    });
  };

  const fetchWeather = async (city) => {
    try {
      loadingRing.style.display = "flex";
      const data = await weatherApiHandler.getWeatherData(city);
      updateScreen(data);
    } catch (error) {
      console.error("Failed to fetch weather data", error);
    } finally {
      loadingRing.style.display = "none";
    }
  };

  searchButton.addEventListener("click", () => {
    const city = searchInput.value;
    if (city) {
      fetchWeather(city);
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = searchInput.value;
      if (city) {
        console.log(city);
        fetchWeather(city);
      }
    }
  });

  loadingRing.style.display = "none";
};

export { createScreenController };
