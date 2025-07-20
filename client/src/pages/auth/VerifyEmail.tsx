
import FailedVerification from "@/components/FailedVerification";
import SuccessVerification from "@/components/SuccessVerification";
import { useState } from "react";


const VerifyEmail = () => {
  const [status, setStatus] = useState<"success" | "failed">("failed");

  // Example handlers for the failed state
  const handleResend = () => {
    // Implement resend logic here
    // setStatus("success") if resend and verify is successful
  };

  const handleBack = () => {
    // Implement navigation to registration page
    window.location.href = "/auth/register";
  };

  return (
    <>
      {status === "success" ? (
        <SuccessVerification/>
      ) : (
        <FailedVerification onResend={handleResend} onBack={handleBack} />
      )}
    </>
  );
};

export default VerifyEmail;