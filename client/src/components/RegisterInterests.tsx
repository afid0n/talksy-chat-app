import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { t } from "i18next";

const allInterests = [
  "travel", "reading", "fitness", "coding", "music", "dogs", "cats", "gaming", "netflix",
  "photography", "art", "fashion", "cooking", "dancing", "movies", "hiking",
  "writing", "tech", "sports", "basketball", "football", "cycling", "skateboarding",
  "swimming", "diy", "makeup", "foodie", "gardening", "astrology",
  "startups", "blogging", "languages", "puzzles", "board_games", "podcasts", "history",
  "science", "architecture", "theater"
];

interface RegisterInterestsProps {
  onNext: () => void;
  onBack: () => void;
  setInterests: (interests: string[]) => void;
  initialInterests?: string[];
}

const RegisterInterests = ({
  onNext,
  onBack,
  setInterests,
  initialInterests = [],
}: RegisterInterestsProps) => {
  const [selected, setSelected] = useState<string[]>(initialInterests);

  useEffect(() => {
    setInterests(selected);
  }, [selected, setInterests]);

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
      className="w-full max-w-4xl px-4 sm:px-6 md:px-10 mx-auto"
    >
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 dark:text-white text-center sm:text-left">
        {t("register_interests_title")}
      </h2>
      <p className="mb-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center sm:text-left">
        {t("register_interests_subtitle")}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allInterests.map((interest) => {
          const isSelected = selected.includes(interest);
          const isDisabled = selected.length >= 5 && !isSelected;

          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              disabled={isDisabled}
              className={`
                p-2 rounded border text-xs sm:text-sm transition text-center
                ${isSelected
                  ? "bg-yellow-400 text-white"
                  : isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-gray-100 hover:bg-gray-200 cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                }
              `}
              type="button"
            >
              {t(`register_interests_${interest}`)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mt-6 gap-3 sm:gap-0">
        <button
          onClick={onBack}
          className="text-sm underline text-gray-600 dark:text-gray-300"
          type="button"
        >
          {t("register_interests_back")}
        </button>
        <button
          onClick={onNext}
          disabled={selected.length < 3}
          className="bg-yellow-500 text-white text-sm px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {t("register_interests_continue")}
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterInterests;
