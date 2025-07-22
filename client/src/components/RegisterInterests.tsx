import { useState } from "react";
import { motion } from "framer-motion";

const allInterests = [
  "Travel", "Reading", "Fitness", "Coding", "Music", "Dogs", "Cats", "Gaming", "Netflix",
  "Photography", "Art", "Fashion", "Cooking", "Dancing", "Movies", "Hiking",
  "Writing", "Tech", "Sports", "Basketball", "Football", "Cycling", "Skateboarding",
  "Swimming", "DIY", "Makeup", "Foodie", "Gardening", "Astrology", 
  "Startups", "Blogging", "Languages", "Puzzles", "Board Games", "Podcasts", "History",
  "Science", "Architecture", "Theater"
];

const RegisterInterests = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter((i) => i !== interest));
    } else if (selected.length < 5) {
      setSelected([...selected, interest]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 className="text-2xl font-bold mb-2 dark:text-white">What are your interests?</h2>
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        Select 3-5 interests to personalize your experience
      </p>

      <div className="grid grid-cols-3 gap-3">
        {allInterests.map((interest) => {
          const isSelected = selected.includes(interest);
          const isDisabled = selected.length >= 5 && !isSelected;

          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              disabled={isDisabled}
              className={`
                p-2 rounded border text-sm transition
                ${
                  isSelected
                    ? "bg-yellow-400 text-white"
                    : isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-gray-100 hover:bg-gray-200 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                }
              `}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="text-sm underline text-gray-600 dark:text-gray-300"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length < 3}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterInterests;
