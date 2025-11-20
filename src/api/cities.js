import { City, Country, State } from "country-state-city";

const russianStates = State.getStatesOfCountry("RU");
const cityStateCollection = [];

for (const state of russianStates) {
  const citiesOfState = City.getCitiesOfState("RU", state.isoCode);

  for (const city of citiesOfState) {
    cityStateCollection.push({
      city: city.name,
      state: state.name,
    });
  }
}

export { cityStateCollection };
