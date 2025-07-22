import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Cake } from "lucide-react";

const RegisterBirthday = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = React.useState(false);

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-gray-800 dark:text-gray-100"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Select your birthday</h2>

      {!showCalendar && (
        <button
          onClick={() => setShowCalendar(true)}
          className="bg-yellow-400 dark:bg-yellow-500 flex items-center gap-2 w-full justify-center text-lg text-white px-6 py-2 rounded mb-4 hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all"
        >
          <p>Click to select birthday</p>
          <Cake />
        </button>
      )}

      {showCalendar && (
        <div className="mb-4 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm"
            captionLayout="dropdown"
          />
        </div>
      )}

      {date && (
        <div className="mt-2 mb-4 text-center text-gray-700 dark:text-gray-300">
          <p>
            🎂 Your birthday is{" "}
            <strong>{format(date, "MMMM d, yyyy")}</strong>
          </p>
          <p>
            🎉 You are <strong>{calculateAge(date)}</strong> years old
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="text-sm underline text-gray-600 dark:text-gray-400"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!date}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-yellow-600 dark:hover:bg-yellow-600"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterBirthday;
