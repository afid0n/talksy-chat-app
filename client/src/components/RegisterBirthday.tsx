import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Cake } from "lucide-react";
import { t } from "i18next";

interface RegisterBirthdayProps {
  onNext: () => void;
  onBack: () => void;
  setBirthday: (date: Date) => void;
  birthday?: Date | null;
}

const RegisterBirthday = ({
  onNext,
  onBack,
  setBirthday,
  birthday = null,
}: RegisterBirthdayProps) => {
  const [date, setDate] = useState<Date | undefined>(birthday || undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isTooYoung, setIsTooYoung] = useState(false);

  useEffect(() => {
    if (birthday) {
      setDate(birthday);
      setShowCalendar(true);
    }
  }, [birthday]);

  useEffect(() => {
    if (date) {
      const age = calculateAge(date);
      setIsTooYoung(age < 16);
      setBirthday(date);
    }
  }, [date, setBirthday]);

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
      className="text-gray-800 dark:text-gray-100 px-4 sm:px-6 md:px-10 py-6 max-w-md w-full mx-auto"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        {t("register_birthday_title")}
      </h2>

      {!showCalendar && (
        <button
          onClick={() => setShowCalendar(true)}
          className="bg-yellow-400 dark:bg-yellow-500 flex items-center gap-2 w-full justify-center text-base sm:text-lg text-white px-6 py-2 rounded mb-4 hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all"
          type="button"
        >
          <p>{t("register_birthday_click")}</p>
          <Cake size={20} />
        </button>
      )}

      {showCalendar && (
        <div className="mb-4 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-sm w-full sm:w-auto"
            captionLayout="dropdown"
          />
        </div>
      )}

      {date && (
        <div className="mt-2 mb-4 text-center text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            🎂 {t("register_birthday_is")}{" "}
            <strong>{format(date, "MMMM d, yyyy")}</strong>
          </p>
          <p>
            🎉 {t("register_birthday_age")}{" "}
            <strong>{calculateAge(date)}</strong>
          </p>
          {isTooYoung && (
            <p className="text-red-500 mt-2 text-sm sm:text-base">
              {t("register_birthday_min_age_error")}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="text-sm underline text-gray-600 dark:text-gray-400"
          type="button"
        >
          {t("register_back")}
        </button>
        <button
          onClick={onNext}
          disabled={!date || isTooYoung}
          className="bg-yellow-500 text-white px-4 py-2 rounded text-sm sm:text-base disabled:opacity-50 hover:bg-yellow-600 dark:hover:bg-yellow-600 transition-all"
          type="button"
        >
          {t("register_continue")}
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterBirthday;
