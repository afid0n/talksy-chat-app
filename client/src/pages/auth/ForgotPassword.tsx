import React, { useState } from "react";
import ForgotPasswordCom from "@/components/ForgotPassword";
import CheckEmail from "@/components/CheckEmail";

const ForgotPassword = () => {
  const [step, setStep] = useState<"form" | "check">("form");
  const [email, setEmail] = useState("");

  const handleSubmit = (userEmail: string) => {
    setEmail(userEmail);
    setStep("check");
  };

  return (
    <div>
      {step === "form" ? (
        <ForgotPasswordCom onSubmit={handleSubmit} />
      ) : (
        <CheckEmail email={email} />
      )}
    </div>
  );
};

export default ForgotPassword;
