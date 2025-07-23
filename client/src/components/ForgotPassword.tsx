import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { enqueueSnackbar } from "notistack";

interface Props {
  onSubmit: (email: string) => void;
}

const ForgotPasswordCom: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada API çağırışı edə bilərsən (məsələn: await axios.post...)
    onSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Talk<span className="text-yellow-500">sy</span>
        </h1>
        <p className="text-center  mb-6">Forgot your password?</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium">
            Email Address
            <input
              type="email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordCom;
