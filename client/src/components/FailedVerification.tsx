import { XCircle } from "lucide-react";

interface FailedVerificationProps {
  onResend: () => void;
  onBack: () => void;
  resending?: boolean;
}

const FailedVerification: React.FC<FailedVerificationProps> = ({ onResend, onBack, resending = false }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg flex flex-col items-center">
        <XCircle className="text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2 dark:text-white text-gray-800">
          Verification Failed
        </h1>
        <p className="text-gray-600 dark:text-gray-200 mb-6 text-center max-w-xs">
          We couldn't verify your email. The verification link may have expired or
          is invalid.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onResend}
            disabled={resending}
            className={`bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full transition hover:bg-yellow-600 ${
              resending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resending ? "Resending..." : "Resend Email"}
          </button>
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-full transition"
          >
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedVerification;
