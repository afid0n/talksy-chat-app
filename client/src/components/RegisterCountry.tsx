import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getLocalizedCountries } from "@/services/countriesAPI";

interface LocalizedCountry {
  code: string;
  name: string;
  cities: string[];
}

const RegisterCountry = ({ onNext }: { onNext: () => void }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [countries, setCountries] = useState<LocalizedCountry[]>([]);
  const [loading, setLoading] = useState(true);

  // You can store the selected language here or get it from context/store
  const lang = "en"; // For example, hardcoded now

  useEffect(() => {
    async function loadCountries() {
      setLoading(true);
      const data = getLocalizedCountries(lang); // synchronous since mock
      setCountries(data);
      setLoading(false);
    }
    loadCountries();
  }, [lang]);

  // Create array like "City, CountryName"
  const cityCountryList = countries.flatMap((country) =>
    country.cities.map((city) => `${city}, ${country.name}`)
  );

  const filtered = cityCountryList.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Where are you from?
      </h2>
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        Help us connect you with people nearby
      </p>

      <input
        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded outline-none focus:ring-2 focus:ring-yellow-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your city and country"
        autoComplete="off"
      />

      {loading && (
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading countries...</p>
      )}

      {!loading && query && (
        <ul className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow mt-2 rounded max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item}
                className={`p-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-600/20 dark:text-gray-100 ${
                  selected === item ? "bg-yellow-200 dark:bg-yellow-700" : ""
                }`}
                onClick={() => {
                  setSelected(item);
                  onNext();
                }}
              >
                {item}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500 dark:text-gray-400">No matches found</li>
          )}
        </ul>
      )}
    </motion.div>
  );
};

export default RegisterCountry;
