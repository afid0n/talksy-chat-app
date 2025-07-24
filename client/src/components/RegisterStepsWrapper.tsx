import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import RegisterBirthday from "@/components/RegisterBirthday";
import RegisterCountry from "@/components/RegisterCountry";
import RegisterForm from "@/components/RegisterForm";
import RegisterInterests from "@/components/RegisterInterests";
import { AnimatePresence } from "framer-motion";
import { registerUser } from "@/services/userService";
import type { RegisterPayload } from "@/types/Auth";

export default function RegisterStepsWrapper() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Central state
  const [location, setLocation] = useState({ country: "", city: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [birthday, setBirthday] = useState<Date | null>(null);


  const next = () => step < 3 && setStep((prev) => prev + 1);
  const back = () => step > 0 && setStep((prev) => prev - 1);

const handleSubmit = async (values: {
  username: string;
  fullName: string;
  email: string;
  password: string;
}) => {
  setLoading(true);
  try {
    const payload: RegisterPayload = {
      email: values.email,
      username: values.username,
      fullName: values.fullName,
      authProvider: "local",
      password: values.password,
      birthday: birthday ? birthday.toISOString() : "",
      location: {
        country: location.country || "",
        city: location.city || "",
      },
      interests: interests.length ? interests : [],
      language: navigator.language || "en",
    };

    console.log("📦 Sending register payload:", payload);
    await registerUser(payload);
    alert("Successfully registered!");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-black dark:text-white transition-colors">
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-black dark:text-white">Talk</span>
          <span className="text-yellow-500">sy</span>
        </h1>
      </div>

      <div className="w-5xl sm:max-w-xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-md">
        <ProgressBar currentStep={step + 1} totalSteps={4} />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <RegisterCountry key="step1" onNext={next} setLocation={setLocation} />
          )}
          {step === 1 && (
            <RegisterInterests key="step2" onNext={next} onBack={back} setInterests={setInterests} />
          )}
          {step === 2 && (
            <RegisterBirthday key="step3" onNext={next} onBack={back} setBirthday={setBirthday} />
          )}
          {step === 3 && (
            <RegisterForm
              key="step4"
              onBack={back}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
