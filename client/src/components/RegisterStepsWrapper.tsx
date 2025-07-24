import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import RegisterBirthday from "@/components/RegisterBirthday";
import RegisterCountry from "@/components/RegisterCountry";
import RegisterForm from "@/components/RegisterForm";
import RegisterInterests from "@/components/RegisterInterests";
import { AnimatePresence } from "framer-motion";
import { registerUser } from "@/services/userService";
import type { RegisterPayload } from "@/types/Auth";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


export default function RegisterStepsWrapper() {


  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState<{ country: string; city: string }>(() => {
    const saved = localStorage.getItem("register_location");
    return saved ? JSON.parse(saved) : { country: "", city: "" };
  });

  const [interests, setInterests] = useState<string[]>(() => {
    const saved = localStorage.getItem("register_interests");
    return saved ? JSON.parse(saved) : [];
  });

  const [birthday, setBirthday] = useState<Date | null>(() => {
    const saved = localStorage.getItem("register_birthday");
    return saved ? new Date(saved) : null;
  });

  const updateLocation = (loc: { country: string; city: string }) => {
    setLocation(loc);
    localStorage.setItem("register_location", JSON.stringify(loc));
  };

  const updateInterests = (ints: string[]) => {
    setInterests(ints);
    localStorage.setItem("register_interests", JSON.stringify(ints));
  };

  const updateBirthday = (date: Date | null) => {
    setBirthday(date);
    if (date) localStorage.setItem("register_birthday", date.toISOString());
    else localStorage.removeItem("register_birthday");
  };


  const next = () => step < 3 && setStep((prev) => prev + 1);
  const back = () => step > 0 && setStep((prev) => prev - 1);
  const navigate = useNavigate();


  const handleSubmit = async (values: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const birthdayIso = birthday ? birthday.toISOString() : localStorage.getItem("register_birthday") || "";

      const payload: RegisterPayload = {
        email: values.email,
        username: values.username,
        fullName: values.fullName,
        authProvider: "local",
        password: values.password,
        birthday: birthdayIso,
        location: location.country
          ? location
          : JSON.parse(localStorage.getItem("register_location") || '{"country":"","city":""}'),
        interests: interests.length
          ? interests
          : JSON.parse(localStorage.getItem("register_interests") || "[]"),
        language: navigator.language || "en",
      };

      console.log("📦 Sending register payload:", payload);
      await registerUser(payload);
      localStorage.removeItem("register_location");
      localStorage.removeItem("register_interests");
      localStorage.removeItem("register_birthday");

      enqueueSnackbar("Successfully registered! Verify your email", { variant: "success" });
      navigate("/auth/login");
    } catch (err: any) {
      enqueueSnackbar(err.message || "Registration failed", { variant: "error" });
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
            <RegisterCountry key="step1" onNext={next} setLocation={updateLocation} />
          )}
          {step === 1 && (
            <RegisterInterests key="step2" onNext={next} onBack={back} setInterests={updateInterests} />
          )}
          {step === 2 && (
            <RegisterBirthday key="step3" onNext={next} onBack={back} setBirthday={updateBirthday} />
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
