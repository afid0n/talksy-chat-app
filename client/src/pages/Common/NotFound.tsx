import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center px-4">
      <motion.div
        className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-10 max-w-xl w-full text-center border-2 border-yellow-300"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
      >
        <motion.h1
          className="text-[100px] font-extrabold text-yellow-400 drop-shadow-md"
          initial={{ y: -50 }}
          animate={{
            y: [-50, 0, -10, 0],
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-gray-700 dark:text-gray-100 text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Whoops! This page vanished into the sunshine 🌞
        </motion.p>

        <motion.button
          onClick={() => navigate(-1)}
          className="bg-yellow-300 cursor-pointer text-gray-800 font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-yellow-400 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
           Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
