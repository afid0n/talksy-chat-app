import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Image,
  MessageCircle,
  MessageCircleMore,
} from "lucide-react";

interface HomeIntroSliderProps {
  onNext: () => void;
}

const slides = [
  {
    title: "Connect globally",
    desc: "Meet new people around the world.",
    color: "text-green-500",
    icon: <Globe className="text-green-500" />,
  },
  {
    title: "Real-time messaging",
    desc: "Chat instantly with friends and colleagues.",
    color: "text-blue-500",
    icon: <MessageCircleMore className="text-blue-500" />,
  },
  {
    title: "Share media securely",
    desc: "Send images and videos with privacy.",
    color: "text-purple-500",
    icon: <Image className="text-purple-500" />,
  },
];

const HomeIntroSlider: React.FC<HomeIntroSliderProps> = ({ onNext }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(true);
  const [done, setDone] = useState(false);

  const isLastSlide = index === slides.length - 1;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const fullText = slides[index].title;

    if (done) return;

    if (typing) {
      if (displayText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => fullText.slice(0, prev.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setTyping(false), 1200);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, prev.length - 1));
        }, 50);
      } else {
        if (isLastSlide) {
          setDone(true);
        } else {
          setIndex((prev) => prev + 1);
          setTyping(true);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, typing, index, isLastSlide, done]);

  const skip = () => {
    const last = slides.length - 1;
    setIndex(last);
    setDisplayText(slides[last].title);
    setTyping(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 text-center  text-black dark:text-white transition-colors">
      {!done && (
        <button
          onClick={skip}
          className="absolute top-5 right-5 bg-white dark:bg-zinc-800 px-4 py-1 border border-gray-200 dark:border-zinc-600 rounded-3xl text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          Skip
        </button>
      )}

      <motion.div
        className="flex items-center justify-center gap-7 mb-16"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.2,
        }}
      >
        <div className="bg-white dark:bg-zinc-800 p-3 border border-gray-200 dark:border-zinc-600 rounded-xl shadow-md">
          <MessageCircle size={30} className="text-yellow-300" />
        </div>
        <p className="text-5xl font-semibold text-black dark:text-white">
          Talk<span className="text-yellow-500">sy</span>
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="flex flex-col items-center gap-6 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white dark:bg-zinc-800 opacity-75 p-6 rounded-xl shadow-xl"
          >
            {slides[index].icon}
          </motion.div>

          <h2 className="text-3xl font-bold h-10">
            {displayText}
            <span className="border-r-2 border-black dark:border-white ml-1 animate-pulse" />
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-base">{slides[index].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex mt-10 gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-yellow-500 w-5" : "bg-gray-300 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {done && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onNext}
          className="mt-10 bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition"
        >
          Next
        </motion.button>
      )}
    </div>
  );
};

export default HomeIntroSlider;
