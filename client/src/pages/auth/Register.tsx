import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (captchaVerified) {
      console.log('Form submitted!', { username, fullname, email, password });
      alert("Uğurla qeydiyyatdan keçdiniz!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-black dark:text-white">Chat </span>
          <span className="text-green-600">Wave</span>
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">Create your account</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Almost there! Just a few more details</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-md rounded-lg p-8 w-full max-w-md transition"
      >
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 mb-4 border border-gray-300 dark:border-zinc-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <FaGoogle className="mr-2" /> Sign up with Google
        </button>

        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
          <span className="mx-3">or create with email</span>
          <span className="border-t border-gray-300 dark:border-zinc-600 flex-grow" />
        </div>

        {/* Inputs */}
        {[
          { label: "Username", value: username, setValue: setUsername, type: "text", placeholder: "Choose a username" },
          { label: "Full Name", value: fullname, setValue: setFullname, type: "text", placeholder: "Enter your full name" },
          { label: "Email Address", value: email, setValue: setEmail, type: "email", placeholder: "Enter your email" },
          { label: "Password", value: password, setValue: setPassword, type: "password", placeholder: "Create a password" },
        ].map(({ label, value, setValue, type, placeholder }) => (
          <div className="mb-4" key={label}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        ))}

        {/* reCAPTCHA */}
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Security Verification</p>
          <ReCAPTCHA
            sitekey="6Ld0A4orAAAAAIguOQtslv-xTFOyrSDMgkRmLeax"
            onChange={handleCaptchaChange}
          />
          {formSubmitted && !captchaVerified && (
            <p className="text-red-500 text-xs mt-2">
              Please complete the reCAPTCHA verification above
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4 mt-6">
          <button
            type="button"
            className="w-1/2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
            disabled={!captchaVerified}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
