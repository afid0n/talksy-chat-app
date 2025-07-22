import { CheckCircle2 } from "lucide-react";

const SuccessVerification = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg flex flex-col items-center">
        <CheckCircle2 className="text-green-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-50">
          Email Verified!
        </h1>
        <p className="text-gray-600 dark:text-gray-200 mb-6 text-center max-w-xs">
          Your email has been successfully verified. You can now log in and start
          using Talksy!
        </p>
        <a
          href="/auth/login"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default SuccessVerification;
