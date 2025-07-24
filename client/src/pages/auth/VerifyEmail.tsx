import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FailedVerification from "@/components/FailedVerification";
import SuccessVerification from "@/components/SuccessVerification";
import { enqueueSnackbar } from "notistack";
import { resendVerificationEmail } from "@/services/userService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading");
  const [resending, setResending] = useState(false);

  const email = searchParams.get("email") || "";
  const message = searchParams.get("message")?.toLowerCase() || "";

  useEffect(() => {
    if (!message) {
      setStatus("failed");
    } else if (message.includes("verified")) {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [message]);

  const handleResend = async () => {
    if (!email) {
      enqueueSnackbar("No email found to resend verification.", { variant: "error" });
      return;
    }

    try {
      setResending(true);
      const res = await resendVerificationEmail(email);

      if (res.success) {
        enqueueSnackbar(res.message || "Verification email resent! Please check your inbox.", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.message || "Failed to resend verification email.", { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "Error resending verification email.", { variant: "error" });
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    window.location.href = "/auth/register";
  };

  if (status === "loading") return null; 

  return (
    <>
      {status === "success" ? (
        <SuccessVerification />
      ) : (
        <FailedVerification onResend={handleResend} onBack={handleBack} resending={resending} />
      )}
    </>
  );
};

export default VerifyEmail;
