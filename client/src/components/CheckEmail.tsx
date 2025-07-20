import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

interface Props {
  email: string;
}

const CheckEmail: React.FC<Props> = ({ email }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-1">
          🔊 Chat <span className="text-green-500">Wave</span>
        </h1>
        <p className="text-lg font-medium text-gray-600 mb-6">Check your email</p>

        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <FaEnvelope className="text-green-500 text-3xl" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">Check your email</h2>
          <p className="text-gray-500 text-sm mb-4">
            We've sent a password reset link to <br />
            <span className="font-medium text-black">{email}</span>
          </p>

          <button className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md mb-4">
            Try Another Email
          </button>

          <Link
            to="/login"
            className="text-green-500 hover:underline text-sm font-medium"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
