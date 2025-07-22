import { useState } from "react";
import { motion } from "framer-motion";

const cities = [
  "Baku, Azerbaijan",
  "London, UK",
  "New York, USA",
  "Berlin, Germany",
  "Tokyo, Japan",
];

const RegisterCountry = ({ onNext }: { onNext: () => void }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = cities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
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
      />

      {query && (
        <ul className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow mt-2 rounded">
          {filtered.map((city) => (
            <li
              key={city}
              className="p-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-600/20 dark:text-gray-100"
              onClick={() => {
                setSelected(city);
                onNext();
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default RegisterCountry;
