import { XCircle } from "lucide-react";

interface FailedVerificationProps {
  onResend: () => void;
  onBack: () => void;
}

const FailedVerification: React.FC<FailedVerificationProps> = ({ onResend, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-black transition-colors">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-8 rounded-xl shadow-lg flex flex-col items-center transition">
        <XCircle className="text-red-500 mb-4" size={64} />
        
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          Verification Failed
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xs">
          We couldn't verify your email. The verification link may have expired or
          is invalid.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onResend}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Resend Email
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
