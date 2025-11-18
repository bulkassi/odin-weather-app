import citiesData from "cities.json";

const russianCities = citiesData
  .filter((city) => city.country === "RU")
  .map((city) => city.name);

export const cities = russianCities;
