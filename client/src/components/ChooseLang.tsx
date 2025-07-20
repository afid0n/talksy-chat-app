import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChooseLangProps {
    onNext: () => void;
}

const ChooseLang: React.FC<ChooseLangProps> = ({ onNext }) => {
    const languages = [
        { code: "US", name: "English" },
        { code: "AZ", name: "Azərbaycan" },
        { code: "RU", name: "Русский" },
        { code: "TR", name: "Türkçe" },
    ];

    return (
        <motion.div
            className="flex items-center justify-center flex-col min-h-screen"
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
                <div className="bg-white p-3 border rounded-xl shadow-md">
                    <MessageCircle size={30} className="text-yellow-300" />
                </div>
                <p className="text-5xl font-semibold">
                    Talk<span className="text-yellow-500">sy</span>
                </p>
            </motion.div>

            <motion.p
                className="py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Choose your language
            </motion.p>

            {/* Language Buttons */}
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
                        className="flex items-center bg-white border rounded-lg w-lg px-3 gap-4 py-3 cursor-pointer shadow-sm
               hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-300"
                        onClick={onNext}
                    >
                        <span className="text-2xl">{lang.code}</span>
                        <p className="text-lg">{lang.name}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default ChooseLang;
