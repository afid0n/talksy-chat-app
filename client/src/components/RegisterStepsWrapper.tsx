import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import RegisterBirthday from "@/components/RegisterBirthday";
import RegisterCountry from "@/components/RegisterCountry";
import RegisterForm from "@/components/RegisterForm";
import RegisterInterests from "@/components/RegisterInterests";
import { AnimatePresence } from "framer-motion";

export default function RegisterStepsWrapper() {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const back = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-black dark:text-white transition-colors">
      {/* Logo/Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-500">sy</span>
        </h1>
      </div>

      {/* Step Container */}
      <div className="w-5xl sm:max-w-xl mx-0 bg-white dark:bg-zinc-900  sm:p-8 rounded-2xl shadow-md">
        <ProgressBar currentStep={step + 1} totalSteps={4} />
        <AnimatePresence mode="wait">
          {step === 0 && <RegisterCountry key="step1" onNext={next} />}
          {step === 1 && <RegisterInterests key="step2" onNext={next} onBack={back} />}
          {step === 2 && <RegisterBirthday key="step3" onNext={next} onBack={back} />}
          {step === 3 && <RegisterForm key="step4" onBack={back} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
