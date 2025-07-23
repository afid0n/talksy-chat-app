import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

interface Props {
  email: string;
}

const CheckEmail: React.FC<Props> = ({ email }) => {

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-white mb-1">
          Talk<span className="text-yellow-500">sy</span>
        </h1>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-200 mb-6">Check your email</p>

        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 p-4 rounded-full mb-4">
            <FaEnvelope className="text-yellow-500 text-3xl" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            We've sent a password reset link to <br />
            <span className="font-medium pt-3 text-black dark:text-white ">{email}</span>
          </p>
    

          <Link
            to="/auth/login"
            className="text-yellow-500 hover:underline text-sm font-medium"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
