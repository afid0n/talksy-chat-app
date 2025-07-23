import mockCountries from "../data/mockCountries";
import type { LanguageCode, LocalizedCountry } from "../types/Country";


export const getLocalizedCountries = (lang: LanguageCode): LocalizedCountry[] => {
  return mockCountries.map((country) => ({
    code: country.code,
    name: country.name[lang],
    cities: country.cities,
  }));
};

