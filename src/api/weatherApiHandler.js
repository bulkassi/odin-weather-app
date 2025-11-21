import { weatherCodes } from "./weatherCodes";

export const createWeatherApiHandler = function () {
  const API_KEY = "VHDF9P7GWARTB8JCLR6DFHACF";

  const getWeatherData = async function (city) {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&lang=id&include=days%2Ccurrent&key=${API_KEY}&contentType=json`,
    );
    const weatherData = await response.json();

    return {
      location: weatherData.resolvedAddress,
      currentConditions: {
        temp: weatherData.currentConditions.temp,
        feelsLike: weatherData.currentConditions.feelslike,
        conditions: {
          codes: weatherData.currentConditions.conditions.split(", "),
          desc: weatherData.currentConditions.conditions
            .split(", ")
            .map((cond) => weatherCodes[cond].description),
        },
        iconName: weatherData.currentConditions.icon,
      },
      dailyConditions: weatherData.days.slice(0, 8).map((dayData) => {
        return {
          day: dayData.datetime,
          temp: {
            min: dayData.tempmin,
            max: dayData.tempmax,
            avg: dayData.temp,
          },
          feelslike: {
            min: dayData.feelslikemin,
            max: dayData.feelslikemax,
            avg: dayData.feelslike,
          },
          conditions: {
            codes: dayData.conditions.split(", "),
            desc: dayData.conditions
              .split(", ")
              .map((code) => weatherCodes[code].description),
          },
          iconName: dayData.icon,
        };
      }),
    };
  };

  return { getWeatherData };
};
