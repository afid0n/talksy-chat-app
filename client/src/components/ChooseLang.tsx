import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "i18next";
import { useState } from "react";
import i18n from "@/i18n/config";

interface ChooseLangProps {
  onNext: () => void;
}



const ChooseLang: React.FC<ChooseLangProps> = ({ onNext }) => {
  const [language, setLanguage] = useState<string>(i18n.language || "en");

  const languages = [
    { code: "en", label: "US", name: t("english") },
    { code: "az", label: "AZ", name: t("azerbaijani") },
    { code: "ru", label: "RU", name: t("russian") },
    { code: "tr", label: "TR", name: t("turkish") },
  ];

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    onNext();
  };
  return (
    <motion.div
      className="flex items-center justify-center flex-col min-h-screen  text-black dark:text-white transition-colors"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-center gap-7"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white dark:bg-zinc-900 p-3 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md">
          <MessageCircle size={30} className="text-yellow-300" />
        </div>
        <p className="text-5xl font-semibold text-black dark:text-white">
          Talk<span className="text-yellow-500">sy</span>
        </p>
      </motion.div>

      <motion.p
        className="py-4 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("choose_language")}
      </motion.p>

      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {languages.map((lang) => (
          <motion.div
            key={lang.code}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg w-lg px-3 gap-4 py-3 cursor-pointer shadow-sm
              hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="text-2xl text-black dark:text-white">{lang.code}</span>
            <p className="text-lg text-black dark:text-white">{lang.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChooseLang;
