import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChooseLang from "@/components/ChooseLang";
import Hero from "@/components/Hero";
import HomeIntroSlider from "@/components/HomeIntroSlider";

const Home = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("hasSeenIntro")) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleNext = () => {
    if (step === 2) {
      localStorage.setItem("hasSeenIntro", "true");
      navigate("/auth/login");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {step === 0 && <ChooseLang onNext={handleNext} />}
      {step === 1 && <HomeIntroSlider onNext={handleNext} />}
      {step === 2 && <Hero onNext={handleNext} />}
    </div>
  );
};

export default Home;
