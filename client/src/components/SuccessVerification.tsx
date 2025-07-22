import { CheckCircle2 } from "lucide-react";

const SuccessVerification = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-black transition-colors">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-8 rounded-xl shadow-lg flex flex-col items-center transition">
        <CheckCircle2 className="text-green-500 mb-4" size={64} />

        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          Email Verified!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xs">
          Your email has been successfully verified. You can now log in and start
          using <span className="font-semibold text-yellow-500">Talksy</span>!
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
