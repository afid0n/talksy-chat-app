import { motion } from "framer-motion";

interface HeroProps {
  onNext: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNext }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Arxa dairə effekti */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-yellow-100 dark:bg-yellow-900 rounded-full blur-3xl opacity-50 z-0" />

      <motion.div
        className="text-center max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 text-transparent bg-clip-text mb-6 drop-shadow-md"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect. Chat. Grow.
        </motion.h1>

        <motion.p
          className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Meet people who share your passions – from around the world 🌍
        </motion.p>

        <motion.button
          className="px-10 py-3 cursor-pointer bg-yellow-400 text-white font-bold rounded-full shadow-md hover:scale-105 hover:bg-yellow-500 transition-all duration-300"
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
        >
          🚀 Start Chatting Now
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
